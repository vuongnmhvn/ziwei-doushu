/**
 * Sinh bảng thuật ngữ Trung → Việt (tên sao, cung, can chi, độ sáng, Tứ Hoá, cục…)
 * từ hai bộ locale zh-CN và vi-VN có sẵn trong thư viện iztro.
 *
 * Chạy lại khi nâng cấp iztro:  npx tsx scripts/i18n/gen-vi-terms.ts
 * Kết quả ghi vào lib/i18n/vi-terms.generated.ts (không sửa tay file đó;
 * chữ cần sửa thì thêm vào VI_OVERRIDES trong lib/i18n/vi.ts).
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const zh: Record<string, unknown> = require('iztro/lib/i18n/locales/zh-CN').default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const vi: Record<string, unknown> = require('iztro/lib/i18n/locales/vi-VN').default;

/**
 * Thống nhất cách bỏ dấu theo kiểu cũ (Hoả, Thuỷ, Hoá) như phần chữ viết tay của giao diện:
 * với vần "oa", "oe", "uy" đứng cuối âm tiết, dấu thanh đặt ở nguyên âm sau.
 */
const TONED: Record<string, string[]> = {
  o: ['ó', 'ò', 'ỏ', 'õ', 'ọ'], u: ['ú', 'ù', 'ủ', 'ũ', 'ụ'],
  a: ['á', 'à', 'ả', 'ã', 'ạ'], e: ['é', 'è', 'ẻ', 'ẽ', 'ẹ'], y: ['ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],
};
function oldStyleTone(text: string): string {
  return text.replace(/([óòỏõọÓÒỎÕỌ])([aeAE])(?![\p{L}])|([úùủũụÚÙỦŨỤ])([yY])(?![\p{L}])/gu, (m, o, ae, u, y) => {
    const [toned, plain, base] = o ? [o, ae, 'o'] : [u, y, 'u'];
    const lower = toned.toLowerCase();
    const tone = TONED[base].indexOf(lower);
    const upperFirst = toned !== lower;
    const next = TONED[plain.toLowerCase()][tone];
    return (upperFirst ? base.toUpperCase() : base) + (plain === plain.toUpperCase() ? next.toUpperCase() : next);
  });
}

const pairs = new Map<string, string>();
for (const key of Object.keys(zh)) {
  const from = zh[key];
  const to = vi[key];
  if (typeof from !== 'string' || typeof to !== 'string' || !from || !to) continue;
  // Cùng một chữ Hán có thể ứng với nhiều khoá; giữ bản dịch gặp trước, giống thứ tự locale của iztro.
  if (!pairs.has(from)) pairs.set(from, oldStyleTone(to));
}

const sorted = [...pairs.entries()].sort(([a], [b]) => a.localeCompare(b, 'zh-CN'));
const body = sorted.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n');
const out = `// File sinh tự động bởi scripts/i18n/gen-vi-terms.ts từ locale zh-CN và vi-VN của iztro. Không sửa tay.
export const VI_TERMS_GENERATED: Record<string, string> = {
${body}
};
`;
const target = join(__dirname, '../../lib/i18n/vi-terms.generated.ts');
writeFileSync(target, out);
console.log(`Đã ghi ${sorted.length} thuật ngữ vào lib/i18n/vi-terms.generated.ts`);
