/**
 * /knowledge — 知识库主页
 * 列出 14 主星，每星可看其在 13 宫位的解读
 *
 * Khi kho luận giải (STAR_DB) trống, mọi trang chi tiết đều không tồn tại: trang này
 * không dẫn tới trang chi tiết nào, ô tên sao chỉ cuộn xuống phần tóm tắt của sao đó,
 * và có một câu giải thích vì sao chưa có bài.
 */

import Link from 'next/link';
import { ALL_STARS, ALL_TOPICS, getKnowledge, STAR_BRIEF_SEO, STAR_TO_SLUG } from '@/lib/seo/knowledge';
import { TOPIC_LABEL } from '@/lib/ziwei/db-analysis';
import { vi, viPalace } from '@/lib/i18n/vi';

export const metadata = {
  title: 'Kiến thức Tử Vi · 14 chính tinh ở 12 cung · Theo Nghê Hải Hạ',
  description: 'Kho kiến thức Tử Vi Đẩu Số theo hệ thống Thiên Kỷ của thầy Nghê Hải Hạ và các sách cổ Tử Vi Đẩu Số Toàn Tập, Cốt Tuỷ Phú: ý nghĩa của 14 chính tinh khi nằm ở từng cung.',
  keywords: ['Tử Vi Đẩu Số', 'Nghê Hải Hạ', 'Tử Vi Nghê Hải Hạ', 'Tử Vi Đẩu Số Toàn Tập', 'Tử Vi Đẩu Số Toàn Thư', '14 chính tinh', '12 cung'],
};

/** Id neo của thẻ tóm tắt một sao, để ô tên sao cuộn tới khi sao đó chưa có bài chi tiết. */
const starAnchor = (star: string) => `sao-${STAR_TO_SLUG[star]}`;

export default function KnowledgeHomePage() {
  // Chủ đề nào có bài thì mới hiện liên kết; đếm trước để biết có cần câu giải thích "chưa có bài" không.
  const topicsByStar = new Map(
    ALL_STARS.map(star => [star, ALL_TOPICS.map(t => getKnowledge(star, t)).filter(k => k.exists)]),
  );
  const totalArticles = [...topicsByStar.values()].reduce((sum, list) => sum + list.length, 0);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* 顶栏 */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.05em', textDecoration: 'none' }}>
          ← Trang chủ
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.05em' }}>
          Kiến thức Tử Vi
        </div>
        <Link href="/library" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.05em', textDecoration: 'none' }}>
          Sách cổ →
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-14">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(184,146,42,0.4))' }} />
          <span style={{ fontSize: '11px', color: 'var(--ac)', letterSpacing: '0.06em' }}>Theo thầy Nghê Hải Hạ</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(184,146,42,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.02em', marginBottom: '12px' }}>
          Kiến thức Tử Vi
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--tx-2)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          Ý nghĩa của <strong style={{ color: 'var(--ac)' }}>{ALL_STARS.length}</strong> chính tinh
          {totalArticles > 0 && (
            <> · <strong style={{ color: 'var(--ac)' }}>{totalArticles}</strong> bài theo từng cung</>
          )}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {/* Trạng thái trống: chưa có bài luận giải chi tiết nào */}
        {totalArticles === 0 && (
          <div style={{
            maxWidth: '640px',
            margin: '0 auto 40px',
            padding: '20px 22px',
            background: 'rgba(184,146,42,0.05)',
            border: '1px dashed rgba(184,146,42,0.3)',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '15px', color: 'var(--tx-0)', fontWeight: 600, marginBottom: '6px' }}>
              Chưa có bài luận giải chi tiết theo từng cung
            </div>
            <div style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '14px' }}>
              Bản này chưa kèm các bài viết đó. Bạn vẫn đọc được ý nghĩa tóm tắt của từng sao ở dưới,
              hoặc lập lá số để xem sao nào nằm ở cung nào của chính mình.
            </div>
            <Link href="/chart" style={{
              display: 'inline-block',
              padding: '10px 22px',
              background: 'linear-gradient(135deg, #d4a948 0%, #b8922a 100%)',
              color: 'white',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Lập lá số của tôi →
            </Link>
          </div>
        )}

        {/* 14 主星卡片 */}
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.08em', textAlign: 'center', marginBottom: '24px' }}>
          Mười bốn chính tinh
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {ALL_STARS.map(star => {
            const hasOverview = topicsByStar.get(star)?.some(k => k.topic === 'overview');
            return (
              <Link
                key={star}
                href={hasOverview ? `/knowledge/${STAR_TO_SLUG[star]}/overview` : `#${starAnchor(star)}`}
                style={{
                  display: 'block',
                  padding: '14px 10px',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(184,146,42,0.2)',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
                className="hover:shadow-md hover:border-amber-400"
              >
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.01em', lineHeight: 1.3 }}>
                  {vi(star)}
                </div>
              </Link>
            );
          })}
        </div>

        {/* 详细列表（每个主星 + 简介 + 进入按钮） */}
        <div className="mt-14 space-y-4">
          {ALL_STARS.map(star => {
            const topics = topicsByStar.get(star) ?? [];
            return (
              <div key={star} id={starAnchor(star)} style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(184,146,42,0.18)',
                borderRadius: '12px',
                padding: '18px 22px',
                scrollMarginTop: '24px',
              }}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.01em' }}>
                    Sao {vi(star)}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: topics.length > 0 || totalArticles > 0 ? '12px' : 0 }}>
                  {STAR_BRIEF_SEO[star] || ''}
                </p>
                {topics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {topics.map(k => (
                      <Link
                        key={k.topic}
                        href={`/knowledge/${STAR_TO_SLUG[star]}/${k.topic}`}
                        style={{
                          fontSize: '12px',
                          padding: '4px 10px',
                          background: 'rgba(184,146,42,0.06)',
                          border: '1px solid rgba(184,146,42,0.15)',
                          borderRadius: '999px',
                          color: 'var(--tx-2)',
                          textDecoration: 'none',
                        }}
                      >
                        {TOPIC_LABEL[k.topic]} · {viPalace(k.palaceName)}
                      </Link>
                    ))}
                  </div>
                ) : totalArticles > 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--tx-3)' }}>
                    Sao này chưa có bài chi tiết theo từng cung.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
