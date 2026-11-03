'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';
import { vi, viPalace } from '@/lib/i18n/vi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean; // don't show user bubble for auto/topic messages
}

interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

const TOPICS = [
  { key: 'overview',     label: 'Tổng quan' },
  { key: 'love',        label: 'Tình duyên' },
  { key: 'career',      label: 'Công việc' },
  { key: 'wealth',      label: 'Tiền bạc' },
  { key: 'health',      label: 'Sức khoẻ' },
  { key: 'personality', label: 'Tính cách' },
];

// Câu yêu cầu gửi cho AI khi bấm từng chủ đề. Tiêu đề mục viết dạng **【...】** để khung hiển thị tô màu.
const TOPIC_PROMPTS: Record<string, string> = {
  overview: `Hãy luận tổng quan lá số này, theo các mục sau:

**【Một câu tóm tắt】**
Một câu nói lên cách cục chính và khí chất của người này.

**【Cung Mệnh】**
Đặc điểm cốt lõi của chính tinh ở cung Mệnh, theo cách nhìn của Nghê sư.

**【Tài – Quan – Di】**
Ba cung Tài Bạch, Quan Lộc, Thiên Di phối hợp với nhau ra sao.

**【Đại hạn hiện tại】**
Hướng đi của đại hạn đang chạy và điều đáng chú ý nhất.

**【Điểm mạnh và điều cần lưu ý】**
Năng khiếu nổi bật và những rủi ro, bài học cần để ý.`,
  love: `Hãy luận kỹ chuyện tình duyên, hôn nhân, theo các mục sau:

**【Một câu tóm tắt】**
Một câu nói lên kiểu tình duyên của lá số.

**【Cung Phu Thê】**
Chính tinh và Tứ Hoá ở cung Phu Thê, giải thích theo hệ thống của Nghê sư.

**【Các cung liên quan】**
Những cung khác ảnh hưởng tới tình cảm.

**【Mười năm hiện tại】**
Tình cảm trong đại hạn đang chạy và các mốc quan trọng.

**【Lời khuyên】**
Lời khuyên cụ thể, làm được ngay.`,
  career: `Hãy luận kỹ chuyện công việc, sự nghiệp, theo các mục sau:

**【Một câu tóm tắt】**
Một câu nói lên kiểu sự nghiệp: hợp đi làm hay tự kinh doanh.

**【Cung Quan Lộc】**
Chính tinh và Tứ Hoá ở cung Quan Lộc, Nghê sư nhận định thế nào về cách sắp xếp này.

**【Tiền và việc】**
Quan hệ giữa tài lộc và công việc, tiền đến từ đâu.

**【Mười năm hiện tại】**
Hướng đi sự nghiệp trong đại hạn đang chạy.

**【Lời khuyên】**
Hướng đi, ngành nghề và cách làm phù hợp.`,
  wealth: `Hãy luận kỹ chuyện tiền bạc, theo các mục sau:

**【Một câu tóm tắt】**
Một câu nói lên kiểu tài lộc: tự làm ra hay đến một cách thụ động.

**【Cung Tài Bạch】**
Chính tinh và Tứ Hoá ở cung Tài Bạch, tiền đến và đi theo cách nào.

**【Tích luỹ và nhà đất】**
Khả năng để dành và vận nhà cửa, đất đai (cung Điền Trạch).

**【Hiện tại】**
Xu hướng tài lộc hiện nay và điều cần cẩn thận.

**【Lời khuyên】**
Lời khuyên cụ thể về chuyện tiền bạc.`,
  health: `Hãy luận về sức khoẻ, theo các mục sau:

**【Cung Tật Ách】**
Các sao ở cung Tật Ách và ý nghĩa về sức khoẻ.

**【Bộ phận cần chú ý】**
Theo cách nhìn của Nghê sư (lấy cung tụ nhiều sát tinh nhất, đối chiếu địa chi với tạng phủ), nêu những chỗ cần để ý.

**【Hiện tại】**
Xu hướng sức khoẻ hiện nay và những giai đoạn quan trọng.

**【Lời khuyên】**
Điều cần chú ý và cách giữ gìn sức khoẻ. Nhắc người đọc đi khám bác sĩ khi có triệu chứng.`,
  personality: `Hãy luận kỹ tính cách, theo các mục sau:

**【Cung Mệnh】**
Nét tính cách cốt lõi của chính tinh ở cung Mệnh.

**【Tài – Quan – Di】**
Ba cung Tài Bạch, Quan Lộc, Thiên Di ảnh hưởng tới tính cách ra sao.

**【Cách đối xử với người khác】**
Cách giao tiếp, cư xử với mọi người.

**【Điểm mạnh và bài học】**
Năng khiếu và bài học cuộc đời cần đối mặt.`,
};

/** Mỗi cung lo về chuyện gì (khoá là tên cung chữ Hán của bộ máy). */
const PALACE_ROLES: Record<string, string> = {
  '命宫': 'bản thân, tính cách, cách cục bẩm sinh',
  '兄弟': 'anh chị em, người cùng làm ăn',
  '夫妻': 'tình cảm, hôn nhân',
  '子女': 'con cái, người dưới quyền',
  '财帛': 'nguồn tiền, cách kiếm tiền',
  '疾厄': 'sức khoẻ, tai nạn',
  '迁移': 'ra ngoài, đi xa, cơ hội bên ngoài',
  '仆役': 'bạn bè, quý nhân, kẻ tiểu nhân',
  '官禄': 'công việc, địa vị xã hội',
  '田宅': 'nhà cửa, đất đai, gia đình',
  '福德': 'đời sống tinh thần, phúc phần',
  '父母': 'cha mẹ, giấy tờ, hợp đồng',
};

const roleOfPalace = (name: string) => PALACE_ROLES[name] ?? PALACE_ROLES[name.replace(/宫$/, '')] ?? '';

/** Render AI markdown: **【Title】** → gold header, **bold** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/) ?? line.match(/^#{2,4}\s+(.+)$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--t-gold)' }}>
                {sectionMatch[1].replace(/^【|】$/g, '').replace(/\*\*/g, '')}
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} className="font-medium" style={{ color: 'var(--t-text)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-3 ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--t-gold)', opacity: 0.6 }}
        />
      )}
    </div>
  );
}

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]); // always-current copy for closures
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Tự luận phần tổng quan khi mở lá số
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject palace analysis when palace selected
  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${vi(s.name)}${s.siHua ? ' hoá ' + vi(s.siHua) : ''}`).join(', ')
      : 'không có chính tinh (cung trống, mượn sao cung đối diện)';
    const role = roleOfPalace(selectedPalace.name);
    const palaceVi = viPalace(selectedPalace.name);

    const prompt = `Hãy luận kỹ ${palaceVi} (lo về: ${role}). Chính tinh ở cung này: ${starDesc}. Theo các mục sau:

**【Ý nghĩa của cung】**
Vai trò của ${palaceVi} trong lá số và nhận định chung về cách sắp xếp sao ở đây.

**【Chính tinh】**
Chính tinh ở cung này giải thích theo hệ thống của Nghê sư.

**【Tam phương tứ chính】**
Các cung tam phương tứ chính ảnh hưởng tới cung này thế nào.

**【Lời khuyên】**
Lời khuyên cụ thể dựa trên cung này.`;

    sendMessage(prompt, true);
  }, [selectedPalace]); // eslint-disable-line react-hooks/exhaustive-deps

  // Luận Tứ Hoá khi bấm vào nhãn Tứ Hoá chồng lên
  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    // Tìm cung có sao này
    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceName = palaceOfStar ? viPalace(palaceOfStar.name) : 'một cung chưa xác định';
    const viewLabel = selectedSiHua.view === 'daxian' ? 'đại hạn' : 'lưu niên';
    const star = vi(selectedSiHua.starName);
    const hua = `Hoá ${vi(selectedSiHua.siHua)}`;

    const prompt = `Hãy luận sao ${star} ${hua.toLowerCase()} của ${viewLabel}, theo các mục sau:

**【Ý nghĩa của ${hua}】**
Ý nghĩa cốt lõi của ${hua} trong hệ thống của Nghê sư, và ý nghĩa riêng khi ${star} mang ${hua}.

**【Cung bị ảnh hưởng】**
${star} ${hua.toLowerCase()} nằm ở ${palaceName}: những chuyện cung này lo bị ảnh hưởng ra sao.

**【Tam phương tứ chính】**
Ảnh hưởng dây chuyền tới cung đối diện và hai cung tam hợp.

**【Vận gần đây】**
Trong ${viewLabel} này, ${hua} ảnh hưởng thế nào tới vận của người này.

**【Lời khuyên】**
Lời khuyên cụ thể, làm được.`;

    sendMessage(prompt, true);
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps

  const streamResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
      });
      if (!res.ok || !res.body) {
        // Server trả câu báo lỗi dễ hiểu trong { error }; không có thì dùng câu chung.
        const body = await res.json().catch(() => null) as { error?: string } | null;
        throw new Error(body?.error || 'Chưa luận giải được lúc này. Bạn thử bấm lại sau ít phút nhé.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      let pending = ''; // phần dòng bị cắt giữa hai lần đọc, chờ ghép với lần đọc sau
      let finished = false;

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!finished) {
        const { done, value } = await reader.read();
        pending += decoder.decode(value, { stream: !done });
        const lines = pending.split('\n');
        pending = done ? '' : lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') { finished = true; break; }
          try {
            const parsed = JSON.parse(data) as { delta?: { text?: string }; error?: string };
            if (parsed.error) throw new Error(parsed.error);
            assistantText += parsed.delta?.text ?? '';
          } catch (err) {
            if (err instanceof SyntaxError) continue;
            throw err;
          }
        }
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: assistantText };
          return updated;
        });
        if (done) break;
      }
    } catch (e) {
      const text = e instanceof Error && e.message ? e.message : 'Chưa luận giải được lúc này. Bạn thử bấm lại sau ít phút nhé.';
      setMessages(prev => {
        // Bỏ bong bóng trả lời còn trống (nếu lỗi xảy ra giữa chừng) rồi hiện câu báo lỗi.
        const cleaned = prev.length && prev[prev.length - 1].role === 'assistant' && !prev[prev.length - 1].content ? prev.slice(0, -1) : prev;
        return [...cleaned, { role: 'assistant', content: `⚠️ ${text}` }];
      });
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const sendMessage = (text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, hidden };
    // Capture current messages synchronously via ref (avoids stale closure)
    const apiMessages = [...messagesRef.current, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMessages);
  };

  const handleTopicClick = (topicKey: string) => {
    if (loadingRef.current) return;
    setActiveTopic(topicKey);
    sendMessage(TOPIC_PROMPTS[topicKey], true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">

      {/* ── Topic buttons ── */}
      <div className="flex-shrink-0 px-2 pt-2.5 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                disabled={loading}
                className="py-1.5 px-0.5 text-[10px] leading-tight font-medium rounded-lg transition-all duration-150 disabled:opacity-40"
                style={{
                  background: isActive ? 'rgba(212,168,67,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        {/* Loading state before first message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.1 }}>✦</div>
            <p className="text-[10px] animate-pulse" style={{ color: 'var(--t-faint)' }}>Đang luận giải lá số…</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            if (msg.role === 'user' && msg.hidden) return null;

            if (msg.role === 'user') {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div
                    className="max-w-[85%] rounded-xl px-3 py-2 text-[11px]"
                    style={{
                      background: 'rgba(212,168,67,0.08)',
                      border: '1px solid rgba(212,168,67,0.18)',
                      color: 'var(--t-gold)',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              );
            }

            // Assistant message
            const isLastMsg = i === messages.length - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="text-[9px] tracking-widest mb-2 flex items-center gap-1.5"
                  style={{ color: 'var(--t-faint)' }}
                >
                  <span style={{ color: 'var(--t-gold)', opacity: 0.4 }}>✦</span>
                  Luận giải
                </div>
                <AiContent text={msg.content} streaming={loading && isLastMsg} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Hỏi thêm, ví dụ: năm nay có nên đổi việc không?"
            disabled={loading}
            className="flex-1 rounded-lg px-3 py-2 text-[11px] focus:outline-none transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg text-[11px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: 'var(--t-gold)',
            }}
          >
            {loading ? '…' : 'Hỏi'}
          </button>
        </div>
      </div>

    </div>
  );
}
