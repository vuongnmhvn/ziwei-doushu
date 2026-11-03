/**
 * Giờ chuẩn Việt Nam theo từng thời kỳ, để đổi giờ đồng hồ lúc sinh ra giờ mặt trời thật.
 *
 * Nguồn: cơ sở dữ liệu tz (IANA), vùng Asia/Ho_Chi_Minh. Bài test
 * scripts/regression/vn-timezone.test.ts đối chiếu bảng này với dữ liệu tz của Node từng giờ một.
 *
 * - Miền Nam (từ Quảng Trị trở vào, phía nam vĩ tuyến 17) theo đúng Asia/Ho_Chi_Minh:
 *   có những giai đoạn dùng GMT+8 (1943–1945, 1947–1955, 1960–1975) và GMT+9 (1945).
 * - Miền Bắc: giống miền Nam tới ngày 2/9/1945, sau đó luôn là GMT+7.
 *   Giai đoạn 1947–1954 vùng do Pháp kiểm soát ở miền Bắc có thể đã theo GMT+8; tz không ghi riêng
 *   nên ở đây coi là GMT+7.
 */

export type VnTimeRegion = 'bac' | 'nam';

interface Segment {
  /** Thời điểm bắt đầu (mili giây UTC). */
  startUtc: number;
  /** Độ lệch so với UTC, tính bằng phút. */
  offset: number;
}

const utc = (y: number, m: number, d: number, h = 0, min = 0) => Date.UTC(y, m - 1, d, h, min);

const SOUTH: Segment[] = [
  { startUtc: -Infinity, offset: 426.5 },            // giờ địa phương Sài Gòn 7:06:30
  { startUtc: Date.UTC(1911, 3, 30, 16, 53, 30), offset: 420 }, // nửa đêm 1/5/1911 theo giờ 7:06:30
  { startUtc: utc(1942, 12, 31, 16), offset: 480 },
  { startUtc: utc(1945, 3, 14, 15), offset: 540 },
  { startUtc: utc(1945, 9, 1, 15), offset: 420 },
  { startUtc: utc(1947, 3, 31, 17), offset: 480 },
  { startUtc: utc(1955, 6, 30, 17), offset: 420 },
  { startUtc: utc(1959, 12, 31, 16), offset: 480 },
  { startUtc: utc(1975, 6, 12, 16), offset: 420 },
];

const NORTH: Segment[] = [
  ...SOUTH.filter(s => s.startUtc < utc(1945, 9, 1, 15)),
  { startUtc: utc(1945, 9, 1, 15), offset: 420 },
];

/**
 * Độ lệch giờ (phút) đang dùng ở Việt Nam tại một giờ đồng hồ cụ thể.
 * Giờ rơi vào lúc chuyển giờ (bị nhảy qua hoặc lặp lại) thì lấy giờ cũ, tức giờ trước lúc chuyển.
 */
export function vnUtcOffsetMinutes(
  region: VnTimeRegion,
  year: number, month: number, day: number,
  clockHour = 12, clockMinute = 0,
): number {
  const segments = region === 'bac' ? NORTH : SOUTH;
  const wall = utc(year, month, day, clockHour, clockMinute);
  let fallback = segments[segments.length - 1].offset;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const next = segments[i + 1]?.startUtc ?? Infinity;
    const instant = wall - seg.offset * 60_000;
    if (instant >= seg.startUtc && instant < next) return seg.offset;
    // Giờ bị nhảy qua: không đoạn nào khớp, dùng đoạn đầu tiên bắt đầu sau giờ đó.
    if (instant < seg.startUtc) { fallback = segments[i - 1]?.offset ?? seg.offset; break; }
  }
  return fallback;
}

/** "GMT+7", "GMT+8", "GMT+7:06" */
export function formatUtcOffset(offset: number): string {
  const sign = offset >= 0 ? '+' : '−';
  const abs = Math.abs(offset);
  const h = Math.floor(abs / 60);
  const m = Math.round(abs % 60);
  return `GMT${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
}
