/**
 * 古籍原典查询库 · 主页
 *
 * 列出所有收录古籍 + 全局搜索入口
 */

import Link from 'next/link';
import { ALL_BOOKS, TOTAL_PARAGRAPHS } from '@/lib/classics';
import LibrarySearch from './LibrarySearch';

export const metadata = {
  title: 'Thư viện sách cổ Tử Vi · Toàn Tập, Toàn Thư, Cốt Tuỷ Phú',
  description: 'Đọc và tìm trong các sách cổ Tử Vi Đẩu Số: Tử Vi Đẩu Số Toàn Tập, Tử Vi Đẩu Số Toàn Thư, Cốt Tuỷ Phú. Mỗi đoạn có nguyên văn chữ Hán và bản dịch nghĩa tiếng Việt, là nguồn dẫn chứng trong Thiên Kỷ của thầy Nghê Hải Hạ.',
};

export default function LibraryHomePage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* 顶栏 */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.05em', textDecoration: 'none' }}>
          ← Trang chủ
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.05em' }}>
          Thư viện sách cổ
        </div>
        <Link href="/chart" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.05em', textDecoration: 'none' }}>
          Lập lá số →
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(184,146,42,0.4))' }} />
          <span style={{ fontSize: '11px', color: 'var(--ac)', letterSpacing: '0.06em' }}>Theo thầy Nghê Hải Hạ</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(184,146,42,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.02em', marginBottom: '12px' }}>
          Thư viện sách cổ Tử Vi
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--tx-2)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          Đọc nguyên văn chữ Hán kèm bản dịch tiếng Việt<br />
          <strong style={{ color: 'var(--ac)' }}>{ALL_BOOKS.length}</strong> bộ sách · <strong style={{ color: 'var(--ac)' }}>{TOTAL_PARAGRAPHS}</strong> đoạn
        </p>
      </div>

      {/* 搜索 */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <LibrarySearch />
      </div>

      {/* 古籍列表 */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_BOOKS.map(book => (
            <Link
              key={book.slug}
              href={`/library/${book.slug}`}
              style={{
                display: 'block',
                background: 'var(--bg-card)',
                border: '1px solid rgba(184,146,42,0.2)',
                borderRadius: '14px',
                padding: '24px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(184,146,42,0.06)',
              }}
              className="hover:shadow-lg"
            >
              <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.02em', marginBottom: '6px' }}>
                {book.dynastyVi} · {book.authorVi}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '10px', letterSpacing: '0.01em' }}>
                {book.titleVi}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '14px' }}>
                {book.introVi}
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--tx-3)' }}>
                <span>{book.chapters.length} chương</span>
                <span style={{ color: 'rgba(184,146,42,0.4)' }}>·</span>
                <span>{book.chapters.reduce((s, c) => s + c.paragraphs.length, 0)} đoạn</span>
              </div>
              <div style={{
                display: 'inline-flex',
                marginTop: '14px',
                fontSize: '11px',
                color: 'var(--ac)',
                letterSpacing: '0.02em',
                fontWeight: 500,
              }}>
                Đọc sách này →
              </div>
            </Link>
          ))}
        </div>

        {/* 底部说明 */}
        <div style={{ marginTop: '60px', padding: '24px', background: 'rgba(184,146,42,0.05)', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--ac-dim)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>
            Về thư viện này
          </div>
          <div style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
            Các sách đều là bản in đời Minh, không còn bản quyền.<br />
            Bản dịch tiếng Việt giúp hiểu nghĩa; khi cần chính xác, hãy đối chiếu với nguyên văn chữ Hán.<br />
            Nội dung vẫn đang được bổ sung. Thấy chỗ nào sai, bạn hãy báo cho chúng tôi.
          </div>
        </div>
      </div>
    </div>
  );
}
