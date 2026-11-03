import 'server-only';

/**
 * Gọi một máy chủ AI theo chuẩn OpenAI (/chat/completions, stream) — ở đây là codex-lb —
 * rồi đổi luồng trả về sang định dạng giao diện đang đọc:
 *   data: {"delta":{"text":"..."}}   … mỗi mẩu chữ
 *   data: {"error":"..."}            … khi lỗi giữa chừng
 *   data: [DONE]
 *
 * Cấu hình bằng biến môi trường (chỉ đọc ở server, không bao giờ gửi xuống trình duyệt):
 *   AI_BASE_URL  ví dụ https://codex.vuongnm.cloud/v1
 *   AI_API_KEY   khoá bí mật
 *   AI_MODEL     mặc định gpt-6.1-sol
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

/** Thời gian tối đa cho một lượt trả lời; quá thì dừng để không giữ kết nối mãi. */
const UPSTREAM_TIMEOUT_MS = 180_000;

export function readAiConfig(): AiConfig | null {
  const baseUrl = process.env.AI_BASE_URL?.trim().replace(/\/+$/, '');
  const apiKey = process.env.AI_API_KEY?.trim();
  if (!baseUrl || !apiKey) return null;
  return { baseUrl, apiKey, model: process.env.AI_MODEL?.trim() || 'gpt-6.1-sol' };
}

export function jsonError(status: number, error: string): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

const encoder = new TextEncoder();
const sse = (payload: unknown) => encoder.encode(`data: ${typeof payload === 'string' ? payload : JSON.stringify(payload)}\n\n`);

/**
 * Mở luồng trả lời. Lỗi trước khi có chữ nào (sai khoá, máy chủ AI tắt…) trả về JSON lỗi để giao
 * diện hiện câu dễ hiểu; lỗi giữa chừng thì gửi một dòng {"error"} trong luồng.
 */
export async function streamChat(
  config: AiConfig,
  messages: ChatMessage[],
  clientSignal: AbortSignal,
  onFinish?: () => void,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  const abortFromClient = () => controller.abort();
  clientSignal.addEventListener('abort', abortFromClient);
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    clearTimeout(timeout);
    clientSignal.removeEventListener('abort', abortFromClient);
    onFinish?.();
  };

  let upstream: Response;
  try {
    upstream = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        // Lớp proxy trước codex-lb chặn User-Agent mặc định của một số thư viện.
        'User-Agent': 'tuvi-app/1.0',
      },
      body: JSON.stringify({ model: config.model, stream: true, messages }),
    });
  } catch {
    cleanup();
    return jsonError(502, 'Không kết nối được tới máy chủ AI. Bạn thử lại sau ít phút nhé.');
  }

  if (!upstream.ok || !upstream.body) {
    cleanup();
    const status = upstream.status;
    console.error(`[ai] máy chủ AI trả mã ${status}`);
    if (status === 401 || status === 403) return jsonError(502, 'Khoá kết nối AI không hợp lệ. Người quản trị cần kiểm tra lại cấu hình.');
    if (status === 429) return jsonError(503, 'Máy chủ AI đang quá tải. Bạn thử lại sau ít phút nhé.');
    return jsonError(502, 'Máy chủ AI đang gặp sự cố. Bạn thử lại sau ít phút nhé.');
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let pending = '';

  const body = new ReadableStream<Uint8Array>({
    async pull(out) {
      try {
        const { done, value } = await reader.read();
        pending += decoder.decode(value, { stream: !done });
        const lines = pending.split('\n');
        pending = done ? '' : lines.pop() ?? '';
        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const chunk = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
            const text = chunk.choices?.[0]?.delta?.content;
            if (text) out.enqueue(sse({ delta: { text } }));
          } catch { /* bỏ qua dòng không phải JSON */ }
        }
        if (done) {
          out.enqueue(sse('[DONE]'));
          out.close();
          cleanup();
        }
      } catch {
        if (!clientSignal.aborted) {
          out.enqueue(sse({ error: 'Bài luận bị ngắt giữa chừng. Bạn bấm lại để luận tiếp nhé.' }));
          out.enqueue(sse('[DONE]'));
        }
        out.close();
        cleanup();
      }
    },
    cancel() {
      controller.abort();
      cleanup();
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
