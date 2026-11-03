import { chartToPrompt, INTERPRET_SYSTEM_PROMPT } from '@/lib/ai/chart-prompt';
import { jsonError, readAiConfig, streamChat } from '@/lib/ai/llm-stream';
import { acquireSlot, clientIp, rebuildChart, releaseSlot, sanitizeMessages } from '@/lib/ai/request-guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Luận giải một lá số: nhận { chart, messages }, trả luồng chữ (SSE). */
export async function POST(req: Request): Promise<Response> {
  const config = readAiConfig();
  if (!config) return jsonError(503, 'Trang này chưa bật tính năng luận giải bằng AI.');

  const body = await req.json().catch(() => null) as { chart?: unknown; messages?: unknown } | null;
  const chart = rebuildChart(body?.chart);
  if (!chart) return jsonError(400, 'Thông tin ngày giờ sinh không hợp lệ. Bạn lập lại lá số rồi thử lại nhé.');
  const messages = sanitizeMessages(body?.messages);
  if (!messages) return jsonError(400, 'Bạn chưa nhập câu hỏi.');

  const blocked = acquireSlot(clientIp(req));
  if (blocked) return jsonError(429, blocked);

  return streamChat(config, [
    { role: 'system', content: `${INTERPRET_SYSTEM_PROMPT}\n\n# Lá số cần luận\n${chartToPrompt(chart)}` },
    ...messages,
  ], req.signal, releaseSlot);
}
