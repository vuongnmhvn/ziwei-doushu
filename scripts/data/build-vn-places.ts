/**
 * Dựng dữ liệu nơi sinh Việt Nam cho ô chọn trên form, từ API https://provinces.open-api.vn/ :
 *   - v1: 63 tỉnh thành cũ (trước sáp nhập 7/2025) và quận/huyện
 *   - v2: 34 tỉnh thành mới và phường/xã
 * API không có toạ độ, nên:
 *   - tỉnh và quận/huyện: tra OpenStreetMap Nominatim (1 lượt/giây theo quy định); toạ độ phải nằm trong khung
 *     của tỉnh (nới 0,15°), không thì lấy tâm tỉnh và đánh dấu "gần đúng"
 *   - phường/xã mới: hỏi API /api/v2/w/{mã}/to-legacies/ xem được gộp từ phường/xã cũ nào, lấy toạ độ của
 *     quận/huyện cũ góp nhiều phường/xã nhất
 *
 * Chạy:  npx tsx scripts/data/build-vn-places.ts
 * Bộ nhớ đệm toạ độ: scripts/data/geocode-cache.json (chạy lại chỉ hỏi những nơi còn thiếu).
 * Kết quả:
 *   lib/ziwei/vn-provinces.generated.ts   danh sách tỉnh (gói cùng trang)
 *   public/data/vn-units-old.json          quận/huyện theo mã tỉnh cũ (tải khi cần)
 *   public/data/vn-units-new.json          phường/xã theo mã tỉnh mới (tải khi cần)
 * Dữ liệu toạ độ © OpenStreetMap contributors (ODbL).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const CACHE_FILE = join(__dirname, 'geocode-cache.json');
const UA = 'tuvi-vuongnm-data-builder/1.0 (+https://tuvi.vuongnm.com)';
const VN_BBOX = { minLon: 102, maxLon: 110, minLat: 8, maxLat: 23.6 };

interface ApiUnit { name: string; code: number }
interface ApiProvince { name: string; code: number; districts?: ApiUnit[]; wards?: ApiUnit[] }
interface Point { lon: number; lat: number; bbox?: [number, number, number, number] } // minLat, maxLat, minLon, maxLon

type Cache = Record<string, Point | null>;
const cache: Cache = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, 'utf8')) : {};
let dirty = 0;
function saveCache(force = false) {
  if (!force && dirty < 25) return;
  const sorted = Object.fromEntries(Object.keys(cache).sort().map(k => [k, cache[k]]));
  writeFileSync(CACHE_FILE, JSON.stringify(sorted));
  dirty = 0;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const round = (n: number) => Math.round(n * 1000) / 1000;

async function getJson(url: string): Promise<unknown> {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'vi' } });
      if (res.status === 429 || res.status >= 500) { await sleep(5000 * (attempt + 1)); continue; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (attempt === 3) throw e;
      await sleep(3000 * (attempt + 1));
    }
  }
  return null;
}

const SHORT_PREFIX = /^(Thành phố|Tỉnh|Quận|Huyện|Thị xã|Thị trấn|Phường|Xã|Đặc khu)\s+/u;
const shortName = (name: string) => name.replace(SHORT_PREFIX, '');

/** "Thành phố Hồ Chí Minh" → "TP. Hồ Chí Minh", "Tỉnh Nghệ An" → "Nghệ An" */
function provinceLabel(name: string): string {
  if (name.startsWith('Thành phố ')) return `TP. ${name.slice('Thành phố '.length)}`;
  return name.replace(/^Tỉnh\s+/u, '');
}

function inBox(p: Point, box?: Point['bbox'], margin = 0.15): boolean {
  if (p.lon < VN_BBOX.minLon || p.lon > VN_BBOX.maxLon || p.lat < VN_BBOX.minLat || p.lat > VN_BBOX.maxLat) return false;
  if (!box) return true;
  return p.lat >= box[0] - margin && p.lat <= box[1] + margin && p.lon >= box[2] - margin && p.lon <= box[3] + margin;
}

// ── Nominatim: một hàng đợi, 1 lượt/giây ──
let lastNominatim = 0;
async function nominatim(q: string, box?: Point['bbox']): Promise<Point | null> {
  const key = `nominatim:${q}`;
  if (key in cache) return cache[key];
  const wait = lastNominatim + 1100 - Date.now();
  if (wait > 0) await sleep(wait);
  lastNominatim = Date.now();
  const params = new URLSearchParams({ q, format: 'jsonv2', countrycodes: 'vn', limit: '1' });
  if (box) { params.set('viewbox', `${box[2] - 0.15},${box[1] + 0.15},${box[3] + 0.15},${box[0] - 0.15}`); params.set('bounded', '1'); }
  const rows = await getJson(`https://nominatim.openstreetmap.org/search?${params}`) as { lat: string; lon: string; boundingbox: string[] }[] | null;
  const row = rows?.[0];
  const point = row ? { lon: Number(row.lon), lat: Number(row.lat), bbox: row.boundingbox.map(Number) as Point['bbox'] } : null;
  cache[key] = point; dirty++; saveCache();
  return point;
}

// ── Phường/xã mới → quận/huyện cũ (API provinces.open-api.vn, tối đa 4 lượt cùng lúc) ──
/** Mã quận/huyện cũ góp nhiều phường/xã nhất vào phường/xã mới này; null nếu API không có dữ liệu. */
async function legacyDistrictOf(wardCode: number): Promise<number | null> {
  const key = `legacy:${wardCode}`;
  if (key in cache) return cache[key] as unknown as number | null;
  let rows: { district_code: number }[] | null;
  try {
    rows = await getJson(`https://provinces.open-api.vn/api/v2/w/${wardCode}/to-legacies/`) as { district_code: number }[] | null;
  } catch {
    return null; // lỗi mạng: không ghi vào bộ nhớ đệm để lần chạy sau hỏi lại
  }
  const counts = new Map<number, number>();
  for (const r of rows ?? []) counts.set(r.district_code, (counts.get(r.district_code) ?? 0) + 1);
  const best = [...counts.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] ?? null;
  (cache as Record<string, unknown>)[key] = best; dirty++; saveCache();
  return best;
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (next < items.length) { const i = next++; out[i] = await fn(items[i]); }
  }));
  return out;
}

interface ProvinceOut { code: number; name: string; label: string; lon: number; lat: number }
type UnitRow = [name: string, lon: number, lat: number, approx: 0 | 1];

async function locateProvince(p: ApiProvince): Promise<Point> {
  const found = await nominatim(`${p.name}, Việt Nam`) ?? await nominatim(`${shortName(p.name)}, Việt Nam`);
  if (!found || !inBox(found)) throw new Error(`Không tìm được toạ độ tỉnh ${p.name}`);
  return found;
}

/** Quận/huyện cũ: tra Nominatim trong khung tỉnh. Trả cả bảng mã quận/huyện → toạ độ để dùng cho phường/xã mới. */
async function locateDistricts(
  units: ApiUnit[], province: ApiProvince, center: Point, byCode: Map<number, UnitRow>,
): Promise<{ rows: UnitRow[]; approx: number }> {
  const rows: UnitRow[] = [];
  let approx = 0;
  const prov = shortName(province.name);
  for (const u of units) {
    const candidates = [`${u.name}, ${prov}`, `${shortName(u.name)}, ${prov}`];
    let point: Point | null = null;
    for (const q of candidates) {
      const p = await nominatim(q, center.bbox);
      if (p && inBox(p, center.bbox)) { point = p; break; }
    }
    const row: UnitRow = point
      ? [u.name, round(point.lon), round(point.lat), 0]
      : [u.name, round(center.lon), round(center.lat), 1];
    if (!point) approx++;
    rows.push(row);
    byCode.set(u.code, row);
  }
  return { rows, approx };
}

async function main() {
  console.log('Tải danh sách từ provinces.open-api.vn …');
  const v1 = await getJson('https://provinces.open-api.vn/api/v1/?depth=2') as ApiProvince[];
  const v2 = await getJson('https://provinces.open-api.vn/api/v2/?depth=2') as ApiProvince[];
  console.log(`  v1: ${v1.length} tỉnh, ${v1.reduce((n, p) => n + (p.districts?.length ?? 0), 0)} quận/huyện`);
  console.log(`  v2: ${v2.length} tỉnh, ${v2.reduce((n, p) => n + (p.wards?.length ?? 0), 0)} phường/xã`);

  const centers = new Map<string, Point>();
  for (const [tag, list] of [['old', v1], ['new', v2]] as const) {
    for (const p of list) centers.set(`${tag}:${p.code}`, await locateProvince(p));
  }
  console.log('  Đã có toạ độ cả 97 tỉnh.');

  const provinceOut = (tag: 'old' | 'new', list: ApiProvince[]): ProvinceOut[] => list.map(p => {
    const c = centers.get(`${tag}:${p.code}`)!;
    return { code: p.code, name: p.name, label: provinceLabel(p.name), lon: round(c.lon), lat: round(c.lat) };
  });

  // Quận/huyện cũ (Nominatim) chạy song song với việc hỏi API phường/xã mới gộp từ đâu.
  const districtByCode = new Map<number, UnitRow>();
  const oldOut: Record<number, UnitRow[]> = {};
  let oldTotal = 0; let oldApprox = 0;
  const districtsDone = (async () => {
    for (const p of v1) {
      const r = await locateDistricts(p.districts ?? [], p, centers.get(`old:${p.code}`)!, districtByCode);
      oldOut[p.code] = r.rows; oldTotal += r.rows.length; oldApprox += r.approx;
      console.log(`  [cũ] ${p.name}: ${r.rows.length} quận/huyện, ${r.approx} gần đúng`);
    }
  })();
  const allWards = v2.flatMap(p => (p.wards ?? []).map(w => ({ w, p })));
  const legacyDone = mapLimit(allWards, 4, ({ w }) => legacyDistrictOf(w.code));
  const [, legacy] = await Promise.all([districtsDone, legacyDone]);
  console.log(`  Đã có quận/huyện cũ của ${legacy.filter(x => x !== null).length}/${allWards.length} phường/xã mới.`);

  const newOut: Record<number, UnitRow[]> = {};
  let newApprox = 0;
  allWards.forEach(({ w, p }, i) => {
    const d = legacy[i] !== null ? districtByCode.get(legacy[i]!) : undefined;
    const c = centers.get(`new:${p.code}`)!;
    const row: UnitRow = d && !d[3] ? [w.name, d[1], d[2], 0] : [w.name, round(c.lon), round(c.lat), 1];
    if (row[3]) newApprox++;
    (newOut[p.code] ??= []).push(row);
  });
  saveCache(true);
  const oldUnits = { out: oldOut, total: oldTotal, approx: oldApprox };
  const newUnits = { out: newOut, total: allWards.length, approx: newApprox };

  const ts = `// File sinh tự động bởi scripts/data/build-vn-places.ts. Không sửa tay.
// Nguồn: provinces.open-api.vn (danh sách), OpenStreetMap (toạ độ, © OpenStreetMap contributors, ODbL).
export interface VnProvinceData { code: number; name: string; label: string; lon: number; lat: number }
/** 63 tỉnh thành cũ (trước sáp nhập 7/2025). */
export const VN_PROVINCES_OLD: VnProvinceData[] = ${JSON.stringify(provinceOut('old', v1))};
/** 34 tỉnh thành mới (từ 7/2025). */
export const VN_PROVINCES_NEW: VnProvinceData[] = ${JSON.stringify(provinceOut('new', v2))};
`;
  writeFileSync(join(ROOT, 'lib/ziwei/vn-provinces.generated.ts'), ts);
  mkdirSync(join(ROOT, 'public/data'), { recursive: true });
  writeFileSync(join(ROOT, 'public/data/vn-units-old.json'), JSON.stringify(oldUnits.out));
  writeFileSync(join(ROOT, 'public/data/vn-units-new.json'), JSON.stringify(newUnits.out));
  console.log(`\nXong. Quận/huyện: ${oldUnits.total} (${oldUnits.approx} gần đúng). Phường/xã: ${newUnits.total} (${newUnits.approx} gần đúng).`);
}

main().catch(e => { saveCache(true); console.error('LỖI:', e instanceof Error ? e.message : e); process.exit(1); });
