/**
 * SEO 知识页 — 数据 helper
 *
 * 14 主星 × 13 topic = 182 个独立 SEO URL
 * 每页都是 STAR_DB 中对应字段的 4 段 markers（一句话定调/核心论断/命盘依据/经典出处）
 */

import { STAR_DB } from '@/lib/ziwei/db-analysis';
import type { TopicKey } from '@/lib/ziwei/db-analysis';
import { TOPIC_PALACE_NAME, TOPIC_LABEL } from '@/lib/ziwei/db-analysis';
import { vi, viPalace } from '@/lib/i18n/vi';

export const ALL_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府',
  '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军',
];

// 主星名 ↔ 拼音 slug 映射（URL 用 slug，避免中文 URL 在 Vercel/CDN 上的边界问题）
export const STAR_TO_SLUG: Record<string, string> = {
  '紫微': 'ziwei',
  '天机': 'tianji',
  '太阳': 'taiyang',
  '武曲': 'wuqu',
  '天同': 'tiantong',
  '廉贞': 'lianzhen',
  '天府': 'tianfu',
  '太阴': 'taiyin',
  '贪狼': 'tanlang',
  '巨门': 'jumen',
  '天相': 'tianxiang',
  '天梁': 'tianliang',
  '七杀': 'qisha',
  '破军': 'pojun',
};

export const SLUG_TO_STAR: Record<string, string> = Object.fromEntries(
  Object.entries(STAR_TO_SLUG).map(([k, v]) => [v, k])
);

export const ALL_TOPICS: TopicKey[] = [
  'overview', 'personality', 'love', 'career', 'wealth', 'health',
  'family', 'children', 'move', 'friends', 'home', 'spirit', 'parents',
];

interface StarContent {
  mingGong: string;
  personality: string;
  xiongDi?: string;
  fuQi: string;
  ziNv?: string;
  caiBo: string;
  jiE: string;
  qianYi?: string;
  jiaoYou?: string;
  guanLu: string;
  tianZhai?: string;
  fuDe?: string;
  fuMu?: string;
}

const TOPIC_TO_FIELD: Record<TopicKey, keyof StarContent> = {
  overview:    'mingGong',
  personality: 'personality',
  love:        'fuQi',
  career:      'guanLu',
  wealth:      'caiBo',
  health:      'jiE',
  family:      'xiongDi' as keyof StarContent,
  children:    'ziNv' as keyof StarContent,
  move:        'qianYi' as keyof StarContent,
  friends:     'jiaoYou' as keyof StarContent,
  home:        'tianZhai' as keyof StarContent,
  spirit:      'fuDe' as keyof StarContent,
  parents:     'fuMu' as keyof StarContent,
};

interface ParsedContent {
  dingdiao: string;
  lundian: string;
  yiju: string;
  chuchu: string;
  raw: string;
  hasMarkers: boolean;
}

function parseStarContent(content: string): ParsedContent {
  const out: ParsedContent = { dingdiao: '', lundian: '', yiju: '', chuchu: '', raw: content, hasMarkers: false };
  if (!content) return out;
  if (!content.includes('**【一句话定调】**') && !content.includes('**【核心论断】**')) {
    out.lundian = content;
    return out;
  }
  out.hasMarkers = true;
  const re = /\*\*【([^】]+)】\*\*/g;
  const parts: { name: string; markerEnd: number; start: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    parts.push({ name: m[1], start: m.index, markerEnd: m.index + m[0].length });
  }
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const end = i + 1 < parts.length ? parts[i + 1].start : content.length;
    const text = content.slice(p.markerEnd, end).trim();
    if (p.name === '一句话定调') out.dingdiao = text;
    else if (p.name === '核心论断') out.lundian = text;
    else if (p.name === '命盘依据') out.yiju = text;
    else if (p.name === '经典出处') out.chuchu = text;
  }
  return out;
}

export interface KnowledgeData {
  star: string;
  topic: TopicKey;
  topicLabel: string;
  palaceName: string;
  parsed: ParsedContent;
  exists: boolean;
}

export function getKnowledge(star: string, topic: TopicKey): KnowledgeData {
  const profile = STAR_DB[star] as StarContent | undefined;
  const field = TOPIC_TO_FIELD[topic];
  const content = profile && field ? (profile[field] as string | undefined) ?? '' : '';
  return {
    star,
    topic,
    topicLabel: TOPIC_LABEL[topic],
    palaceName: TOPIC_PALACE_NAME[topic],
    parsed: parseStarContent(content),
    exists: Boolean(content),
  };
}

/** 生成所有 14×13 组合（用于 generateStaticParams） */
export function getAllKnowledgeRoutes() {
  const routes: { star: string; slug: string; topic: TopicKey }[] = [];
  for (const star of ALL_STARS) {
    for (const topic of ALL_TOPICS) {
      const data = getKnowledge(star, topic);
      if (data.exists) routes.push({ star, slug: STAR_TO_SLUG[star], topic });
    }
  }
  return routes;
}

/** Tóm tắt ý nghĩa từng chính tinh (tiếng Việt), dùng ở trang kiến thức. Khoá là tên sao chữ Hán của bộ máy. */
export const STAR_BRIEF_SEO: Record<string, string> = {
  '紫微': 'Tử Vi là đế tinh, chủ sự tôn quý, hoá khí là Tôn. Ở cung Mệnh thì có khí chất lãnh đạo, hợp với nơi lớn, chức cao.',
  '天机': 'Thiên Cơ là sao trí tuệ, chủ linh hoạt, nhanh nhạy, hoá khí là Thiện. Ở cung Mệnh thì thông minh, biến hoá, hợp việc phụ tá, lập kế hoạch.',
  '太阳': 'Thái Dương là sao quý của nam giới, chủ danh dự, việc công, hoá khí là Quý. Ở cung Mệnh thì quang minh lỗi lạc, hợp làm việc nhà nước, có danh tiếng.',
  '武曲': 'Vũ Khúc là tài tinh, chủ cứng cỏi, quyết đoán, hoá khí là Tài. Ở cung Mệnh thì giỏi quản lý tiền, hợp sản xuất kinh doanh, tài chính.',
  '天同': 'Thiên Đồng là phúc tinh, chủ ôn hoà, thích hưởng thụ, hoá khí là Phúc. Ở cung Mệnh thì tính tình hiền hoà, có phúc.',
  '廉贞': 'Liêm Trinh là sao đào hoa thứ, văn võ song toàn, hoá khí là Tù. Ở cung Mệnh thì nhiều tài nghệ, tình cảm phong phú.',
  '天府': 'Thiên Phủ là sao giữ kho của Nam Đẩu, chủ vững vàng, thận trọng, hoá khí là Lệnh. Ở cung Mệnh thì phẩm hạnh đoan chính, giỏi giữ của.',
  '太阴': 'Thái Âm là sao mặt trăng, chủ nhà đất, giàu sang, hoá khí là Phú. Ở cung Mệnh thì tình cảm tinh tế, số nữ gặp là tốt nhất.',
  '贪狼': 'Tham Lang là sao đào hoa, ham muốn, nhiều tài, giỏi giao thiệp, hoá khí là Đào Hoa. Ở cung Mệnh thì đa tài đa nghệ, quen biết rộng.',
  '巨门': 'Cự Môn là sao thị phi và tài ăn nói, chủ tranh luận, truyền thông, hoá khí là Ám. Ở cung Mệnh thì ăn nói giỏi, hợp nghề luật sư, giáo viên.',
  '天相': 'Thiên Tướng là ấn tinh, sao phụ tá, chủ trung hậu, thật thà, hoá khí là Ấn. Ở cung Mệnh thì phẩm hạnh đoan chính, hợp việc hành chính, pháp chế.',
  '天梁': 'Thiên Lương là sao người già, sao che chở, giỏi gặp dữ hoá lành, hoá khí là Ấm. Ở cung Mệnh thì hiền lành, từ bi, hợp nghề luật, nghề y.',
  '七杀': 'Thất Sát là sao tướng, chủ cô độc, quyết đoán, dám mạo hiểm, hoá khí là Túc Sát. Ở cung Mệnh thì cứng cỏi, quyết đoán, hợp quân đội, cảnh sát, khởi nghiệp.',
  '破军': 'Phá Quân là sao phá cũ lập mới, chủ duyên với người thân mỏng, hoá khí là Hao. Ở cung Mệnh thì thích khai phá, nhiều biến động, hợp làm nghề chuyên môn kỹ thuật.',
};

/** Tiêu đề hiển thị của một chủ đề: "Tử Vi ở cung Mệnh". `palaceName` là tên cung chữ Hán của bộ máy. */
export function knowledgeTitle(star: string, palaceName: string): string {
  return `${vi(star)} ở ${viPalace(palaceName)}`;
}
