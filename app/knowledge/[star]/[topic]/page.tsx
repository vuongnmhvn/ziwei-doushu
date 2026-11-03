/**
 * /knowledge/[star]/[topic] — SEO 落地页
 *
 * 14 主星 × 13 topic = 182 个独立 URL
 * 每页含完整的 STAR_DB 4 段论断（一句话定调/核心论断/命盘依据/经典出处）
 *
 * SEO 要点：
 *  - title 含主关键词（如"紫微入命宫·倪海厦体系详解"）
 *  - description 用 dingdiao（一句话定调）
 *  - JSON-LD Article 结构化数据
 *  - 内链：同主星其他 12 宫 + 同宫其他 13 主星
 *  - generateStaticParams 静态生成，零运行时开销
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { TopicKey } from '@/lib/ziwei/db-analysis';
import {
  ALL_STARS,
  ALL_TOPICS,
  getKnowledge,
  getAllKnowledgeRoutes,
  knowledgeTitle,
  STAR_BRIEF_SEO,
  STAR_TO_SLUG,
  SLUG_TO_STAR,
} from '@/lib/seo/knowledge';
import { SITE_URL } from '@/lib/site';
import { vi, viPalace } from '@/lib/i18n/vi';

// 允许动态参数：如果某个 star/topic 组合不在 generateStaticParams 列表中
// 也允许运行时按需渲染，避免中文 URL 编码问题导致 404
export const dynamicParams = false;

export async function generateStaticParams() {
  const routes = getAllKnowledgeRoutes();
  // URL 用拼音 slug 替代中文，避开 Vercel/CDN 中文路由边界问题
  return routes.map(r => ({ star: r.slug, topic: r.topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ star: string; topic: string }> }) {
  const { star: slug, topic } = await params;
  const star = SLUG_TO_STAR[slug];
  if (!star) return {};
  const data = getKnowledge(star, topic as TopicKey);
  if (!data.exists) return {};

  const heading = knowledgeTitle(star, data.palaceName);
  const title = `${heading} · ${data.topicLabel} · Luận giải theo Nghê Hải Hạ`;
  const description = data.parsed.dingdiao
    || `Ý nghĩa sao ${heading} trong Tử Vi Đẩu Số, theo hệ thống Thiên Kỷ của thầy Nghê Hải Hạ và các sách cổ Tử Vi Đẩu Số Toàn Tập, Cốt Tuỷ Phú.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${SITE_URL}/knowledge/${slug}/${topic}`,
    },
    alternates: {
      canonical: `${SITE_URL}/knowledge/${slug}/${topic}`,
    },
    keywords: [
      'Tử Vi Đẩu Số', 'Nghê Hải Hạ', vi(star), viPalace(data.palaceName), data.topicLabel,
      heading, `sao ${vi(star)}`, `Tử Vi ${vi(star)}`, 'Tử Vi Nghê Hải Hạ', 'Tử Vi Đẩu Số Toàn Tập',
    ],
  };
}

export default async function KnowledgePage({ params }: { params: Promise<{ star: string; topic: string }> }) {
  const { star: slug, topic } = await params;
  const star = SLUG_TO_STAR[slug];
  if (!star) notFound();
  const data = getKnowledge(star, topic as TopicKey);
  if (!data.exists) notFound();

  // 同主星其他 topic
  const otherTopicsForStar = ALL_TOPICS.filter(t => t !== topic && getKnowledge(star, t).exists);
  // 同 topic 其他主星
  const otherStarsForTopic = ALL_STARS.filter(s => s !== star && getKnowledge(s, topic as TopicKey).exists);

  const starVi = vi(star);
  const palaceVi = viPalace(data.palaceName);
  const heading = knowledgeTitle(star, data.palaceName);

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${heading} · ${data.topicLabel}`,
    description: data.parsed.dingdiao,
    inLanguage: 'vi',
    author: { '@type': 'Organization', name: 'Nghiên cứu Tử Vi · Theo Nghê Hải Hạ' },
    publisher: {
      '@type': 'Organization',
      name: 'Nghiên cứu Tử Vi',
      url: SITE_URL,
    },
    datePublished: '2026-04-28',
    dateModified: '2026-04-28',
    mainEntityOfPage: `${SITE_URL}/knowledge/${slug}/${topic}`,
    articleSection: 'Tử Vi Đẩu Số · Hệ thống Nghê Hải Hạ',
    keywords: ['Tử Vi Đẩu Số', starVi, palaceVi, data.topicLabel].join(', '),
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 顶栏 */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/knowledge" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.05em', textDecoration: 'none' }}>
          ← Kiến thức Tử Vi
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.05em' }}>
          Theo thầy Nghê Hải Hạ
        </div>
        <Link href="/chart" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.05em', textDecoration: 'none' }}>
          Lập lá số →
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* 面包屑 */}
        <nav aria-label="Bạn đang ở đây" style={{ fontSize: '12px', color: 'var(--tx-3)', marginBottom: '16px' }}>
          <Link href="/" style={{ color: 'var(--tx-3)', textDecoration: 'none' }}>Trang chủ</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/knowledge" style={{ color: 'var(--tx-3)', textDecoration: 'none' }}>Kiến thức Tử Vi</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{starVi}</span>
          <span style={{ margin: '0 8px' }}>·</span>
          <span style={{ color: 'var(--ac)' }}>{palaceVi}</span>
        </nav>

        {/* 标题区 */}
        <header style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.02em', marginBottom: '8px' }}>
            {data.topicLabel}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.01em', lineHeight: 1.2 }}>
            {heading}
          </h1>
          {STAR_BRIEF_SEO[star] && (
            <p style={{ fontSize: '13px', color: 'var(--tx-2)', marginTop: '14px', lineHeight: 1.8 }}>
              {STAR_BRIEF_SEO[star]}
            </p>
          )}
        </header>

        {/* 内容 4 段 */}
        {data.parsed.dingdiao && (
          <Section title="Tóm tắt trong một câu" gradient>
            <p style={{ fontSize: '17px', color: 'var(--tx-0)', lineHeight: 1.9, fontWeight: 500, letterSpacing: '0.04em' }}>
              {data.parsed.dingdiao}
            </p>
          </Section>
        )}

        {data.parsed.lundian && (
          <Section title="Luận giải chính">
            <div style={{ fontSize: '15px', color: 'var(--tx-0)', lineHeight: 2, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
              {data.parsed.lundian}
            </div>
          </Section>
        )}

        {data.parsed.yiju && (
          <Section title="Căn cứ trên lá số">
            <div style={{ fontSize: '14px', color: 'var(--tx-0)', lineHeight: 2, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
              {data.parsed.yiju}
            </div>
          </Section>
        )}

        {data.parsed.chuchu && (
          <Section title="Trích dẫn sách cổ" minimal>
            <div style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 2, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
              {data.parsed.chuchu}
            </div>
          </Section>
        )}

        {/* CTA */}
        <div style={{
          margin: '40px 0 30px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(212,169,72,0.15) 0%, rgba(184,146,42,0.06) 100%)',
          borderRadius: '14px',
          border: '1px solid rgba(184,146,42,0.3)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '15px', color: 'var(--tx-0)', fontWeight: 600, marginBottom: '6px' }}>
            Muốn xem phần “{data.topicLabel}” trong lá số của chính bạn?
          </div>
          <div style={{ fontSize: '13px', color: 'var(--tx-2)', marginBottom: '16px' }}>
            Nhập ngày giờ sinh là có lá số, kèm lời giải theo thầy Nghê và AI trả lời câu hỏi
          </div>
          <Link href="/chart" style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #d4a948 0%, #b8922a 100%)',
            color: 'white',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(184,146,42,0.3)',
          }}>
            Lập lá số của tôi →
          </Link>
        </div>

        {/* 内链：同主星其他 topic */}
        {otherTopicsForStar.length > 0 && (
          <Section title={`Sao ${starVi} ở các cung khác`} minimal>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {otherTopicsForStar.map(t => {
                const d = getKnowledge(star, t);
                return (
                  <Link
                    key={t}
                    href={`/knowledge/${slug}/${t}`}
                    style={{
                      fontSize: '12px',
                      padding: '6px 12px',
                      background: 'var(--bg-card)',
                      border: '1px solid rgba(184,146,42,0.25)',
                      borderRadius: '999px',
                      color: 'var(--tx-2)',
                      textDecoration: 'none',
                    }}
                  >
                    {knowledgeTitle(star, d.palaceName)} · {d.topicLabel}
                  </Link>
                );
              })}
            </div>
          </Section>
        )}

        {/* 内链：同 topic 其他主星 */}
        {otherStarsForTopic.length > 0 && (
          <Section title={`Các chính tinh khác ở ${palaceVi}`} minimal>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {otherStarsForTopic.slice(0, 13).map(s => (
                <Link
                  key={s}
                  href={`/knowledge/${STAR_TO_SLUG[s]}/${topic}`}
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    background: 'var(--bg-card)',
                    border: '1px solid rgba(184,146,42,0.25)',
                    borderRadius: '999px',
                    color: 'var(--tx-2)',
                    textDecoration: 'none',
                  }}
                >
                  {knowledgeTitle(s, data.palaceName)}
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* 古籍库链接 */}
        <div style={{
          marginTop: '40px',
          padding: '16px 20px',
          background: 'rgba(184,146,42,0.04)',
          border: '1px dashed rgba(184,146,42,0.25)',
          borderRadius: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '12px', color: 'var(--ac-dim)', marginBottom: '6px' }}>
            Muốn đọc sách gốc?
          </div>
          <Link href="/library" style={{ fontSize: '14px', color: 'var(--ac)', fontWeight: 500, textDecoration: 'none' }}>
            📜 Mở thư viện sách cổ: Toàn Tập, Toàn Thư, Cốt Tuỷ Phú →
          </Link>
        </div>
      </article>

      {/* 页脚 */}
      <footer style={{ borderTop: '1px solid rgba(184,146,42,0.15)', padding: '20px 24px', textAlign: 'center', fontSize: '12px', color: 'var(--tx-3)' }}>
        <div style={{ marginBottom: '6px' }}>Nghiên cứu Tử Vi · Theo hệ thống thầy Nghê Hải Hạ · Chỉ để học và tham khảo</div>
        <div style={{ opacity: 0.85 }}>Nội dung ở đây không phải lời khuyên về sức khoẻ, đầu tư, pháp luật hay các quyết định quan trọng</div>
      </footer>
    </div>
  );
}

function Section({ title, children, gradient, minimal }: { title: string; children: React.ReactNode; gradient?: boolean; minimal?: boolean }) {
  return (
    <section style={{ marginBottom: minimal ? '24px' : '32px' }}>
      <h2 style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: 'var(--ac)',
        fontWeight: 600,
        letterSpacing: '0.03em',
        marginBottom: '12px',
      }}>
        <span style={{ width: '4px', height: '14px', background: 'var(--ac)', borderRadius: '2px' }} />
        {title}
      </h2>
      <div style={{
        background: gradient
          ? 'linear-gradient(135deg, rgba(212,169,72,0.12) 0%, rgba(184,146,42,0.04) 100%)'
          : 'white',
        border: '1px solid rgba(184,146,42,0.15)',
        borderRadius: '10px',
        padding: minimal ? '14px 18px' : '20px 22px',
      }}>
        {children}
      </div>
    </section>
  );
}
