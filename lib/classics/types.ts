/**
 * 古籍原典查询库 — 类型定义
 *
 * 设计：所有古籍以 JSON 静态数据打包到代码（公版无版权风险）
 * Next.js 启动时一次性加载到内存，零 DB 依赖
 *
 * Bản tiếng Việt: nguyên văn chữ Hán luôn được giữ nguyên (trường `text`, `title`…),
 * phần dịch nghĩa nằm ở các trường có hậu tố `Vi`/`vi`. Giao diện hiện bản dịch là chính,
 * nguyên văn đi kèm để đối chiếu.
 */

export interface Paragraph {
  /** 段落唯一 id（用于锚点跳转） */
  id: string;
  /** 段落序号（章节内） */
  idx: number;
  /** 段落原文（古文） */
  text: string;
  /** Dịch nghĩa tiếng Việt của nguyên văn. Thiếu thì giao diện chỉ hiện nguyên văn. */
  vi?: string;
  /** 现代翻译（可选，未来填充） */
  translation?: string;
  /** 倪师注解（可选，标注来源） */
  niNote?: string;
}

export interface Chapter {
  /** 章节标题（如"卷一"、"总论篇"）*/
  title: string;
  /** Tên chương bằng tiếng Việt. */
  titleVi: string;
  /** 章节副标题/简介（可选）*/
  subtitle?: string;
  /** Tiêu đề phụ bằng tiếng Việt (có khi chương có `subtitle`). */
  subtitleVi?: string;
  paragraphs: Paragraph[];
}

export interface Book {
  /** 书名 */
  title: string;
  /** Tên sách bằng tiếng Việt (âm Hán Việt quen dùng). */
  titleVi: string;
  /** 书 slug（URL 用，如 'guisuifu'）*/
  slug: string;
  /** 朝代 */
  dynasty: string;
  /** Triều đại bằng tiếng Việt. */
  dynastyVi: string;
  /** 作者（多人或不详时填"不详"或多人）*/
  author: string;
  /** Tác giả bằng tiếng Việt. */
  authorVi: string;
  /** 简介 */
  intro: string;
  /** Giới thiệu sách bằng tiếng Việt. */
  introVi: string;
  /** 总字数（粗略）*/
  wordCount: number;
  chapters: Chapter[];
}

/** Đoạn khớp nằm ở bản dịch tiếng Việt hay ở nguyên văn chữ Hán. */
export type SearchField = 'vi' | 'text';

export interface SearchHit {
  bookSlug: string;
  bookTitle: string;
  bookTitleVi: string;
  /** Số thứ tự chương trong sách (dùng để dựng đường dẫn /library/[book]/[chapter]). */
  chapterIdx: number;
  chapterTitle: string;
  chapterTitleVi: string;
  paragraphId: string;
  /** Chữ tìm thấy nằm ở trường nào. */
  matchedIn: SearchField;
  /** 高亮片段（含 <mark> 标签，已转义 HTML），lấy từ trường `matchedIn` */
  snippet: string;
  /** 原文 */
  text: string;
  /** Bản dịch tiếng Việt của cả đoạn (nếu có). */
  vi?: string;
}
