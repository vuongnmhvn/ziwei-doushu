import Link from 'next/link';

/** Trang báo không tìm thấy (404) bằng tiếng Việt. */
export default function NotFound() {
  return (
    <main style={{ maxWidth: 520, margin: '0 auto', padding: '96px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 44, marginBottom: 12, color: 'var(--t-gold, #d4a843)' }}>✦</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Không tìm thấy trang này</h1>
      <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.75, marginBottom: 28 }}>
        Đường dẫn có thể đã gõ sai hoặc trang không còn nữa.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/chart" style={{ padding: '10px 18px', borderRadius: 12, background: '#c88020', color: '#fff8e8', fontWeight: 600, fontSize: 14 }}>
          Lập lá số
        </Link>
        <Link href="/" style={{ padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(200,160,60,0.4)', fontSize: 14 }}>
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
