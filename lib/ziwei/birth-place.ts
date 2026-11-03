/**
 * Nơi sinh cho ô chọn trên form, theo ba cách chọn:
 *   - "vn-old": 63 tỉnh thành cũ (trước sáp nhập 7/2025) → quận/huyện
 *   - "vn-new": 34 tỉnh thành mới (từ 7/2025) → phường/xã
 *   - "cn":     tỉnh thành Trung Quốc của bộ máy gốc → thành phố
 * Danh sách tỉnh Việt Nam và toạ độ sinh bởi scripts/data/build-vn-places.ts (provinces.open-api.vn + OpenStreetMap).
 * Quận/huyện, phường/xã nằm ở public/data/*.json, chỉ tải khi người dùng chọn tỉnh.
 *
 * Giá trị lưu trong form và link chia sẻ: tỉnh Việt Nam là "vn-old:<mã>" / "vn-new:<mã>", tỉnh Trung Quốc giữ tên chữ Hán
 * như bản gốc. Kinh độ và vĩ độ của nơi đã chọn được lưu thẳng vào form, nên tính giờ không cần tải lại danh sách.
 */
import { PROVINCES } from './cities';
import { CN_PLACE_VI } from './cities-cn-vi';
import { VN_PROVINCES_NEW, VN_PROVINCES_OLD, type VnProvinceData } from './vn-provinces.generated';
import { vnUtcOffsetMinutes, type VnTimeRegion } from './vn-timezone';

export type PlaceSystem = 'vn-old' | 'vn-new' | 'cn';

export interface PlaceSystemInfo {
  key: PlaceSystem;
  label: string;
  /** Câu ngắn giải thích khi chọn cách này. */
  hint: string;
  provinceLabel: string;
  unitLabel: string;
}

export const PLACE_SYSTEMS: PlaceSystemInfo[] = [
  { key: 'vn-old', label: 'Tỉnh cũ', hint: 'Tên tỉnh, huyện như trên giấy khai sinh (trước 7/2025).', provinceLabel: 'Tỉnh / thành phố', unitLabel: 'Quận / huyện' },
  { key: 'vn-new', label: 'Tỉnh mới', hint: 'Tên tỉnh, xã sau khi sáp nhập (từ 7/2025).', provinceLabel: 'Tỉnh / thành phố', unitLabel: 'Phường / xã' },
  { key: 'cn', label: 'Trung Quốc', hint: 'Người sinh ở Trung Quốc (giờ Bắc Kinh).', provinceLabel: 'Tỉnh / thành phố', unitLabel: 'Thành phố' },
];

export interface PlaceUnit {
  value: string;
  label: string;
  longitude: number;
  latitude?: number;
}

export interface PlaceProvince {
  value: string;
  label: string;
  system: PlaceSystem;
  longitude: number;
  latitude?: number;
}

/** Giờ Bắc Kinh (GMT+8), giờ chuẩn của mọi nơi ở Trung Quốc trong bộ máy gốc. */
export const CHINA_UTC_OFFSET = 480;
/** Sông Bến Hải ở khoảng vĩ tuyến 17: phía bắc theo giờ miền Bắc, phía nam theo giờ miền Nam. */
const PARTITION_LATITUDE = 17.0;

const cnLabel = (name: string) => CN_PLACE_VI[name] ?? name;
/**
 * Không hiện trong danh sách cho người Việt: 三沙 là đơn vị Trung Quốc lập ra để quản lý Hoàng Sa và Trường Sa.
 * Link cũ có lưu tên này vẫn tính đúng giờ vì kinh độ đã nằm trong link.
 */
const HIDDEN_CN_CITY = (name: string) => name.startsWith('三沙');

const vnProvince = (system: 'vn-old' | 'vn-new') => (p: VnProvinceData): PlaceProvince => ({
  value: `${system}:${p.code}`, label: p.label, system, longitude: p.lon, latitude: p.lat,
});

const PROVINCES_BY_SYSTEM: Record<PlaceSystem, PlaceProvince[]> = {
  'vn-old': VN_PROVINCES_OLD.map(vnProvince('vn-old')),
  'vn-new': VN_PROVINCES_NEW.map(vnProvince('vn-new')),
  cn: PROVINCES.map(p => ({
    value: p.name, label: cnLabel(p.name), system: 'cn' as const,
    longitude: p.cities[0]?.longitude ?? 120,
  })),
};

const BY_VALUE = new Map<string, PlaceProvince>(
  Object.values(PROVINCES_BY_SYSTEM).flatMap(list => list.map(p => [p.value, p] as const)),
);

export function provincesOf(system: PlaceSystem): PlaceProvince[] {
  return PROVINCES_BY_SYSTEM[system];
}

export function findProvince(value: string | undefined): PlaceProvince | undefined {
  return value ? BY_VALUE.get(value) : undefined;
}

/** Cách chọn của một tỉnh đã lưu; chưa chọn tỉnh thì mặc định "Tỉnh cũ". */
export function systemOf(provinceValue: string | undefined): PlaceSystem {
  return findProvince(provinceValue)?.system ?? 'vn-old';
}

type UnitRow = [name: string, lon: number, lat: number, approx: 0 | 1];
const unitFiles: Partial<Record<'vn-old' | 'vn-new', Promise<Record<string, UnitRow[]>>>> = {};

function loadUnitFile(system: 'vn-old' | 'vn-new'): Promise<Record<string, UnitRow[]>> {
  unitFiles[system] ??= fetch(`/data/vn-units-${system === 'vn-old' ? 'old' : 'new'}.json`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Record<string, UnitRow[]>>;
    })
    .catch(err => { delete unitFiles[system]; throw err; });
  return unitFiles[system]!;
}

/** Danh sách quận/huyện, phường/xã hoặc thành phố của một tỉnh. Việt Nam tải qua mạng ở lần đầu. */
export async function loadUnits(provinceValue: string): Promise<PlaceUnit[]> {
  const province = findProvince(provinceValue);
  if (!province) return [];
  if (province.system === 'cn') {
    const cn = PROVINCES.find(p => p.name === provinceValue);
    return (cn?.cities ?? []).filter(c => !HIDDEN_CN_CITY(c.name))
      .map(c => ({ value: c.name, label: cnLabel(c.name), longitude: c.longitude }));
  }
  const code = provinceValue.slice(province.system.length + 1);
  const rows = (await loadUnitFile(province.system))[code] ?? [];
  return rows.map(([name, lon, lat]) => ({ value: name, label: name, longitude: lon, latitude: lat }));
}

/** Miền giờ theo vĩ độ nơi sinh (chưa biết vĩ độ thì lấy tâm tỉnh). */
export function vnRegionOf(provinceValue: string | undefined, latitude?: number): VnTimeRegion {
  const lat = latitude ?? findProvince(provinceValue)?.latitude ?? 0;
  return lat > PARTITION_LATITUDE ? 'bac' : 'nam';
}

/**
 * Giờ chuẩn (phút lệch so với UTC) mà đồng hồ ở nơi sinh đang chạy lúc sinh.
 * Việt Nam tra theo từng thời kỳ; Trung Quốc và tỉnh không nhận ra dùng giờ Bắc Kinh như bản gốc.
 */
export function placeUtcOffsetMinutes(
  provinceValue: string | undefined,
  latitude: number | undefined,
  year: number, month: number, day: number,
  clockHour = 12, clockMinute = 0,
): number {
  const province = findProvince(provinceValue);
  if (!province || province.system === 'cn') return CHINA_UTC_OFFSET;
  if (!year || !month || !day) return 420;
  return vnUtcOffsetMinutes(vnRegionOf(provinceValue, latitude), year, month, day, clockHour, clockMinute);
}

/** Chữ hiển thị cho tỉnh đã lưu (link cũ của Trung Quốc lưu tên chữ Hán). */
export function placeLabel(value: string | undefined): string {
  if (!value) return '';
  return findProvince(value)?.label ?? cnLabel(value);
}
