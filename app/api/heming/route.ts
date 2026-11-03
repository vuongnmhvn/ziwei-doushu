import { chartToPrompt, INTERPRET_SYSTEM_PROMPT } from '@/lib/ai/chart-prompt';
import { jsonError, readAiConfig, streamChat } from '@/lib/ai/llm-stream';
import { acquireSlot, clientIp, rebuildChart, releaseSlot } from '@/lib/ai/request-guard';
import { HEMING_METHODOLOGY } from '@/lib/ziwei/heming-knowledge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_QUESTION = `Hãy xem hợp hôn cho hai lá số này, theo các mục sau:

**【Một câu tóm tắt】**
Hai người hợp nhau tới mức nào, nói trong một câu.

**【Cung Phu Thê và Phúc Đức】**
So cung Phu Thê và cung Phúc Đức của hai người (Nghê sư dặn xem hôn nhân phải xem cả cung Phúc Đức).

**【Hai người bổ sung cho nhau】**
Điểm hợp và điểm dễ va chạm về tính cách, tiền bạc, công việc.

**【Thời điểm】**
Đại hạn hiện tại của hai người có thuận cho chuyện tình cảm, hôn nhân không.

**【Lời khuyên】**
Lời khuyên cụ thể để hai người sống hoà hợp.`;

/** Xem hợp hôn: nhận { chartA, chartB, question? }, trả luồng chữ (SSE). */
export async function POST(req: Request): Promise<Response> {
  const config = readAiConfig();
  if (!config) return jsonError(503, 'Trang này chưa bật tính năng luận giải bằng AI.');

  const body = await req.json().catch(() => null) as { chartA?: unknown; chartB?: unknown; question?: unknown } | null;
  const chartA = rebuildChart(body?.chartA);
  const chartB = rebuildChart(body?.chartB);
  if (!chartA || !chartB) return jsonError(400, 'Thông tin ngày giờ sinh của một trong hai người không hợp lệ. Bạn kiểm tra lại rồi thử nhé.');
  const question = typeof body?.question === 'string' && body.question.trim() ? body.question.trim().slice(0, 2000) : DEFAULT_QUESTION;

  const blocked = acquireSlot(clientIp(req));
  if (blocked) return jsonError(429, blocked);

  const system = [
    INTERPRET_SYSTEM_PROMPT,
    'Lần này bạn xem hợp hôn (so hai lá số). Phương pháp tham khảo dưới đây viết bằng chữ Hán; hãy vận dụng nhưng trả lời bằng tiếng Việt.',
    HEMING_METHODOLOGY,
    `# Lá số người thứ nhất\n${chartToPrompt(chartA)}`,
    `# Lá số người thứ hai\n${chartToPrompt(chartB)}`,
  ].join('\n\n');

  return streamChat(config, [{ role: 'system', content: system }, { role: 'user', content: question }], req.signal, releaseSlot);
}
