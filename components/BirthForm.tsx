'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BirthInfo } from '@/lib/ziwei/types';
import { SHICHEN } from '@/lib/ziwei/constants';
import { useTheme } from '@/components/ThemeProvider';
import { PLACE_SYSTEMS, provincesOf, findProvince, systemOf, loadUnits, type PlaceSystem, type PlaceUnit } from '@/lib/ziwei/birth-place';
import { formatUtcOffset } from '@/lib/ziwei/vn-timezone';
import { formToBirthInfo, calcTrueSolarBranch, formUtcOffsetMinutes } from '@/lib/ziwei/share';
import { viShichen } from '@/lib/i18n/vi';

export interface BirthFormState {
  name: string;
  year: string;
  month: string;
  day: string;
  clockHour: string;
  clockMinute: string;
  unknownTime: boolean;
  province: string;
  city: string;
  longitude: number;
  /** Vĩ độ nơi sinh (Việt Nam): biết nơi đó ở bờ bắc hay bờ nam vĩ tuyến 17 để tra giờ chuẩn lịch sử. */
  latitude?: number;
  gender: 'male' | 'female';
}

interface BirthFormProps {
  onSubmit: (info: BirthInfo) => void;
  loading?: boolean;
  initialData?: Partial<BirthFormState>;
  onFormSave?: (data: BirthFormState) => void;
  /** Ẩn nút "Lập lá số" bên trong (trang xem đôi tự có nút chung) */
  hideSubmit?: boolean;
}

/** 检查日期是否合法 */
function isValidDate(y: number, m: number, d: number): boolean {
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export default function BirthForm({ onSubmit, loading, initialData, onFormSave, hideSubmit }: BirthFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [form, setForm] = useState<BirthFormState>({
    name: initialData?.name ?? '',
    year: initialData?.year ?? '',
    month: initialData?.month ?? '',
    day: initialData?.day ?? '',
    clockHour: initialData?.clockHour ?? '8',
    clockMinute: initialData?.clockMinute ?? '0',
    unknownTime: initialData?.unknownTime ?? false,
    province: initialData?.province ?? '',
    city: initialData?.city ?? '',
    longitude: initialData?.longitude ?? 120,
    latitude: initialData?.latitude,
    gender: initialData?.gender ?? 'male',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // 表单状态变化时实时同步给父级（合盘等场景下父级靠这个收集双方数据）
  useEffect(() => {
    onFormSave?.({ ...form });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Cách chọn nơi sinh: tỉnh cũ, tỉnh mới hay Trung Quốc
  const [placeSystem, setPlaceSystem] = useState<PlaceSystem>(() => systemOf(initialData?.province));
  const systemInfo = PLACE_SYSTEMS.find(s => s.key === placeSystem)!;
  const provinceList = useMemo(() => provincesOf(placeSystem), [placeSystem]);

  // Quận/huyện, phường/xã tải khi chọn tỉnh
  const [cityList, setCityList] = useState<PlaceUnit[]>([]);
  const [unitsState, setUnitsState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [unitsReload, setUnitsReload] = useState(0);
  useEffect(() => {
    setCityList([]);
    if (!form.province) { setUnitsState('idle'); return; }
    let cancelled = false;
    setUnitsState('loading');
    loadUnits(form.province)
      .then(list => { if (!cancelled) { setCityList(list); setUnitsState('idle'); } })
      .catch(() => { if (!cancelled) setUnitsState('error'); });
    return () => { cancelled = true; };
  }, [form.province, unitsReload]);

  // Giờ chuẩn ở nơi sinh lúc sinh: Việt Nam đổi theo từng thời kỳ (miền Nam 1960–1975 là GMT+8).
  const utcOffset = formUtcOffsetMinutes(form);
  const branch = useMemo(() => {
    if (form.unknownTime) return 0;
    return calcTrueSolarBranch(
      parseInt(form.clockHour) || 0,
      parseInt(form.clockMinute) || 0,
      form.longitude,
      utcOffset,
    );
  }, [form.clockHour, form.clockMinute, form.longitude, form.unknownTime, utcOffset]);

  const offsetMin = Math.round((form.longitude - utcOffset / 4) * 4);
  const isVietnam = placeSystem !== 'cn' && !!findProvince(form.province);
  const shichenInfo = SHICHEN[branch];

  // ─── 校验逻辑 ───────────────────────────────────────────
  const y = parseInt(form.year) || 0;
  const m = parseInt(form.month) || 0;
  const d = parseInt(form.day) || 0;

  const errors = {
    year: !form.year ? 'Bạn chưa chọn năm sinh'
      : y < 1900 || y > 2026 ? 'Năm sinh phải từ 1900 đến 2026'
      : '',
    month: !form.month ? 'Bạn chưa chọn tháng sinh' : '',
    day: !form.day ? 'Bạn chưa chọn ngày sinh'
      : form.year && form.month && !isValidDate(y, m, d) ? `Tháng ${m} không có ngày ${d}, hãy chọn lại ngày`
      : '',
  };
  const hasError = Object.values(errors).some(Boolean);

  // ─── Mức hoàn thành (thanh tiến trình) ───────────────────
  const steps = [
    !!form.year && !!form.month && !!form.day && !errors.year && !errors.month && !errors.day,
    !!form.province && !!form.city,
    form.unknownTime || (!!form.clockHour && !!form.clockMinute),
    true, // 性别有默认值
  ];
  const completedSteps = steps.filter(Boolean).length;

  // ─── Dòng tóm tắt: hiện khi đã điền đủ ô bắt buộc ─────────
  const showSummary = steps[0] && steps[2] && !hasError;
  const provinceText = findProvince(form.province)?.label ?? '';
  const cityText = [form.city && cityList.find(c => c.value === form.city)?.label, provinceText].filter(Boolean).join(', ');
  const summaryText = showSummary
    ? [
        `${d}/${m}/${y}`,
        cityText,
        form.unknownTime ? 'không rõ giờ sinh' : viShichen(branch),
        form.gender === 'male' ? 'Nam' : 'Nữ',
      ].filter(Boolean).join(' · ')
    : '';

  const handleSystem = (sys: PlaceSystem) => {
    if (sys === placeSystem) return;
    setPlaceSystem(sys);
    setForm({ ...form, province: '', city: '', longitude: 120, latitude: undefined });
  };

  // Chọn tỉnh: tạm lấy toạ độ tâm tỉnh, chọn thêm quận/huyện hoặc xã thì chính xác hơn.
  const handleProvince = (prov: string) => {
    const p = findProvince(prov);
    setForm({ ...form, province: prov, city: '', longitude: p?.longitude ?? 120, latitude: p?.latitude });
  };

  const handleCity = (cityName: string) => {
    const unit = cityList.find(c => c.value === cityName);
    const p = findProvince(form.province);
    setForm({
      ...form, city: cityName,
      longitude: unit?.longitude ?? p?.longitude ?? 120,
      latitude: unit?.latitude ?? p?.latitude,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ year: true, month: true, day: true });
    if (hasError) return;
    onFormSave?.({ ...form });
    // Luôn đổi qua lib/ziwei/share.ts: hàm đó lo việc giờ Tý muộn (23:00–23:59) sang ngày hôm sau.
    // Tự ghép BirthInfo ở đây sẽ bỏ qua quy tắc đó, làm /chart và /heming lệch nhau một ngày.
    onSubmit(formToBirthInfo(form));
  };

  // ─── 样式变量 ────────────────────────────────────────────
  const bg = isDark ? 'rgba(8,16,40,0.85)' : 'rgba(255,255,255,0.92)';
  const border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(200,160,60,0.2)';
  // 暗色模式标签提亮：从 rgba(74,112,144,1) → rgba(180,200,225,0.9)
  const labelClr = isDark ? 'rgba(180,200,225,0.9)' : 'rgba(120,80,10,0.55)';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,252,240,0.8)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(200,160,60,0.25)';
  // 输入文字提亮：从 #c8d8f0 → #e8eef8
  const inputClr = isDark ? '#e8eef8' : '#2a1a00';
  const focusBorder = isDark ? 'rgba(212,168,67,0.5)' : 'rgba(180,120,20,0.5)';
  const errorClr = isDark ? '#f87171' : '#dc2626';
  const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,250,235,0.7)';
  const panelBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(200,160,60,0.2)';
  const goldText = isDark ? '#d4a843' : '#7a5008';
  const summaryBg = isDark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.07)';
  const summaryBorder = isDark ? 'rgba(37,99,235,0.35)' : 'rgba(37,99,235,0.25)';
  const summaryClr = isDark ? 'rgba(147,197,253,0.9)' : 'rgba(37,99,235,0.85)';

  const inputStyle = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: inputClr,
    borderRadius: '14px',
    padding: '10px 14px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  } as React.CSSProperties;

  const errorInputStyle = { ...inputStyle, borderColor: errorClr };

  function FieldError({ msg }: { msg: string }) {
    return (
      <AnimatePresence>
        {msg && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ color: errorClr, fontSize: '11px', marginTop: '4px' }}
          >
            ✕ {msg}
          </motion.p>
        )}
      </AnimatePresence>
    );
  }

  const showErr = (field: string) => touched[field] || submitAttempted;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: bg, border: `1px solid ${border}`, borderRadius: '24px', padding: '28px', backdropFilter: 'blur(20px)' }}
    >
      {/* Tiêu đề */}
      <h3 style={{ color: goldText, fontSize: '13px', letterSpacing: '0.12em', textAlign: 'center', marginBottom: '20px', fontWeight: 500 }}>
        ── Nhập ngày giờ sinh ──
      </h3>

      {/* ── 进度条 ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {steps.map((done, i) => (
          <motion.div
            key={i}
            animate={{ background: done ? (isDark ? '#d4a843' : '#b07820') : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,160,60,0.15)') }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, height: '2px', borderRadius: '2px' }}
          />
        ))}
      </div>

      {/* ── 姓名 ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Họ tên (không bắt buộc)</label>
        <input
          type="text"
          placeholder="Nhập họ tên"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = focusBorder; }}
          onBlur={e => { e.target.style.borderColor = inputBorder; }}
        />
      </div>

      {/* ── 出生日期 ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Ngày sinh (dương lịch)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <div>
            <select
              value={form.year}
              onChange={e => { setForm({ ...form, year: e.target.value }); setTouched(t => ({ ...t, year: true })); }}
              style={showErr('year') && errors.year ? errorInputStyle : inputStyle}
              required
            >
              <option value="">Năm</option>
              {Array.from({ length: 127 }, (_, i) => 2026 - i).map(yr => (
                <option key={yr} value={String(yr)}>{yr}</option>
              ))}
            </select>
            <FieldError msg={showErr('year') ? errors.year : ''} />
          </div>
          <div>
            <select
              value={form.month}
              onChange={e => { setForm({ ...form, month: e.target.value }); setTouched(t => ({ ...t, month: true })); }}
              style={showErr('month') && errors.month ? errorInputStyle : inputStyle}
              required
            >
              <option value="">Tháng</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(mo => (
                <option key={mo} value={String(mo)}>Tháng {mo}</option>
              ))}
            </select>
            <FieldError msg={showErr('month') ? errors.month : ''} />
          </div>
          <div>
            <select
              value={form.day}
              onChange={e => { setForm({ ...form, day: e.target.value }); setTouched(t => ({ ...t, day: true })); }}
              style={showErr('day') && errors.day ? errorInputStyle : inputStyle}
              required
            >
              <option value="">Ngày</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(dy => (
                <option key={dy} value={String(dy)}>Ngày {dy}</option>
              ))}
            </select>
            <FieldError msg={showErr('day') ? errors.day : ''} />
          </div>
        </div>
      </div>

      {/* ── Nơi sinh ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Nơi sinh (để tính giờ sinh chính xác hơn)</label>
        {/* Chọn cách tìm nơi sinh */}
        <div role="radiogroup" aria-label="Cách chọn nơi sinh" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '8px' }}>
          {PLACE_SYSTEMS.map(sys => {
            const active = sys.key === placeSystem;
            return (
              <button
                key={sys.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => handleSystem(sys.key)}
                style={{
                  padding: '8px 4px', borderRadius: '12px', fontSize: '12px', fontWeight: active ? 600 : 500, cursor: 'pointer',
                  border: `1px solid ${active ? focusBorder : inputBorder}`,
                  background: active ? (isDark ? 'rgba(212,168,67,0.14)' : 'rgba(200,140,30,0.10)') : inputBg,
                  color: active ? goldText : (isDark ? 'rgba(190,205,225,0.75)' : 'rgba(100,80,40,0.6)'),
                }}
              >
                {sys.label}
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: '10px', color: isDark ? 'rgba(165,185,210,0.7)' : 'rgba(140,100,20,0.5)', marginBottom: '8px' }}>{systemInfo.hint}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <select
            aria-label={systemInfo.provinceLabel}
            value={form.province}
            onChange={e => handleProvince(e.target.value)}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = focusBorder; }}
            onBlur={e => { e.target.style.borderColor = inputBorder; }}
          >
            <option value="">{systemInfo.provinceLabel}</option>
            {provinceList.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <select
            aria-label={systemInfo.unitLabel}
            value={form.city}
            onChange={e => handleCity(e.target.value)}
            disabled={!form.province || unitsState !== 'idle'}
            style={{ ...inputStyle, opacity: form.province && unitsState === 'idle' ? 1 : 0.45 }}
            onFocus={e => { e.target.style.borderColor = focusBorder; }}
            onBlur={e => { e.target.style.borderColor = inputBorder; }}
          >
            <option value="">
              {!form.province ? 'Chọn tỉnh trước' : unitsState === 'loading' ? 'Đang tải danh sách…' : `${systemInfo.unitLabel} (không bắt buộc)`}
            </option>
            {cityList.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        {unitsState === 'error' && (
          <p style={{ fontSize: '11px', color: errorClr, marginTop: '5px' }}>
            Chưa tải được danh sách {systemInfo.unitLabel.toLowerCase()}. Bạn vẫn lập lá số được theo tỉnh, hoặc{' '}
            <button type="button" onClick={() => setUnitsReload(n => n + 1)} style={{ textDecoration: 'underline', cursor: 'pointer', color: errorClr }}>tải lại</button>.
          </p>
        )}
        <AnimatePresence mode="wait">
          {form.province ? (
            <motion.p
              key="location-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: isDark ? 'rgba(180,210,235,0.85)' : 'rgba(100,70,10,0.5)', marginTop: '5px' }}
            >
              {cityText} · kinh độ {form.longitude.toFixed(2)}°Đ · giờ mặt trời {offsetMin > 0 ? 'nhanh' : 'chậm'} {Math.abs(offsetMin)} phút
              {isVietnam && utcOffset !== 420 ? ` · lúc đó đồng hồ chạy giờ ${formatUtcOffset(utcOffset)}` : ''}
            </motion.p>
          ) : (
            <motion.p
              key="location-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: isDark ? 'rgba(165,185,210,0.7)' : 'rgba(140,100,20,0.45)', marginTop: '5px' }}
            >
              * Nghê sư xem giờ theo mặt trời thật. Chọn nơi sinh để giờ sinh được chỉnh cho đúng.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Giờ sinh ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Giờ sinh (giờ đồng hồ ở nơi sinh)</label>
        <div style={{ borderRadius: '14px', padding: '12px', background: panelBg, border: `1px solid ${panelBorder}`, opacity: form.unknownTime ? 0.45 : 1, pointerEvents: form.unknownTime ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <select
              value={form.clockHour}
              onChange={e => setForm({ ...form, clockHour: e.target.value })}
              style={inputStyle}
            >
              {Array.from({ length: 24 }, (_, i) => i).map(h => (
                <option key={h} value={String(h)}>{h.toString().padStart(2, '0')} giờ</option>
              ))}
            </select>
            <select
              value={form.clockMinute}
              onChange={e => setForm({ ...form, clockMinute: e.target.value })}
              style={inputStyle}
            >
              {Array.from({ length: 60 }, (_, i) => i).map(min => (
                <option key={min} value={String(min)}>{min.toString().padStart(2, '0')} phút</option>
              ))}
            </select>
          </div>
          {/* Kết quả giờ mặt trời thật */}
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <span style={{ fontSize: '10px', color: isDark ? 'rgba(170,195,220,0.75)' : 'rgba(140,100,20,0.5)' }}>Giờ theo mặt trời → </span>
            <span style={{ fontSize: '15px', color: goldText, fontWeight: 600, letterSpacing: '0.08em' }}>
              {viShichen(branch)}
            </span>
            {shichenInfo && (
              <span style={{ fontSize: '10px', color: isDark ? 'rgba(170,195,220,0.75)' : 'rgba(140,100,20,0.5)', marginLeft: '4px' }}>
                ({shichenInfo.range.replace('-', '–')})
              </span>
            )}
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.unknownTime}
            onChange={e => setForm({ ...form, unknownTime: e.target.checked })}
            style={{ width: '14px', height: '14px', borderRadius: '4px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '10px', color: isDark ? 'rgba(165,185,210,0.7)' : 'rgba(140,100,20,0.45)' }}>
            Không biết giờ sinh (lập lá số theo giờ Tý, 23:00–01:00)
          </span>
        </label>
      </div>

      {/* ── Giới tính ── */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Giới tính</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['male', 'female'] as const).map(g => {
            const active = form.gender === g;
            const isMale = g === 'male';
            const accent = isMale ? '37,99,235' : '225,29,72';
            return (
              <motion.button
                key={g}
                type="button"
                onClick={() => setForm({ ...form, gender: g })}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: `1px solid ${active ? `rgba(${accent},0.6)` : inputBorder}`,
                  background: active ? `rgba(${accent},0.08)` : inputBg,
                  color: active ? `rgba(${accent},0.9)` : (isDark ? 'rgba(190,205,225,0.7)' : 'rgba(100,80,40,0.4)'),
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                {isMale ? '♂ Nam' : '♀ Nữ'}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Dòng xác nhận thông tin ── */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div style={{
              background: summaryBg,
              border: `1px solid ${summaryBorder}`,
              borderRadius: '12px',
              padding: '9px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '12px', color: summaryClr }}>✓</span>
              <span style={{ fontSize: '11px', color: summaryClr, letterSpacing: '0.03em', flex: 1 }}>
                {summaryText}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nút lập lá số ── */}
      {!hideSubmit && <motion.button
        type="submit"
        disabled={loading}
        whileHover={loading ? {} : { scale: 1.01 }}
        whileTap={loading ? {} : { scale: 0.98 }}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '16px',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: loading
            ? (isDark ? 'rgba(212,168,67,0.15)' : 'rgba(180,120,20,0.15)')
            : (isDark
              ? 'linear-gradient(135deg, rgba(180,130,40,0.9), rgba(240,200,80,0.9))'
              : 'linear-gradient(135deg, #9a6210, #c88020)'),
          color: loading ? (isDark ? 'rgba(212,168,67,0.4)' : 'rgba(120,80,10,0.4)') : (isDark ? '#08080a' : '#fff8e8'),
          boxShadow: loading ? 'none' : (isDark ? '0 4px 20px rgba(212,168,67,0.2)' : '0 4px 16px rgba(140,100,20,0.25)'),
          transition: 'all 0.2s',
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
            Đang lập lá số…
          </span>
        ) : 'Lập lá số'}
      </motion.button>}
    </motion.form>
  );
}
