import 'server-only';
import { generateChart, type LunarMonthPolicy } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart } from '@/lib/ziwei/types';
import type { ChatMessage } from './llm-stream';

/**
 * Bảo vệ API luận giải: trang công khai nhưng mỗi lượt gọi tốn hạn mức AI của chủ trang.
 * - Giới hạn số lượt theo IP và số lượt chạy cùng lúc (bộ nhớ trong tiến trình; app chạy một container).
 * - Không tin lá số trình duyệt gửi lên: chỉ lấy ngày giờ sinh rồi tự lập lại lá số ở server.
 * - Cắt bớt hội thoại quá dài.
 */

const WINDOW_MS = 15 * 60_000;
const MAX_PER_WINDOW = Number(process.env.AI_RATE_LIMIT_PER_15M) || 30;
const MAX_CONCURRENT = Number(process.env.AI_MAX_CONCURRENT) || 4;
const MAX_MESSAGES = 16;
const MAX_MESSAGE_CHARS = 4000;

const hits = new Map<string, number[]>();
let running = 0;

export function clientIp(req: Request): string {
  return req.headers.get('cf-connecting-ip')
    ?? req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown';
}

/** Trả về câu báo lỗi nếu bị chặn, null nếu được đi tiếp. Được đi tiếp thì phải gọi release() khi xong. */
export function acquireSlot(ip: string): string | null {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return 'Bạn đã hỏi nhiều lần liên tiếp. Hãy nghỉ khoảng 15 phút rồi hỏi tiếp nhé.';
  }
  if (running >= MAX_CONCURRENT) {
    return 'Đang có nhiều người cùng xem luận giải. Bạn thử lại sau một phút nhé.';
  }
  recent.push(now);
  hits.set(ip, recent);
  running++;
  // Dọn IP cũ để bảng không phình mãi.
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (!times.some(t => now - t < WINDOW_MS)) hits.delete(key);
  }
  return null;
}

export function releaseSlot(): void {
  running = Math.max(0, running - 1);
}

const LEAP_POLICIES: LunarMonthPolicy[] = ['split', 'next-month', 'prev-month', 'origin-month'];

/** Lập lại lá số từ ngày giờ sinh trong lá số trình duyệt gửi lên. Dữ liệu sai thì trả null. */
export function rebuildChart(input: unknown): ZiweiChart | null {
  const info = (input as { birthInfo?: Record<string, unknown> } | null)?.birthInfo;
  if (!info || typeof info !== 'object') return null;
  const { year, month, day, hour, gender } = info;
  const leap = info.leapMonthPolicy as LunarMonthPolicy | undefined;
  if (![year, month, day, hour].every(v => Number.isInteger(v))) return null;
  if ((year as number) < 1900 || (year as number) > 2100) return null;
  if (gender !== 'male' && gender !== 'female') return null;
  const birth: BirthInfo = { year: year as number, month: month as number, day: day as number, hour: hour as number, gender };
  try {
    return generateChart(birth, leap && LEAP_POLICIES.includes(leap) ? { leapMonth: leap } : undefined);
  } catch {
    return null;
  }
}

/** Lọc hội thoại: chỉ vai user/assistant, chữ là chuỗi, cắt độ dài, giữ các lượt gần nhất. Lượt cuối phải là câu hỏi. */
export function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  const cleaned = input
    .filter((m): m is { role: 'user' | 'assistant'; content: string } =>
      !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim() !== '')
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }))
    .slice(-MAX_MESSAGES);
  if (!cleaned.length || cleaned[cleaned.length - 1].role !== 'user') return null;
  return cleaned;
}
