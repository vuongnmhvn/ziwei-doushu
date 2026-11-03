/**
 * /library/search?q=xxx — 搜索结果页
 */

import Link from 'next/link';
import { searchClassics } from '@/lib/classics';
import type { SearchHit } from '@/lib/classics';
import LibrarySearch from '../LibrarySearch';

export const metadata = {
  title: 'Tìm trong sách cổ · Thư viện sách cổ Tử Vi',
};

/** Số kết quả tối đa hiện trên một trang. */
const RESULT_LIMIT = 50;

/** Từ gợi ý khi không tìm thấy: có cả chữ không dấu để người dùng thấy gõ không dấu cũng được. */
const SUGGESTIONS = ['Thất Sát Triều Đẩu', 'Song Lộc Triều Viên', 'hoá kỵ', 'cung Mệnh', 'Cơ Nguyệt Đồng Lương', 'tham lang'];

/** Rút gọn bản dịch dài cho thẻ kết quả, cắt ở ranh giới từ. */
function shorten(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(' ', max);
  return `${text.slice(0, cut > 0 ? cut : max)}…`;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const sp = await searchParams;
  // ?q= có thể bị lặp (q=a&q=b): lấy giá trị đầu tiên.
  const rawQ = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const q = rawQ?.trim().slice(0, 100) || '';
  const hits = q ? searchClassics(q, RESULT_LIMIT) : [];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/library" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.05em', textDecoration: 'none' }}>
          ← Thư viện
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.05em' }}>
          Kết quả tìm
        </div>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.05em', textDecoration: 'none' }}>
          Trang chủ →
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div style={{ fontSize: '13px', color: 'var(--tx-3)', marginBottom: '4px' }}>
            {q ? 'Bạn đang tìm' : 'Tìm trong sách cổ'}
          </div>
          {q && (
            <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.01em', wordBreak: 'break-word' }}>
              “{q}”
            </h1>
          )}
          {q && hits.length > 0 && (
            <div style={{ fontSize: '13px', color: 'var(--tx-3)', marginTop: '8px' }}>
              {hits.length >= RESULT_LIMIT ? 'Hiện ' : 'Tìm thấy '}
              <strong style={{ color: 'var(--ac)' }}>{hits.length}</strong> đoạn
              {hits.length >= RESULT_LIMIT ? ' đầu tiên. Thêm chữ để tìm sát hơn.' : ''}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '28px' }}>
          <LibrarySearch key={q} initialQuery={q} />
        </div>

        {hits.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            padding: '40px 20px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'var(--tx-2)',
            border: '1px solid rgba(184,146,42,0.15)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }} aria-hidden="true">📜</div>
            {q ? (
              <>
                <div style={{ fontSize: '15px', marginBottom: '10px', wordBreak: 'break-word' }}>
                  Không tìm thấy đoạn nào có chữ “{q}”.
                </div>
                <div style={{ fontSize: '13px', color: 'var(--tx-3)', lineHeight: 1.7, marginBottom: '12px' }}>
                  Thử từ khác, ví dụ:
                </div>
                <SuggestionLinks />
              </>
            ) : (
              <>
                <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                  Gõ chữ cần tìm vào ô ở trên rồi bấm “Tìm”. Gõ có dấu hay không dấu đều được.
                </div>
                <SuggestionLinks />
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hits.map(hit => <HitCard key={hit.paragraphId} hit={hit} />)}
          </div>
        )}
      </div>

      <style>{`
        mark { background: rgba(184,146,42,0.3); color: #8b6a14; padding: 0 2px; border-radius: 2px; font-weight: 600; }
      `}</style>
    </div>
  );
}

function SuggestionLinks() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
      {SUGGESTIONS.map(s => (
        <Link
          key={s}
          href={`/library/search?q=${encodeURIComponent(s)}`}
          style={{
            fontSize: '13px',
            padding: '5px 12px',
            background: 'rgba(184,146,42,0.06)',
            border: '1px solid rgba(184,146,42,0.2)',
            borderRadius: '999px',
            color: 'var(--ac)',
            textDecoration: 'none',
          }}
        >
          {s}
        </Link>
      ))}
    </div>
  );
}

/**
 * Một kết quả tìm kiếm. Bản dịch tiếng Việt luôn là phần chữ chính;
 * khi chữ tìm thấy nằm ở nguyên văn thì hiện đoạn nguyên văn có đánh dấu, nhỏ hơn, ở trên.
 */
function HitCard({ hit }: { hit: SearchHit }) {
  return (
    <Link
      href={`/library/${hit.bookSlug}/${hit.chapterIdx}#${hit.paragraphId}`}
      style={{
        display: 'block',
        background: 'var(--bg-card)',
        padding: '16px 20px',
        borderRadius: '10px',
        border: '1px solid rgba(184,146,42,0.18)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'border-color 0.15s',
      }}
    >
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '6px 8px',
        fontSize: '12px',
        color: 'var(--tx-3)',
        marginBottom: '8px',
      }}>
        <span style={{ color: 'var(--ac)', fontWeight: 600 }}>{hit.bookTitleVi}</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>{hit.chapterTitleVi}</span>
      </div>

      {hit.matchedIn === 'text' && (
        <div
          lang="zh-Hans"
          style={{
            fontSize: '13px',
            color: 'var(--tx-2)',
            lineHeight: 1.9,
            marginBottom: hit.vi ? '6px' : 0,
          }}
          dangerouslySetInnerHTML={{ __html: hit.snippet }}
        />
      )}

      {hit.matchedIn === 'vi' ? (
        <div
          style={{ fontSize: '15px', color: 'var(--tx-0)', lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: hit.snippet }}
        />
      ) : hit.vi && (
        <div style={{ fontSize: '15px', color: 'var(--tx-0)', lineHeight: 1.8 }}>
          {shorten(hit.vi)}
        </div>
      )}

      <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--ac)', textAlign: 'right' }}>
        Đọc cả chương →
      </div>
    </Link>
  );
}
