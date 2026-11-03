/**
 * Giờ chuẩn Việt Nam theo thời kỳ và giờ mặt trời thật cho người sinh ở Việt Nam.
 *
 * 1) Bảng miền Nam trong lib/ziwei/vn-timezone.ts phải khớp dữ liệu tz Asia/Ho_Chi_Minh của Node
 *    ở mọi giờ đồng hồ từ 1900 đến 2026 (trừ đúng giờ chuyển, nơi một giờ đồng hồ bị nhảy qua hoặc lặp lại).
 * 2) Miền Bắc luôn là GMT+7 từ 2/9/1945.
 * 3) Form: sinh ở Sài Gòn năm 1965 lúc 11:30 (đồng hồ chạy GMT+8) là giờ Tỵ, ở Hà Nội cùng giờ là giờ Ngọ;
 *    chưa chọn nơi sinh thì giữ nguyên giờ đồng hồ như bản gốc.
 */
import assert from 'node:assert/strict';
import { vnUtcOffsetMinutes } from '../../lib/ziwei/vn-timezone';
import { formToBirthInfo, calcTrueSolarBranch, formUtcOffsetMinutes } from '../../lib/ziwei/share';
import type { BirthFormState } from '../../components/BirthForm';

// ── 1) Đối chiếu với tz ──
const fmt = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Ho_Chi_Minh', timeZoneName: 'longOffset' });
function tzOffsetAt(utcMs: number): number {
  const name = fmt.formatToParts(new Date(utcMs)).find(p => p.type === 'timeZoneName')!.value; // GMT+07:00
  const m = /GMT([+-])(\d{2}):(\d{2})(?::(\d{2}))?/.exec(name)!;
  const v = Number(m[2]) * 60 + Number(m[3]) + Number(m[4] ?? 0) / 60;
  return m[1] === '-' ? -v : v;
}

let checked = 0;
let ambiguous = 0;
for (let t = Date.UTC(1900, 0, 1); t < Date.UTC(2027, 0, 1); t += 3600_000) {
  const off = tzOffsetAt(t);
  const wall = new Date(t + off * 60_000);
  const got = vnUtcOffsetMinutes('nam', wall.getUTCFullYear(), wall.getUTCMonth() + 1, wall.getUTCDate(), wall.getUTCHours(), wall.getUTCMinutes());
  if (got !== off) {
    // Chỉ chấp nhận lệch khi giờ đồng hồ này lặp lại lúc lùi giờ: hiểu theo độ lệch hàm chọn (giờ cũ)
    // thì cũng ra một thời điểm có thật mà tz đang dùng đúng độ lệch đó.
    const wallMs = t + off * 60_000;
    assert.equal(tzOffsetAt(wallMs - got * 60_000), got, `lệch ở ${new Date(t).toISOString()}: tz=${off}, hàm=${got}`);
    ambiguous++;
    continue;
  }
  checked++;
}
console.log(`  ✓ miền Nam khớp tz ở ${checked} giờ, ${ambiguous} giờ lặp lại lúc lùi giờ`);

// Mốc tiêu biểu
assert.equal(vnUtcOffsetMinutes('nam', 1965, 6, 15, 11, 30), 480, 'Sài Gòn 1965: GMT+8');
assert.equal(vnUtcOffsetMinutes('nam', 1975, 6, 13, 12, 0), 420, 'Sài Gòn sau 13/6/1975: GMT+7');
assert.equal(vnUtcOffsetMinutes('nam', 1957, 1, 1, 12, 0), 420, 'Sài Gòn 1957: GMT+7');
assert.equal(vnUtcOffsetMinutes('nam', 1950, 1, 1, 12, 0), 480, 'Sài Gòn 1950: GMT+8');
assert.equal(vnUtcOffsetMinutes('nam', 1945, 5, 1, 12, 0), 540, 'năm 1945: GMT+9');
assert.equal(vnUtcOffsetMinutes('nam', 1959, 12, 31, 23, 30), 420, 'giờ bị nhảy qua lúc 23:00 ngày 31/12/1959: lấy giờ cũ');

// ── 2) Miền Bắc ──
for (const [y, m, d] of [[1950, 1, 1], [1965, 6, 15], [1972, 12, 20], [2000, 1, 1]] as const) {
  assert.equal(vnUtcOffsetMinutes('bac', y, m, d, 12, 0), 420, `Hà Nội ${y}: GMT+7`);
}
assert.equal(vnUtcOffsetMinutes('bac', 1945, 5, 1, 12, 0), 540, 'Hà Nội tháng 5/1945: GMT+9');
console.log('  ✓ miền Bắc GMT+7 từ 2/9/1945');

// ── 3) Form ──
// Mã tỉnh cũ theo provinces.open-api.vn: 1 = Hà Nội, 45 = Quảng Trị, 79 = TP. Hồ Chí Minh; 79 ở danh sách mới cũng là TP. Hồ Chí Minh.
function form(province: string, longitude: number, latitude: number | undefined, year: string, clockHour: string, clockMinute: string): BirthFormState {
  return { name: '', year, month: '6', day: '15', clockHour, clockMinute, unknownTime: false, province, city: '', longitude, latitude, gender: 'male' };
}
const saigon = form('vn-old:79', 106.70, 10.78, '1965', '11', '30');
const hanoi = form('vn-old:1', 105.85, 21.03, '1965', '11', '30');
const none = form('', 120, undefined, '1965', '11', '30');
assert.equal(formUtcOffsetMinutes(saigon), 480);
assert.equal(formToBirthInfo(saigon).hour, 5, 'Sài Gòn 1965 11:30 → giờ Tỵ');
assert.equal(formToBirthInfo(saigon).utcOffsetMinutes, 480);
assert.equal(formToBirthInfo(hanoi).hour, 6, 'Hà Nội 1965 11:30 → giờ Ngọ');
assert.equal(formToBirthInfo(none).hour, 6, 'chưa chọn nơi sinh → theo giờ đồng hồ');
assert.equal(formToBirthInfo(none).utcOffsetMinutes, undefined);
assert.equal(formToBirthInfo({ ...saigon, year: '1990' }).hour, 6, 'Sài Gòn 1990 (GMT+7) 11:30 → giờ Ngọ');
assert.equal(calcTrueSolarBranch(11, 30, 106.70, 480), 5);
assert.equal(calcTrueSolarBranch(11, 30, 106.70), 5, 'mặc định vẫn là giờ Bắc Kinh như bản gốc');

// Vĩnh Linh nằm ở bờ bắc Bến Hải nên năm 1965 dùng giờ miền Bắc, dù cùng tỉnh Quảng Trị với Đông Hà.
assert.equal(formUtcOffsetMinutes(form('vn-old:45', 107.10, 16.82, '1965', '11', '30')), 480, 'Đông Hà 1965: GMT+8');
assert.equal(formUtcOffsetMinutes(form('vn-old:45', 107.03, 17.05, '1965', '11', '30')), 420, 'Vĩnh Linh 1965: GMT+7');
// Tỉnh mới Quảng Trị gộp cả Quảng Bình: xã ở Đồng Hới (vĩ độ 17,47) theo giờ miền Bắc.
assert.equal(formUtcOffsetMinutes(form('vn-new:44', 106.62, 17.47, '1965', '11', '30')), 420, 'Đồng Hới 1965: GMT+7');
assert.equal(formUtcOffsetMinutes(form('vn-new:79', 106.70, 10.78, '1965', '11', '30')), 480, 'TP. Hồ Chí Minh (tỉnh mới) 1965: GMT+8');
// Chưa chọn xã: lấy tâm tỉnh.
assert.equal(formUtcOffsetMinutes(form('vn-old:79', 106.70, undefined, '1965', '11', '30')), 480, 'chỉ chọn tỉnh: dùng vĩ độ tâm tỉnh');
// Tỉnh Trung Quốc vẫn là giờ Bắc Kinh.
assert.equal(formUtcOffsetMinutes(form('广东省', 113.26, undefined, '1965', '11', '30')), 480);

// Giờ Tý muộn ở Việt Nam vẫn sang ngày hôm sau theo giờ mặt trời thật.
const late = formToBirthInfo({ ...form('vn-old:1', 105.85, 21.03, '1990', '23', '30'), day: '31', month: '12' });
assert.deepEqual([late.year, late.month, late.day, late.hour], [1991, 1, 1, 0], 'Hà Nội 23:30 ngày 31/12/1990 → giờ Tý ngày 1/1/1991');
console.log('  ✓ form tính giờ mặt trời thật theo giờ chuẩn của nơi sinh');

console.log('\nvn-timezone: tất cả đạt\n');
