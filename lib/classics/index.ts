/**
 * 古籍原典查询库 — 入口
 *
 * 加载所有古籍数据 + 提供查询/搜索 API
 * 数据为 JSON 静态打包，零 DB 依赖、零网络请求
 */

import type { Book, Paragraph, SearchField, SearchHit } from './types';
import { guSuiFu } from './data/gusuifu';
import { ziWeiQuanJi } from './data/quanji';
import { ziWeiQuanShu } from './data/quanshu';

/** 所有已收录古籍 */
export const ALL_BOOKS: Book[] = [
  guSuiFu,
  ziWeiQuanJi,
  ziWeiQuanShu,
];

/** 总段落数（用于首页统计） */
export const TOTAL_PARAGRAPHS = ALL_BOOKS.reduce(
  (sum, b) => sum + b.chapters.reduce((s, c) => s + c.paragraphs.length, 0),
  0,
);

/** 按 slug 取书 */
export function getBookBySlug(slug: string): Book | null {
  return ALL_BOOKS.find(b => b.slug === slug) ?? null;
}

/** 按章节序号取章节 */
export function getChapter(bookSlug: string, chapterIdx: number) {
  const book = getBookBySlug(bookSlug);
  if (!book) return null;
  if (!Number.isInteger(chapterIdx) || chapterIdx < 0) return null;
  const chapter = book.chapters[chapterIdx];
  if (!chapter) return null;
  return { book, chapter, chapterIdx };
}

/** 按段落 id 取段落（含书与章节信息）*/
export function getParagraphById(id: string) {
  for (const book of ALL_BOOKS) {
    for (let i = 0; i < book.chapters.length; i++) {
      const ch = book.chapters[i];
      const p = ch.paragraphs.find(p => p.id === id);
      if (p) {
        return { book, chapter: ch, chapterIdx: i, paragraph: p };
      }
    }
  }
  return null;
}

/**
 * Chuẩn hoá chữ để so khớp: bỏ dấu tiếng Việt, đổi đ → d, viết thường, gộp khoảng trắng.
 *
 * Làm theo từng ký tự gốc và ghi lại vị trí, để khi tìm thấy trong chuỗi đã chuẩn hoá
 * vẫn đánh dấu đúng đoạn tương ứng trong chuỗi gốc (kể cả khi chuỗi gốc viết dấu rời kiểu NFD).
 * Chữ Hán không bị đổi gì, nên cùng một hàm dùng được cho cả nguyên văn lẫn bản dịch.
 */
interface FoldedText {
  /** Chuỗi đã chuẩn hoá. */
  folded: string;
  /** pos[k] = vị trí trong chuỗi gốc của ký tự thứ k trong `folded`; pos[folded.length] = độ dài chuỗi gốc. */
  pos: number[];
}

function foldChar(ch: string): string {
  return ch
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/đ/g, 'd');
}

function foldWithMap(source: string): FoldedText {
  let folded = '';
  const pos: number[] = [];
  let i = 0;
  let lastWasSpace = false;
  for (const ch of source) {
    if (/\s/.test(ch)) {
      // Gộp nhiều khoảng trắng liền nhau thành một dấu cách.
      if (!lastWasSpace) {
        folded += ' ';
        pos.push(i);
      }
      lastWasSpace = true;
    } else {
      const f = foldChar(ch);
      for (let k = 0; k < f.length; k++) pos.push(i);
      folded += f;
      if (f.length > 0) lastWasSpace = false;
    }
    i += ch.length;
  }
  pos.push(source.length);
  return { folded, pos };
}

/** Chuẩn hoá từ khoá tìm kiếm theo cùng quy tắc với nội dung. */
export function foldSearchText(s: string): string {
  return foldWithMap(s.trim()).folded;
}

/** Số ký tự ngữ cảnh lấy trước/sau chữ tìm thấy: chữ Hán đặc nghĩa nên cần ít hơn chữ Việt. */
const CONTEXT_CHARS: Record<SearchField, number> = { text: 40, vi: 90 };

/**
 * Tìm `foldedQuery` trong `source`, trả về đoạn trích có <mark> (đã escape HTML) hoặc null.
 * Với tiếng Việt, đoạn trích được cắt ở ranh giới từ cho dễ đọc.
 */
function buildSnippet(source: string, foldedQuery: string, field: SearchField): string | null {
  const { folded, pos } = foldWithMap(source);
  const at = folded.indexOf(foldedQuery);
  if (at < 0) return null;

  const matchStart = pos[at];
  const matchEnd = pos[at + foldedQuery.length];
  const ctx = CONTEXT_CHARS[field];

  let start = Math.max(0, matchStart - ctx);
  let end = Math.min(source.length, matchEnd + ctx);
  if (field === 'vi') {
    if (start > 0) {
      const sp = source.indexOf(' ', start);
      if (sp >= 0 && sp < matchStart) start = sp + 1;
    }
    if (end < source.length) {
      const sp = source.lastIndexOf(' ', end);
      if (sp > matchEnd) end = sp;
    }
  }

  return (start > 0 ? '…' : '')
    + escapeHtml(source.slice(start, matchStart))
    + `<mark>${escapeHtml(source.slice(matchStart, matchEnd))}</mark>`
    + escapeHtml(source.slice(matchEnd, end))
    + (end < source.length ? '…' : '');
}

/** Tìm trong bản dịch trước (người dùng gõ tiếng Việt), không thấy thì tìm trong nguyên văn. */
function matchParagraph(p: Paragraph, foldedQuery: string): { field: SearchField; snippet: string } | null {
  if (p.vi) {
    const snippet = buildSnippet(p.vi, foldedQuery, 'vi');
    if (snippet) return { field: 'vi', snippet };
  }
  const snippet = buildSnippet(p.text, foldedQuery, 'text');
  return snippet ? { field: 'text', snippet } : null;
}

/**
 * 全文搜索
 *
 * Tìm chuỗi con trong cả nguyên văn chữ Hán lẫn bản dịch tiếng Việt.
 * Tiếng Việt không phân biệt dấu và hoa thường: "tu vi", "Tử Vi", "TỬ VI" cho cùng kết quả.
 * Chưa hỗ trợ đổi chữ phồn thể ↔ giản thể.
 */
export function searchClassics(query: string, limit = 30): SearchHit[] {
  const q = foldSearchText(query);
  if (q.length < 1) return [];

  const hits: SearchHit[] = [];
  for (const book of ALL_BOOKS) {
    for (let chapterIdx = 0; chapterIdx < book.chapters.length; chapterIdx++) {
      const chapter = book.chapters[chapterIdx];
      for (const p of chapter.paragraphs) {
        const match = matchParagraph(p, q);
        if (!match) continue;

        hits.push({
          bookSlug: book.slug,
          bookTitle: book.title,
          bookTitleVi: book.titleVi,
          chapterIdx,
          chapterTitle: chapter.title,
          chapterTitleVi: chapter.titleVi,
          paragraphId: p.id,
          matchedIn: match.field,
          snippet: match.snippet,
          text: p.text,
          vi: p.vi,
        });

        if (hits.length >= limit) return hits;
      }
    }
  }
  return hits;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export type { Book, Chapter, Paragraph, SearchField, SearchHit } from './types';
