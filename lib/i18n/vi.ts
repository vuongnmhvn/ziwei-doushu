/**
 * Lớp dịch tiếng Việt cho phần hiển thị.
 *
 * Nguyên tắc: bộ máy lập lá số (lib/ziwei/*) vẫn chạy bằng tên chữ Hán, vì mọi phép so khớp sao/cung
 * đều dựa vào chúng. Chỉ khi đưa ra màn hình mới đổi sang tiếng Việt bằng các hàm ở đây.
 * Không bao giờ đưa chữ đã dịch ngược vào bộ máy.
 */
import { VI_TERMS_GENERATED } from './vi-terms.generated';

/** Sửa hoặc bổ sung so với bảng sinh từ iztro (dùng tên gọi quen thuộc trong sách Tử Vi tiếng Việt). */
const VI_OVERRIDES: Record<string, string> = {
  // Độ sáng
  '陷': 'Hãm',
  '闲': 'Nhàn',
  '地': 'Địa',
  // Sao bị thiếu hoặc viết khác thói quen
  '博士': 'Bác Sĩ',
  '力士': 'Lực Sĩ',
  '副截': 'Phó Triệt',
  '副旬': 'Phó Tuần',
  '截空': 'Triệt Không',
  '旬空': 'Tuần Không',
  // Cung: bộ máy dùng tên của iztro (命宫 có chữ 宫, các cung khác không), hằng số cũ có chữ 宫
  '命宫': 'Mệnh',
  '身宫': 'Thân',
  '交友': 'Nô Bộc',
  '交友宫': 'Nô Bộc',
  '命': 'Mệnh',
  '身': 'Thân',
  // Tứ Hoá
  '化禄': 'Hoá Lộc',
  '化权': 'Hoá Quyền',
  '化科': 'Hoá Khoa',
  '化忌': 'Hoá Kỵ',
  // Âm dương nam nữ
  '阳男': 'Dương Nam',
  '阴男': 'Âm Nam',
  '阳女': 'Dương Nữ',
  '阴女': 'Âm Nữ',
  '男': 'Nam',
  '女': 'Nữ',
  // Ngũ hành
  '金': 'Kim',
  '木': 'Mộc',
  '水': 'Thuỷ',
  '火': 'Hoả',
  '土': 'Thổ',
};

const TERMS: Record<string, string> = { ...VI_TERMS_GENERATED, ...VI_OVERRIDES };

export const STEMS_VI = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const BRANCHES_VI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

const STEM_CHARS = '甲乙丙丁戊己庚辛壬癸';
const BRANCH_CHARS = '子丑寅卯辰巳午未申酉戌亥';

/** Dịch một can chi viết liền (ví dụ 壬午 → Nhâm Ngọ, 子 → Tý). Trả về null nếu chuỗi không phải can chi. */
function ganZhi(term: string): string | null {
  const parts: string[] = [];
  for (const ch of term) {
    const s = STEM_CHARS.indexOf(ch);
    const b = BRANCH_CHARS.indexOf(ch);
    if (s >= 0) parts.push(STEMS_VI[s]);
    else if (b >= 0) parts.push(BRANCHES_VI[b]);
    else return null;
  }
  return parts.length ? parts.join(' ') : null;
}

/**
 * Dịch một thuật ngữ Tử Vi (tên sao, tên cung, độ sáng, Tứ Hoá, cục, can chi…) sang tiếng Việt.
 * Không tìm thấy thì trả lại nguyên văn, để giao diện không bao giờ bị trống.
 */
export function vi(term: string | undefined | null): string {
  if (!term) return '';
  const exact = TERMS[term];
  if (exact) return exact;
  // Tên cung kiểu cũ: 兄弟宫 → 兄弟
  if (term.length > 1 && term.endsWith('宫')) {
    const base = TERMS[term.slice(0, -1)];
    if (base) return base;
  }
  // 化禄 viết rời: 化 + 禄
  if (term.startsWith('化') && TERMS[term.slice(1)]) return `Hoá ${TERMS[term.slice(1)]}`;
  return ganZhi(term) ?? term;
}

/** Tên cung có chữ "cung" phía trước khi cần câu đầy đủ: "cung Mệnh", "cung Tài Bạch". */
export function viPalace(name: string | undefined | null): string {
  const v = vi(name);
  return v ? `cung ${v}` : '';
}

/** Can theo số thứ tự 0–9. */
export function viStem(index: number): string {
  return STEMS_VI[((index % 10) + 10) % 10];
}

/** Chi theo số thứ tự 0–11 (0 = Tý). */
export function viBranch(index: number): string {
  return BRANCHES_VI[((index % 12) + 12) % 12];
}

/** Tên giờ theo chi: "giờ Tý". */
export function viShichen(branch: number): string {
  return `giờ ${viBranch(branch)}`;
}

/** Ngày âm lịch theo cách nói thường ngày: "mùng 5", "15". */
export function viLunarDay(day: number): string {
  return day <= 10 ? `mùng ${day}` : String(day);
}

/** Tháng âm lịch: "tháng 4", "tháng 4 (nhuận)". Bộ máy ghi tháng nhuận bằng số âm. */
export function viLunarMonth(month: number, isLeap = false): string {
  const m = Math.abs(month);
  return `tháng ${m}${isLeap || month < 0 ? ' (nhuận)' : ''}`;
}
