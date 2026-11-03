/**
 * Nơi sinh dùng cho ô chọn trên form: gộp tỉnh thành Việt Nam và Trung Quốc vào một chỗ,
 * cho biết kinh độ và giờ chuẩn đang dùng ở nơi đó lúc sinh.
 *
 * Giá trị lưu trong form và link chia sẻ là `value`: tên tiếng Việt với Việt Nam, tên chữ Hán với
 * Trung Quốc (giữ như bản gốc để link và lá số cũ vẫn mở được). `label` là chữ hiện trên màn hình.
 */
import { PROVINCES } from './cities';
import { CN_PLACE_VI } from './cities-cn-vi';
import { VN_PROVINCES } from './cities-vn';
import { vnUtcOffsetMinutes, type VnTimeRegion } from './vn-timezone';

export type PlaceCountry = 'VN' | 'CN';

export interface PlaceCity {
  value: string;
  label: string;
  longitude: number;
  region?: VnTimeRegion;
}

export interface PlaceProvince {
  value: string;
  label: string;
  country: PlaceCountry;
  region?: VnTimeRegion;
  cities: PlaceCity[];
}

export interface PlaceGroup {
  country: PlaceCountry;
  label: string;
  provinces: PlaceProvince[];
}

/** Giờ Bắc Kinh (GMT+8), giờ chuẩn của mọi nơi ở Trung Quốc trong bộ máy gốc. */
export const CHINA_UTC_OFFSET = 480;

const cnLabel = (name: string) => CN_PLACE_VI[name] ?? name;

/**
 * Không hiện trong danh sách cho người Việt: 三沙 là đơn vị Trung Quốc lập ra để quản lý Hoàng Sa và Trường Sa.
 * Link cũ có lưu tên này vẫn tính đúng giờ vì tra kinh độ trong cities.ts khi cần (findCity trả undefined thì giữ kinh độ đã lưu).
 */
const HIDDEN_CN_CITY = (name: string) => name.startsWith('三沙');

export const PLACE_GROUPS: PlaceGroup[] = [
  {
    country: 'VN',
    label: 'Việt Nam',
    provinces: VN_PROVINCES.map(p => ({
      value: p.name,
      label: p.name,
      country: 'VN' as const,
      region: p.region,
      cities: p.cities.map(c => ({ value: c.name, label: c.name, longitude: c.longitude, region: c.region ?? p.region })),
    })),
  },
  {
    country: 'CN',
    label: 'Trung Quốc',
    provinces: PROVINCES.map(p => ({
      value: p.name,
      label: cnLabel(p.name),
      country: 'CN' as const,
      cities: p.cities.filter(c => !HIDDEN_CN_CITY(c.name)).map(c => ({ value: c.name, label: cnLabel(c.name), longitude: c.longitude })),
    })),
  },
];

const BY_VALUE = new Map<string, PlaceProvince>(
  PLACE_GROUPS.flatMap(g => g.provinces.map(p => [p.value, p] as const)),
);

export function findProvince(value: string | undefined): PlaceProvince | undefined {
  return value ? BY_VALUE.get(value) : undefined;
}

export function findCity(provinceValue: string | undefined, cityValue: string | undefined): PlaceCity | undefined {
  return findProvince(provinceValue)?.cities.find(c => c.value === cityValue);
}

/**
 * Giờ chuẩn (phút lệch so với UTC) mà đồng hồ ở nơi sinh đang chạy lúc sinh.
 * Việt Nam tra theo từng thời kỳ; Trung Quốc và trường hợp chưa chọn nơi sinh dùng giờ Bắc Kinh như bản gốc.
 */
export function placeUtcOffsetMinutes(
  provinceValue: string | undefined,
  cityValue: string | undefined,
  year: number, month: number, day: number,
  clockHour = 12, clockMinute = 0,
): number {
  const province = findProvince(provinceValue);
  if (province?.country !== 'VN') return CHINA_UTC_OFFSET;
  const region = findCity(provinceValue, cityValue)?.region ?? province.region ?? 'nam';
  if (!year || !month || !day) return 420;
  return vnUtcOffsetMinutes(region, year, month, day, clockHour, clockMinute);
}

/** Chữ hiển thị cho tỉnh/thành đã lưu (link cũ có thể lưu tên chữ Hán). */
export function placeLabel(value: string | undefined): string {
  if (!value) return '';
  return findProvince(value)?.label ?? cnLabel(value);
}

/** Chữ hiển thị cho thành phố đã lưu. */
export function cityLabel(provinceValue: string | undefined, cityValue: string | undefined): string {
  if (!cityValue) return '';
  return findCity(provinceValue, cityValue)?.label ?? cnLabel(cityValue);
}
