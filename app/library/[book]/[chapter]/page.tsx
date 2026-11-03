/**
 * /library/[book]/[chapter] — 单章节阅读页
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_BOOKS, getChapter } from '@/lib/classics';

export async function generateStaticParams() {
  return ALL_BOOKS.flatMap(b =>
    b.chapters.map((_, i) => ({ book: b.slug, chapter: String(i) }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book: bookSlug, chapter: chIdx } = await params;
  const result = getChapter(bookSlug, Number(chIdx));
  if (!result) return {};
  return {
    title: `${result.chapter.titleVi} · ${result.book.titleVi} · Sách cổ Tử Vi`,
    description: result.chapter.subtitleVi
      ? `${result.chapter.subtitleVi}. Nguyên văn chữ Hán và bản dịch tiếng Việt, trích từ ${result.book.titleVi}.`
      : `Nguyên văn chữ Hán và bản dịch tiếng Việt của ${result.chapter.titleVi}, trích từ ${result.book.titleVi}.`,
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book: bookSlug, chapter: chIdx } = await params;
  const result = getChapter(bookSlug, Number(chIdx));
  if (!result) notFound();

  const { book, chapter, chapterIdx } = result;
  const prevIdx = chapterIdx - 1;
  const nextIdx = chapterIdx + 1;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="px-6 py-4 flex items-center justify-between gap-4"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href={`/library/${book.slug}`} style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.05em', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          ← Mục lục sách
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.02em', textAlign: 'center' }}>
          {book.titleVi}
        </div>
        <Link href="/library" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.05em', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Thư viện →
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.02em', marginBottom: '8px' }}>
            {book.titleVi} · {book.dynastyVi}
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.01em', marginBottom: '6px' }}>
            {chapter.titleVi}
          </h1>
          <div lang="zh-Hans" style={{ fontSize: '13px', color: 'var(--tx-3)', letterSpacing: '0.1em', marginBottom: '8px' }}>
            {chapter.title}
          </div>
          {chapter.subtitleVi && (
            <div style={{ fontSize: '14px', color: 'var(--tx-2)' }}>
              {chapter.subtitleVi}
            </div>
          )}
        </div>

        {/* 段落 */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid rgba(184,146,42,0.2)', padding: '32px 28px' }}>
          {chapter.paragraphs.map((p, i) => (
            <div
              key={p.id}
              id={p.id}
              style={{
                marginBottom: i === chapter.paragraphs.length - 1 ? 0 : '20px',
                paddingBottom: i === chapter.paragraphs.length - 1 ? 0 : '20px',
                borderBottom: i === chapter.paragraphs.length - 1 ? 'none' : '1px dashed rgba(184,146,42,0.15)',
                scrollMarginTop: '80px',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
              }}>
                <span style={{
                  fontSize: '11px',
                  color: 'var(--ac)',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  minWidth: '24px',
                }}>
                  {String(p.idx).padStart(2, '0')}
                </span>
                <div style={{ flex: 1 }}>
                  {/* Nguyên văn nhỏ và nhạt để đối chiếu; bản dịch tiếng Việt to và đậm vì đa số người đọc không đọc được chữ Hán. */}
                  <p lang="zh-Hans" style={{
                    fontSize: p.vi ? '14px' : '16px',
                    color: p.vi ? 'var(--tx-2)' : 'var(--tx-0)',
                    lineHeight: 1.9,
                    letterSpacing: '0.04em',
                    fontFamily: '"PingFang SC", "Hiragino Sans GB", serif',
                  }}>
                    {p.text}
                  </p>
                  {p.vi ? (
                    <p style={{
                      marginTop: '8px',
                      fontSize: '16px',
                      color: 'var(--tx-0)',
                      lineHeight: 1.85,
                    }}>
                      {p.vi}
                    </p>
                  ) : (
                    <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--tx-3)' }}>
                      Đoạn này chưa có bản dịch tiếng Việt.
                    </p>
                  )}
                </div>
              </div>
              {p.translation && (
                <div style={{
                  marginTop: '8px',
                  marginLeft: '36px',
                  padding: '8px 12px',
                  background: 'rgba(184,146,42,0.05)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: 'var(--tx-2)',
                  lineHeight: 1.8,
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--ac)', marginRight: '6px' }}>Giải nghĩa</span>
                  {p.translation}
                </div>
              )}
              {p.niNote && (
                <div style={{
                  marginTop: '8px',
                  marginLeft: '36px',
                  padding: '8px 12px',
                  background: 'rgba(196,90,45,0.05)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: 'var(--tx-2)',
                  lineHeight: 1.8,
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--ji)', marginRight: '6px' }}>Lời thầy Nghê</span>
                  {p.niNote}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 章节导航 */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          {prevIdx >= 0 ? (
            <Link
              href={`/library/${book.slug}/${prevIdx}`}
              style={{
                flex: 1,
                padding: '14px 18px',
                background: 'var(--bg-card)',
                border: '1px solid rgba(184,146,42,0.2)',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'var(--tx-0)',
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.02em', marginBottom: '2px' }}>← Chương trước</div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{book.chapters[prevIdx].titleVi}</div>
            </Link>
          ) : <div style={{ flex: 1 }} />}
          {nextIdx < book.chapters.length ? (
            <Link
              href={`/library/${book.slug}/${nextIdx}`}
              style={{
                flex: 1,
                padding: '14px 18px',
                background: 'var(--bg-card)',
                border: '1px solid rgba(184,146,42,0.2)',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'var(--tx-0)',
                textAlign: 'right',
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.02em', marginBottom: '2px' }}>Chương sau →</div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{book.chapters[nextIdx].titleVi}</div>
            </Link>
          ) : <div style={{ flex: 1 }} />}
        </div>
      </article>
    </div>
  );
}
