'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScrollIntro from '@/components/ScrollIntro';

// Chữ có dấu tiếng Việt: dùng phông serif có đủ dấu thay cho phông Tống/Khải thể của chữ Hán
const SERIF = '"Noto Serif", "Times New Roman", Georgia, serif';

export default function PreviewPage() {
  const router = useRouter();
  // replayKey 用于强制重置 ScrollIntro（用户点"再播放一次"时）
  const [replayKey, setReplayKey] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <>
      {/* 卷轴开场动画 */}
      <ScrollIntro key={replayKey} onComplete={() => setDone(true)} />

      {/* 动画结束后的「样片说明 + 操作按钮」面板 */}
      {done && (
        <main style={{
          minHeight: '100vh',
          background: '#0d0a08',
          color: '#e8dcc4',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px 24px',
          fontFamily: SERIF,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#c89647', marginBottom: '16px' }}>
            SCROLL · INTRO · PREVIEW
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            letterSpacing: '0.04em',
            color: '#e8dcc4',
            marginBottom: '16px',
            fontWeight: 600,
          }}>
            Cuộn giấy Tử Vi · Xem thử màn mở đầu
          </h1>
          <p style={{
            fontSize: '14px', color: '#a89878',
            maxWidth: '500px', lineHeight: 1.9,
            letterSpacing: '0.02em',
            marginBottom: '40px',
            fontFamily: SERIF,
            fontStyle: 'italic',
          }}>
            Cuộn giấy bạn vừa xem sẽ từ từ mở ra mỗi lần vào trang chủ.<br />
            Nếu thấy ưng ý, hãy báo mình để mình gắn nó vào trang chủ và đưa lên chạy thật.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => { setDone(false); setReplayKey(k => k + 1); }}
              style={{
                background: '#a8302a',
                color: '#f5ecd7',
                padding: '14px 28px',
                fontSize: '14px',
                fontFamily: SERIF,
                letterSpacing: '0.06em',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Xem lại lần nữa
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                color: '#e8dcc4',
                padding: '14px 28px',
                fontSize: '14px',
                fontFamily: SERIF,
                letterSpacing: '0.06em',
                border: '1px solid rgba(232,220,196,0.25)',
                cursor: 'pointer',
              }}
            >
              Vào trang chủ hiện tại
            </button>
          </div>

          <div style={{
            marginTop: '40px', fontSize: '12px', color: '#6e6048',
            letterSpacing: '0.05em',
            display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang chủ ↗</Link>
            <span>·</span>
            <Link href="/chart" style={{ color: 'inherit', textDecoration: 'none' }}>Lập lá số</Link>
            <span>·</span>
            <Link href="/heming" style={{ color: 'inherit', textDecoration: 'none' }}>Xem đôi</Link>
          </div>

          {/* 时间轴说明 */}
          <div style={{
            marginTop: '64px',
            padding: '24px 32px',
            border: '1px solid rgba(232,220,196,0.12)',
            maxWidth: '500px',
            fontSize: '12px',
            color: '#a89878',
            lineHeight: 1.9,
            letterSpacing: '0.02em',
            fontFamily: SERIF,
            textAlign: 'left',
          }}>
            <div style={{ color: '#c89647', marginBottom: '12px', letterSpacing: '0.08em', fontSize: '11px' }}>Các bước của hiệu ứng</div>
            <div>· 0.0 ~ 1.7 s &nbsp;&nbsp;Cuộn giấy mở ra từ phải sang trái</div>
            <div>· 1.9 ~ 2.7 s &nbsp;&nbsp;Chữ trên giấy hiện dần (tiêu đề, dòng phụ, con dấu đỏ)</div>
            <div>· 2.7 ~ 3.5 s &nbsp;&nbsp;Dừng lại để ngắm</div>
            <div>· 3.5 ~ 4.2 s &nbsp;&nbsp;Mờ dần rồi vào trang chủ</div>
            <div style={{ marginTop: '12px', color: '#6e6048', fontSize: '11px' }}>
              Lúc nào cũng có thể bấm &ldquo;Bỏ qua&rdquo; ở góc dưới bên phải để vào thẳng trang chủ.
            </div>
          </div>
        </main>
      )}
    </>
  );
}
