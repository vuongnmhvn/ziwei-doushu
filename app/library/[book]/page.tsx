/**
 * /library/[book] — 单部古籍目录页
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_BOOKS, getBookBySlug } from '@/lib/classics';

export async function generateStaticParams() {
  return ALL_BOOKS.map(b => ({ book: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};
  return {
    title: `${book.titleVi} · ${book.dynastyVi} · Thư viện sách cổ Tử Vi`,
    description: book.introVi,
  };
}

export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="px-6 py-4 flex items-center justify-between gap-4"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/library" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.05em', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          ← Thư viện
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.02em', textAlign: 'center' }}>
          {book.titleVi}
        </div>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.05em', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Trang chủ →
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* 书名信息 */}
        <div className="text-center mb-12">
          <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.02em', marginBottom: '8px' }}>
            {book.dynastyVi} · {book.authorVi}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.01em', marginBottom: '6px' }}>
            {book.titleVi}
          </h1>
          <div lang="zh-Hans" style={{ fontSize: '14px', color: 'var(--tx-3)', letterSpacing: '0.1em', marginBottom: '14px' }}>
            《{book.title}》
          </div>
          <p style={{ fontSize: '14px', color: 'var(--tx-2)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto' }}>
            {book.introVi}
          </p>
        </div>

        {/* 章节目录 */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid rgba(184,146,42,0.2)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(184,146,42,0.15)', fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.05em' }}>
            Mục lục
          </div>
          {book.chapters.map((chapter, i) => (
            <Link
              key={i}
              href={`/library/${book.slug}/${i}`}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '14px',
                padding: '14px 20px',
                borderBottom: i === book.chapters.length - 1 ? 'none' : '1px dashed rgba(184,146,42,0.15)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background 0.15s',
              }}
              className="hover:bg-amber-50"
            >
              <div style={{ fontSize: '12px', color: 'var(--ac)', fontWeight: 600, minWidth: '28px', letterSpacing: '0.05em' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', color: 'var(--tx-0)', fontWeight: 500, marginBottom: '2px' }}>
                  {chapter.titleVi}
                </div>
                {chapter.subtitleVi && (
                  <div style={{ fontSize: '12px', color: 'var(--tx-3)' }}>
                    {chapter.subtitleVi}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--tx-3)', whiteSpace: 'nowrap' }}>
                {chapter.paragraphs.length} đoạn
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ac)' }} aria-hidden="true">→</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
