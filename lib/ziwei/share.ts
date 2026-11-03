import type { BirthFormState } from '@/components/BirthForm';
import type { BirthInfo } from './types';
import { branchFromSolarMinutes, resolveZiweiDayOffset, shiftGregorianDate } from './true-solar-time';
import { CHINA_UTC_OFFSET, placeUtcOffsetMinutes } from './birth-place';

/** Số phút cần cộng vào giờ đồng hồ để ra giờ mặt trời thật (chỉ theo kinh độ, như bản gốc). */
function longitudeCorrection(longitude: number, utcOffsetMinutes: number): number {
  return (longitude - utcOffsetMinutes / 4) * 4;
}

/** Giờ chuẩn ở nơi sinh lúc sinh (phút lệch UTC). Chưa chọn nơi sinh thì coi như giờ Bắc Kinh, tức không chỉnh gì. */
export function formUtcOffsetMinutes(form: BirthFormState): number {
  if (!form.province) return CHINA_UTC_OFFSET;
  return placeUtcOffsetMinutes(
    form.province, form.latitude,
    parseInt(form.year) || 0, parseInt(form.month) || 0, parseInt(form.day) || 0,
    parseInt(form.clockHour) || 0, parseInt(form.clockMinute) || 0,
  );
}

/** 根据钟表时间 + 经度计算真太阳时时辰支 (0-11)；utcOffsetMinutes 为钟表所在时区（默认北京时间 480） */
export function calcTrueSolarBranch(clockHour: number, clockMinute: number, longitude: number, utcOffsetMinutes = CHINA_UTC_OFFSET): number {
  const clockMins = clockHour * 60 + clockMinute;
  const offset = longitudeCorrection(longitude, utcOffsetMinutes);
  const solar = ((clockMins + offset) % 1440 + 1440) % 1440;
  if (solar >= 1380 || solar < 60) return 0;
  return Math.floor((solar - 60) / 120) + 1;
}

/** BirthFormState → BirthInfo
 *
 * 子时规则（倪海厦体系/三合派标准）：
 * · 23:00-23:59 = 晚子时，**按次日**排盘（日期 +1）
 * · 00:00-00:59 = 早子时，按本日排盘
 * 这与「时辰支同为子(0)」并不冲突——子时分早晚两段，需要在日期上区分。
 */
export function formToBirthInfo(form: BirthFormState): BirthInfo {
  let y = parseInt(form.year) || 0;
  let m = parseInt(form.month) || 0;
  let d = parseInt(form.day) || 0;
  let hour = 0;
  const utcOffsetMinutes = formUtcOffsetMinutes(form);

  // 晚子时换日按真太阳时判定，与时辰支同一口径（见 true-solar-time.ts 的 resolveZiweiDayOffset）。
  // 只看钟表 23 点会和经度校正后的时辰错位：东经 100° 钟表 23:30 是真太阳时 22:10 亥时，不该换日。
  if (!form.unknownTime) {
    const solar = (parseInt(form.clockHour) || 0) * 60 + (parseInt(form.clockMinute) || 0) + longitudeCorrection(form.longitude, utcOffsetMinutes);
    const normalizedMinutes = ((solar % 1440) + 1440) % 1440;
    hour = branchFromSolarMinutes(normalizedMinutes);
    const dayOffset = resolveZiweiDayOffset({ dayOffset: Math.floor(solar / 1440), normalizedMinutes, branch: hour });
    if (dayOffset !== 0 && y > 0 && m > 0 && d > 0) {
      ({ year: y, month: m, day: d } = shiftGregorianDate({ year: y, month: m, day: d }, dayOffset));
    }
  }

  return {
    year: y, month: m, day: d,
    hour,
    gender: form.gender,
    name: form.name || undefined,
    province: form.province || undefined,
    city: form.city || undefined,
    longitude: form.province ? form.longitude : undefined,
    utcOffsetMinutes: form.province ? utcOffsetMinutes : undefined,
  };
}

/** BirthFormState → URLSearchParams（用于分享链接） */
export function formToSearchParams(form: BirthFormState): URLSearchParams {
  const p = new URLSearchParams();
  if (form.name) p.set('n', form.name);
  p.set('y', form.year);
  p.set('m', form.month);
  p.set('d', form.day);
  if (form.unknownTime) {
    p.set('u', '1');
  } else {
    p.set('h', form.clockHour);
    p.set('mi', form.clockMinute);
  }
  if (form.province) p.set('p', form.province);
  if (form.city) p.set('c', form.city);
  if (form.longitude && form.longitude !== 120) p.set('lo', String(form.longitude));
  if (form.latitude !== undefined) p.set('la', String(form.latitude));
  p.set('g', form.gender === 'male' ? 'm' : 'f');
  return p;
}

/** URLSearchParams → Partial<BirthFormState>，不完整时返回 null */
export function searchParamsToForm(params: URLSearchParams): Partial<BirthFormState> | null {
  const year = params.get('y');
  const month = params.get('m');
  const day = params.get('d');
  if (!year || !month || !day) return null;
  return {
    name: params.get('n') || '',
    year,
    month,
    day,
    unknownTime: params.get('u') === '1',
    clockHour: params.get('h') || '8',
    clockMinute: params.get('mi') || '0',
    province: params.get('p') || '',
    city: params.get('c') || '',
    longitude: parseFloat(params.get('lo') || '120'),
    latitude: params.get('la') ? parseFloat(params.get('la')!) : undefined,
    gender: params.get('g') === 'f' ? 'female' : 'male',
  };
}
