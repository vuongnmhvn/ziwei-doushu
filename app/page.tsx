'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import AnnouncementModal from '@/components/AnnouncementModal';

const SHOW_ANNOUNCEMENT = false;
import { vi } from '@/lib/i18n/vi';

// ─── 滚动入场 wrapper ────────────────────────────────────
function FadeIn({
  children, delay = 0, y = 28, className = '',
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WeakBoundary({ line }: { line: string }) {
  // 之前的版本有 1px 实线 + 12px 渐变阴影，主题切换时形成清晰横线很硬。
  // 改为更柔和的 24px 渐变 + 低 opacity，section 衔接更自然。
  return (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
      style={{ background: `linear-gradient(to bottom, ${line}, transparent)`, opacity: 0.45 }} />
  );
}

// ─── 主题切换按钮 ────────────────────────────────────────
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label={isDark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div className="relative w-10 h-5 rounded-full flex-shrink-0"
        style={{
          background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)',
          transition: 'background 0.35s ease',
        }}>
        <motion.div
          animate={{ x: isDark ? 2 : 22 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-1 w-3.5 h-3.5 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      <span className="text-[11px] font-medium tracking-wide select-none"
        style={{
          color: isDark ? 'rgba(212,180,100,0.85)' : 'rgba(110,72,8,0.8)',
          transition: 'color 0.35s ease',
        }}>
        {isDark ? 'Tối' : 'Sáng'}
      </span>
    </motion.button>
  );
}

// ─── 主星数据 ────────────────────────────────────────────
const STARS = [
  { name: '紫微' }, { name: '天机' }, { name: '太阳' }, { name: '武曲' },
  { name: '天同' }, { name: '廉贞' }, { name: '天府' }, { name: '太阴' },
  { name: '贪狼' }, { name: '巨门' }, { name: '天相' }, { name: '天梁' },
  { name: '七杀' }, { name: '破军' },
];

// ─── 功能模块 ────────────────────────────────────────────
const FEATURES = [
  {
    tag: 'Cách lập lá số',
    title: 'Tử Vi Đẩu Số\nchính tông Nghê Hải Hạ',
    subtitle: 'Không phải bản rút gọn, làm đúng theo lời thầy Nghê Hải Hạ truyền dạy',
    points: [
      'Khởi lá số theo cục Ngũ hành nạp âm, không dùng cách tính rút gọn trên mạng',
      'Cung Mệnh đếm ngược theo giờ sinh, cung Thân đếm xuôi theo giờ sinh, đúng như bài giảng',
      '14 chính tinh và Tứ Hoá được an theo phép gốc, đầy đủ và kiểm lại được',
    ],
  },
  {
    tag: 'Cách hiện lá số',
    title: 'Đủ 14 chính tinh\nvà Tứ Hoá',
    subtitle: 'Rõ ràng, nhìn một lần là thấy trục chính và điểm quan trọng',
    points: [
      'Đủ 14 chính tinh nằm đúng cung, dễ đọc quan hệ giữa các sao',
      'Phụ tinh và sát tinh hiện cùng một màn, không sót thông tin quan trọng',
      'Độ sáng Miếu, Vượng, Lợi, Hãm được chia bậc, nhìn nhanh biết sao mạnh hay yếu',
      'Bấm vào một chính tinh bất kỳ để đọc lời giải chi tiết của thầy Nghê Hải Hạ về sao đó',
    ],
  },
  {
    tag: 'AI giải thích',
    title: 'Giải lá số thật kỹ\nkhông chỉ tính toán',
    subtitle: 'Kho kiến thức theo Nghê Hải Hạ × Claude AI',
    points: [
      'Xem mệnh cách: bắt đầu từ chính tinh cung Mệnh, kết hợp tam phương tứ chính, nói rõ tính cách và cách cục cuộc đời',
      'Giải theo 6 mặt: sự nghiệp, tình cảm và hôn nhân, tiền bạc, sức khoẻ, gia đình, con cái',
      'Theo dõi đại hạn và lưu niên: điểm chính của đại hạn 10 năm hiện tại, lời nhắc và việc nên làm theo cung lưu niên năm nay',
      'Hỏi thêm thoải mái: hỏi thẳng về lá số của bạn, như “Năm nay có nên đổi việc không?”, “Khi nào là lúc tốt nhất để cưới?”',
    ],
  },
  {
    tag: 'Tìm cách cục',
    title: 'Tự tìm cách cục\ntrong lá số',
    subtitle: 'Nhìn cách các sao kết hợp để thấy điều đã định sẵn trong mệnh bạn',
    points: [
      'Tự nhận ra 11 cách cục kinh điển: Tử Phủ đồng cung, Sát Phá Lang, Cơ Nguyệt Đồng Lương, Liêm Tướng, Vũ Khúc Thất Sát…',
      'Nhận đúng các cách đặc biệt như Phụ Bật giáp Mệnh, Nhật Nguyệt giáp Mệnh, kèm lời giải chuẩn theo hệ thống Nghê Hải Hạ',
      'Tự đánh dấu khi Tứ Hoá vào cung Mệnh hoặc cung Thiên Di, nhắc những bài học cuộc đời cần để ý',
      'Cách cục được xếp theo mức tốt xấu, nhìn là thấy ngay điểm mạnh và thử thách trong lá số của bạn',
    ],
  },
];

// ─── 4 大学习板块（hero 后时间轴）──────────────────────────
const SECTIONS = [
  {
    key: 'ziwei',
    name: 'Tử Vi',
    en: 'Zi Wei',
    desc: '14 chính tinh · 13 cung · AI giải thích',
    status: 'ready' as const,
    when: 'Tháng 5',
    icon: '◉',  // 实心圆+内点，紫微星视觉
    note: '',
  },
  {
    key: 'tianji',
    name: 'Thiên Kỷ',
    en: 'Tian Ji',
    desc: 'Tử Vi · Chu Dịch · Kỳ Môn Độn Giáp',
    status: 'soon' as const,
    when: 'Tháng 6',
    icon: '⊙',  // 圆+内点（古文"日"），与 ◉ 同字宽
    note: '',
  },
  {
    key: 'diji',
    name: 'Địa Kỷ',
    en: 'Di Ji',
    desc: 'Phần Nghê sư còn dang dở · Người sau chú giải thêm',
    status: 'soon' as const,
    when: 'Tháng 6',
    icon: '⊞',  // 方+井（地/田视觉），与 ⊙ 同字宽
    note: 'Đọc bản thảo để lại',
  },
  {
    key: 'renji',
    name: 'Nhân Kỷ',
    en: 'Ren Ji',
    desc: 'Nội Kinh · Thương Hàn · Kim Quỹ · Châm cứu',
    status: 'soon' as const,
    when: 'Tháng 7',
    icon: '⊕',  // 圆+十字（医道/阴阳调和），与 ⊙/⊞ 同字宽
    note: '',
  },
];

// ─── 倪海厦核心教义 ──────────────────────────────────────
const NI_TEACHINGS = [
  {
    title: 'Cung Mệnh là gốc, tam phương là dụng',
    body: 'Nghê sư luôn nhấn mạnh: xem mệnh trước hết phải xem cung Mệnh. Chính tinh cung Mệnh quyết định cách cục cơ bản và tính cách bẩm sinh của một người; tam phương (Tài Bạch, Quan Lộc, Thiên Di) quyết định “đất dụng võ” của người đó. Bốn cung phối hợp với nhau mới là bức tranh cuộc đời đầy đủ.',
  },
  {
    title: 'Mượn sao cung đối, chớ bỏ qua',
    body: 'Điểm riêng của Nghê sư là coi trọng “cung đối”. Cung nào không có chính tinh thì phải mượn sao ở cung đối diện để luận. Đối diện cung Mệnh là cung Thiên Di, hai cung ảnh hưởng lẫn nhau; đây là chỗ quan trọng mà nhiều người mới học dễ bỏ qua.',
  },
  {
    title: 'Tứ Hoá mới là bàn tay của số mệnh',
    body: 'Sao chỉ là nền; Tứ Hoá (Hoá Lộc, Hoá Quyền, Hoá Khoa, Hoá Kỵ) mới là chìa khoá quyết định vận tốt hay xấu. Cùng một sao, gặp Hoá Lộc hay gặp Hoá Kỵ thì đường đời có thể khác hẳn nhau. Nghê sư nhắc đi nhắc lại: không xem Tứ Hoá thì mới giải được một nửa lá số.',
  },
  {
    title: 'Đại hạn mười năm, vận có nhịp',
    body: 'Nghê sư chia đời người thành 12 đại hạn, mỗi đại hạn 10 năm. Ông cho rằng khi đi qua những cung đại hạn khác nhau, cảnh ngộ của mỗi người cũng hoàn toàn khác. Biết mình đang đi đại hạn nào và cung đó có những sao gì thì mới thật sự nắm được vận hiện tại.',
  },
];

// ─── 主题色彩 helper ─────────────────────────────────────
function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    bgBase:       d ? '#020810'                                : '#f5efe0',
    // nav 用与 bgBase 完全相同的不透明色，避免半透明叠加产生色差带
    navBg:        d ? '#020810'                                : '#f5efe0',
    navBorder:    d ? 'rgba(255,255,255,0.05)'                : 'rgba(160,120,30,0.15)',
    goldGrad:     d ? 'linear-gradient(160deg,#c8993a 0%,#f0d070 40%,#c8993a 70%,#f0c755 100%)'
                    : 'linear-gradient(160deg,#6a4206 0%,#9a6a10 40%,#6a4206 70%,#885010 100%)',
    goldSolid:    d ? '#d4a843'                               : '#8b6410',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(140,100,20,0.4)',
    tagText:      d ? 'rgba(212,168,67,0.6)'                  : 'rgba(120,80,10,0.65)',
    // 亮色文字用冷灰系（A 方案核心）：暖底 + 冷字 → 视觉不审美疲劳
    textPrimary:  d ? '#e8eef6'                               : '#1a1d24',
    textSecond:   d ? '#b8c6df'                               : '#3a3f4a',
    textMuted:    d ? '#9db0d0'                               : '#5a6275',
    textFaint:    d ? 'rgba(240,246,255,0.56)'                : '#9da4b3',
    // 冷色 accent（B 方案核心）：呼应暗色 quan 蓝；用于装饰性 glow / 链接 / 高亮
    accent:       d ? '#3a78d4'                               : '#3a5a82',
    accentSoft:   d ? 'rgba(58,120,212,0.18)'                 : 'rgba(58,90,130,0.10)',
    cardBg:       d ? 'rgba(255,255,255,0.05)'                : 'rgba(255,255,255,0.88)',
    cardBorder:   d ? 'rgba(255,255,255,0.10)'                : 'rgba(200,160,60,0.25)',
    cardShadow:   d ? '0 4px 32px rgba(0,0,0,0.5)'           : '0 4px 24px rgba(140,100,20,0.12)',
    featureBg:    d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.75)',
    featureBord:  d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    glowTint:     d ? 'rgba(212,168,67,0.07)'                 : 'rgba(180,140,40,0.06)',
    // 亮色 glow 真用蓝/紫——给整体氛围加冷色点缀
    glowBlue:     d ? 'rgba(40,80,160,0.12)'                  : 'rgba(58,90,130,0.06)',
    glowPurple:   d ? 'rgba(120,50,180,0.08)'                 : 'rgba(96,80,140,0.04)',
    niBg:         d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.8)',
    niBorder:     d ? 'rgba(212,168,67,0.2)'                  : 'rgba(180,130,40,0.25)',
    niDivider:    d ? 'rgba(255,255,255,0.08)'                : 'rgba(180,130,40,0.12)',
    niCardBg:     d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.9)',
    niCardBord:   d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    niCardShadow: d ? '0 2px 20px rgba(0,0,0,0.4)'           : '0 2px 16px rgba(140,100,20,0.1)',
    starBg:       d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.7)',
    starBorder:   d ? 'rgba(212,168,67,0.22)'                 : 'rgba(160,120,30,0.3)',
    starText:     d ? 'rgba(212,168,67,0.7)'                  : 'rgba(120,80,10,0.7)',
    ctaBg:        d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
                    : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText:      d ? '#08080a'                               : '#f8f3e8',
    footerText:   d ? 'rgba(255,255,255,0.08)'                : '#d0b878',
    scrollLine:   d ? 'rgba(212,168,67,0.3)'                  : 'rgba(140,100,20,0.3)',
    scrollText:   d ? 'rgba(255,255,255,0.12)'                : '#c0a870',
    altSection:   d ? 'rgba(255,255,255,0.02)'                : 'rgba(255,255,255,0.4)',
    quoteBg:      d ? 'rgba(212,168,67,0.04)'                 : 'rgba(255,255,255,0.9)',
  };
}

// ─── 四化简介数据 ─────────────────────────────────────────
const SIHUA_BRIEF: Record<string, { attr: string; brief: string }> = {
  '化禄': { attr: 'Hoá tốt · Thêm lợi', brief: 'Sao phúc đến cung, chủ tiền bạc và phúc khí tăng thêm. Việc ở cung này thuận lợi, năng lực mạnh lên; đây là sao hoá được ưa nhất trong lá số.' },
  '化权': { attr: 'Hoá tốt · Quyền uy', brief: 'Sao quyền lực đến cung, chủ sự nắm giữ và khả năng lãnh đạo. Cung này mạnh mẽ, quyết đoán; ưa vào cung Quan Lộc và cung Mệnh, chủ có thực quyền trong sự nghiệp.' },
  '化科': { attr: 'Hoá tốt · Danh tiếng', brief: 'Sao khoa danh đến cung, chủ tiếng tốt và duyên gặp quý nhân. Cung này chủ danh tiếng học vấn và vận thi cử, có quý nhân giúp đỡ; hợp việc học thuật, thi cử và nơi đông người.' },
  '化忌': { attr: 'Hoá xấu · Trở ngại', brief: 'Sao kiếp số đến cung, chủ chấp niệm và trở ngại. Cung này cần đặc biệt để ý; bài học cuộc đời của cung này sẽ là thử thách quan trọng.' },
};

// ─── 主星简介数据 ─────────────────────────────────────────
const STAR_BRIEF: Record<string, { attr: string; brief: string }> = {
  '紫微': { attr: 'Thổ · Sao đế vương', brief: 'Sao quý của trời, đứng đầu các sao. Người có sao này ở Mệnh mang khí chất cao ngạo, chủ quyền uy và hiển đạt, sinh ra đã có tố chất lãnh đạo, hợp vị trí tự mình gánh vác một mảng việc.' },
  '天机': { attr: 'Mộc · Sao trí tuệ', brief: 'Sao ích thọ, chủ mưu trí và biến động. Thông minh lanh lợi, giỏi tính toán, suy nghĩ tinh tế; hợp việc lên kế hoạch, tư vấn, kỹ thuật.' },
  '太阳': { attr: 'Hoả · Chủ quan lộc', brief: 'Sao chủ quan lộc, chủ danh tiếng và uy tín. Rộng rãi, hào phóng, coi trọng hình ảnh trước mọi người; lợi cho quan trường và việc công. Mệnh nam thì sao này mạnh hơn; khi ở Miếu thì quang minh lỗi lạc.' },
  '武曲': { attr: 'Kim · Chủ tài bạch', brief: 'Sao chủ tài bạch, chủ tiền bạc và sự quyết đoán. Ý chí vững, hành động dứt khoát; hợp nghề tài chính, ngân hàng, quân đội, công an. Là sao cô khắc, lợi cho việc kết hôn muộn.' },
  '天同': { attr: 'Thuỷ · Sao phúc', brief: 'Sao chủ phúc đức, chủ hưởng thụ và nhân duyên. Tính ôn hoà, rất được lòng người, coi trọng chất lượng cuộc sống, tình cảm tinh tế; về già vận tốt.' },
  '廉贞': { attr: 'Hoả · Sao tài nghệ', brief: 'Sao đào hoa thứ, chủ tài nghệ và ham muốn tình cảm. Tài năng nổi bật, tình cảm phong phú; hợp nghệ thuật, chính trường. Đa tài đa nghệ nhưng cần đề phòng thị phi chuyện tình cảm.' },
  '天府': { attr: 'Thổ · Sao kho tiền', brief: 'Sao chủ của Nam Đẩu, chủ kho tiền và tích luỹ. Điềm đạm, thận trọng, giỏi quản lý tiền; là sức mạnh giữ ổn định cho lá số, hợp việc quản lý tài chính và hành chính.' },
  '太阴': { attr: 'Thuỷ · Chủ điền trạch', brief: 'Sao chủ điền trạch, chủ của cải và sự mềm mại. Tinh tế dịu dàng, cảm nhận tốt, mệnh nữ càng đẹp; lợi cho nhà đất và tích luỹ, hợp văn nghệ hoặc ngành dịch vụ.' },
  '贪狼': { attr: 'Mộc Thuỷ · Đào hoa', brief: 'Sao đào hoa, chủ ham muốn và tài nghệ. Đa tài đa nghệ, ham muốn mạnh, giao tiếp năng động; hợp nghệ thuật, quan hệ công chúng, kinh doanh; rất được lòng người.' },
  '巨门': { attr: 'Thuỷ · Sao thị phi', brief: 'Ám tinh, chủ tài ăn nói và thị phi. Ăn nói giỏi, lý luận sắc bén; hợp nghề luật sư, giáo dục, truyền thông. Cần để ý chuyện cãi vã thị phi; lập thân bằng tài biện luận.' },
  '天相': { attr: 'Thuỷ · Sao ấn', brief: 'Ấn tinh, chủ phò tá và ấn tín. Giỏi điều hoà, trọng lễ nghĩa, ngay thẳng giữ luật; hợp làm tham mưu, hành chính, pháp luật; vận quý nhân tốt.' },
  '天梁': { attr: 'Thổ · Sao che chở', brief: 'Ấm tinh, chủ sự chín chắn và che chở. Ngay thẳng điềm đạm, giàu lòng từ bi, được trời phù hộ; hợp ngành y tế, công tác xã hội, tôn giáo.' },
  '七杀': { attr: 'Kim Hoả · Sao tướng', brief: 'Tướng tinh, chủ cương liệt và khai phá. Tính cứng rắn, hành động mạnh, dám đương đầu thử thách; hợp khởi nghiệp, quân đội, công an, ngành có nhiều cạnh tranh; gặp dữ hoá lành.' },
  '破军': { attr: 'Thuỷ · Sao hao', brief: 'Hao tinh, chủ biến động và mở đường. Dám phá lối cũ, không sợ thay đổi; cả đời nhiều biến động nhưng có khí phách; hợp việc mở đường, đi con đường người khác chưa đi.' },
};

// ─── 功能视觉装饰 ────────────────────────────────────────
function FeatureVisual({ index, colors: c }: { index: number; colors: ReturnType<typeof useColors> }) {
  if (index === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="grid grid-cols-4 gap-1.5 w-72 mx-auto">
          {Array.from({ length: 16 }).map((_, i) => {
            const isCenter = [5, 6, 9, 10].includes(i);
            const isActive = [0, 3, 12, 15].includes(i);
            return (
              <motion.div key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="h-14 rounded-sm flex items-center justify-center text-xs transition-all duration-300"
                style={{
                  border: `1px solid ${isActive ? c.goldLine : c.cardBorder}`,
                  background: isCenter ? 'transparent' : isActive ? c.starBg : c.featureBg,
                  color: isActive ? c.goldSolid : c.textFaint,
                  opacity: isCenter ? 0 : 1,
                }}>
                {isActive ? '★' : ''}
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] tracking-widest transition-colors duration-300"
          style={{ color: c.textFaint }}>Cách lập lá số của Nghê Hải Hạ</p>
      </div>
    );
  }

  if (index === 1) {
    const [sel, setSel] = useState<string | null>(null);
    const selInfo = sel ? (STAR_BRIEF[sel] ?? SIHUA_BRIEF[sel] ?? null) : null;
    return (
      <div className="flex flex-col gap-4 h-full justify-center">
        {[
          { group: 'Nhóm Tử Vi', stars: ['紫微', '天机', '太阳', '武曲', '天同', '廉贞'] },
          { group: 'Nhóm Thiên Phủ', stars: ['天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'] },
        ].map(group => (
          <div key={group.group}>
            <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
              style={{ color: c.textFaint }}>{group.group}</div>
            <div className="flex flex-wrap gap-1.5">
              {group.stars.map(s => (
                <motion.button key={s}
                  onClick={() => setSel(sel === s ? null : s)}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="text-xs px-2 py-1 rounded-md cursor-pointer"
                  style={{
                    border: `1px solid ${sel === s ? c.goldSolid : c.goldLine}`,
                    color: c.goldSolid,
                    background: sel === s ? `${c.goldLine}30` : 'transparent',
                    fontWeight: sel === s ? 600 : 400,
                  }}>
                  {vi(s)}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
            style={{ color: c.textFaint }}>Tứ Hoá</div>
          <div className="flex gap-2 flex-wrap">
            {[['化禄', 'rgba(52,211,153,0.7)'], ['化权', 'rgba(96,165,250,0.7)'], ['化科', 'rgba(250,204,21,0.7)'], ['化忌', 'rgba(248,113,113,0.7)']].map(([label, color]) => (
              <motion.button key={label}
                onClick={() => setSel(sel === label ? null : label)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="text-xs px-2.5 py-1 rounded-md cursor-pointer"
                style={{
                  border: `1px solid ${color}`,
                  color,
                  background: sel === label ? `${color.replace('0.7', '0.15')}` : 'transparent',
                  fontWeight: sel === label ? 600 : 400,
                }}>
                {vi(label)}
              </motion.button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {selInfo && (
            <motion.div key={sel}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-4 mt-1.5"
              style={{ border: `1px solid ${c.goldLine}`, background: c.featureBg }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold" style={{ color: c.goldSolid }}>{vi(sel)}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: c.tagText, border: `1px solid ${c.goldLine}` }}>{selInfo.attr}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>{selInfo.brief}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (index === 2) {
    const msgs = [
      { role: 'user', text: 'Năm nay đường sự nghiệp của tôi thế nào?' },
      { role: 'ai', text: 'Cung Mệnh có Thiên Cơ Hoá Lộc, đại hạn hiện tại đi qua cung Quan Lộc, tam phương có Tả Phụ giúp sức, sự nghiệp có quý nhân nâng đỡ, nên chủ động mở rộng…' },
      { role: 'user', text: 'Khi nào đường tình cảm của tôi tốt nhất?' },
    ];
    return (
      <div className="flex flex-col gap-2 h-full justify-center">
        {msgs.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] text-[11px] px-3 py-2 rounded-lg leading-relaxed"
              style={{
                border: `1px solid ${m.role === 'user' ? c.goldLine : c.cardBorder}`,
                background: m.role === 'user' ? c.starBg : c.featureBg,
                color: m.role === 'user' ? c.goldSolid : c.textSecond,
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (index === 3) {
    const patterns = [
      { name: 'Cách Sát Phá Lang', desc: 'Mệnh khai phá, tiến thủ', ok: true },
      { name: 'Cách Liêm Tướng', desc: 'Hợp việc hành chính, giữ ấn tín', ok: true },
      { name: 'Hoá Kỵ vào Mệnh', desc: 'Cần để ý chuyện tâm lý', ok: false },
    ];
    return (
      <div className="flex flex-col gap-3 h-full justify-center">
        {patterns.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
              border: `1px solid ${p.ok ? 'rgba(96,165,250,0.25)' : 'rgba(251,146,60,0.25)'}`,
              background: p.ok ? 'rgba(96,165,250,0.05)' : 'rgba(251,146,60,0.05)',
            }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: p.ok ? 'rgba(96,165,250,0.6)' : 'rgba(251,146,60,0.6)' }} />
            <div>
              <div className="text-[11px] font-medium"
                style={{ color: p.ok ? 'rgba(147,197,253,0.8)' : 'rgba(253,186,116,0.8)' }}>{p.name}</div>
              <div className="text-[10px]" style={{ color: c.textMuted }}>{p.desc}</div>
            </div>
          </motion.div>
        ))}
        <div className="text-[9px] mt-2 tracking-wider text-center" style={{ color: c.textFaint }}>
          Tự nhận ra 11 cách cục kinh điển
        </div>
      </div>
    );
  }

  return null;
}

// ─── 主页 ─────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // 把 body / html 背景同步到 home 主题色，消除半透明 nav 透出 #fafaf9 的色差
  // useLayoutEffect 保证在浏览器绘制前同步更新，避免与根 div 的 transition 不同步
  useLayoutEffect(() => {
    document.documentElement.style.background = c.bgBase;
    document.body.style.background = c.bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [c.bgBase]);

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">
      {/* 致用户公告——首次访问全屏覆盖，关闭后才进入首页 */}
      {/* Lá thư khuyến mãi của trang gốc (tháng 5) đã hết hạn nên tạm tắt; bật lại khi có thông báo mới. */}
      {SHOW_ANNOUNCEMENT && <AnnouncementModal />}

      <StarField />

      {/* 全局光晕 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowBlue} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowPurple} 0%, transparent 70%)` }} />
      </div>

      {/* ── 顶部导航 ── nav 与 hero 同色（c.bgBase），无 blur 无 border，彻底无色差带 */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-2"
        style={{
          background: c.navBg,
        }}>
        <div className="text-[11px] sm:text-xs tracking-[0.08em] sm:tracking-[0.15em] font-medium transition-colors duration-300 flex-shrink-0 whitespace-nowrap"
          style={{ color: c.goldSolid }}>
          Lá số Tử Vi
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/heming')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
            style={{ border: `1px solid ${c.navBorder}`, color: c.textMuted }}>
            Xem đôi
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
            style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}>
            Lập lá số
          </motion.button>
        </div>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[82svh] lg:min-h-[92vh] flex flex-col items-center justify-center px-6 z-10 pb-24 pt-10">
        <motion.div style={{ y: heroY, opacity: heroOpacity, maxWidth: '960px' }} className="text-center w-full mx-auto mt-10">
          {/* 标签行 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[11px] tracking-[0.2em] transition-colors duration-300" style={{ color: c.tagText }}>
              Tử Vi Đẩu Số · Hệ thống Nghê Hải Hạ
            </span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </motion.div>

          {/* 主标题 */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'relative', display: 'inline-block' }}>
            <h1
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-[1.2] mb-5`}
              style={{
                fontSize: 'clamp(42px, 9vw, 112px)',
                letterSpacing: '0.02em',
              }}>
              Lá số Tử Vi
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-base md:text-lg tracking-[0.04em] mb-2"
            style={{ color: c.textSecond, fontWeight: 500 }}>
            Tử Vi là cửa · Thiên Địa Nhân là đường · Nghê Hải Hạ là thầy
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-xs md:text-sm tracking-[0.1em] mb-6"
            style={{ color: c.textMuted, opacity: 0.85 }}>
            AI giải đáp · Biết đi đôi với làm
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-sm max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: c.textMuted }}>
            Nhập ngày giờ sinh để lập lá số Tử Vi của riêng bạn. Các phần học Thiên Kỷ, Địa Kỷ, Nhân Kỷ sẽ lần lượt mở sau.
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ y: -2, filter: 'brightness(1.06)' }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/chart')}
              className="px-12 py-4 font-semibold text-base tracking-wide rounded-full"
              style={{ background: c.ctaBg, color: c.ctaText }}>
              Lập lá số ngay
            </motion.button>
          </motion.div>

          {/* 十四主星 */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-1.5 max-w-[640px] mx-auto">
            {STARS.map((star, i) => (
              <motion.div key={star.name}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.05 + i * 0.03, duration: 0.35 }}
                className="flex items-center justify-center px-2 py-1 rounded-full"
                style={{ background: c.starBg, border: `1px solid ${c.starBorder}` }}>
                <span className="text-[11px] tracking-wide whitespace-nowrap" style={{ color: c.starText }}>{vi(star.name)}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hai mẩu giấy khuyến mãi tháng 5 của trang gốc: tắt cùng lá thư thông báo. */}
        {SHOW_ANNOUNCEMENT && (<>
        {/* 上线公告便利贴 — 桌面端绝对定位右侧 */}
        <motion.div
          initial={{ opacity: 0, x: 30, rotate: 0 }}
          animate={{ opacity: 1, x: 0, rotate: -4 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute hidden lg:block pointer-events-none"
          style={{
            right: 'clamp(2%, 6vw, 8%)',
            top: '54%',
            maxWidth: '240px',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
            border: '2px dashed rgba(232,132,62,0.45)',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: '0 8px 24px rgba(196,90,45,0.18), 0 2px 6px rgba(196,90,45,0.1)',
            fontFamily: 'var(--font)',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '6px', lineHeight: 1 }}>🎁</div>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              <span style={{ color: '#c45a2d', fontWeight: 700, fontSize: '14px' }}>1/5 — 8/5</span>
              <span> quà tri ân có hạn</span>
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              Mọi tính năng và hỏi AI
              <strong style={{ color: '#c45a2d' }}> đều miễn phí</strong>
            </div>
          </div>
        </motion.div>

        {/* 上线公告便利贴 — 手机端正常流式显示（hero 内容下方居中） */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:hidden mx-auto mt-8 mb-2 pointer-events-none"
          style={{
            maxWidth: 'min(280px, 84vw)',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
            border: '2px dashed rgba(232,132,62,0.45)',
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 6px 18px rgba(196,90,45,0.16), 0 2px 4px rgba(196,90,45,0.08)',
            fontFamily: 'var(--font)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '18px', marginBottom: '4px', lineHeight: 1 }}>🎁</div>
            <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              <span style={{ color: '#c45a2d', fontWeight: 700, fontSize: '13px' }}>1/5 — 8/5</span>
              <span> quà tri ân có hạn</span>
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              Mọi tính năng và hỏi AI <strong style={{ color: '#c45a2d' }}>đều miễn phí</strong>
            </div>
          </div>
        </motion.div>
        </>)}

        {/* 滚动提示（绝对定位，不影响 hero opacity 计算） */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: c.scrollText }}>Kéo xuống xem thêm</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${c.scrollLine}, transparent)` }} />
        </motion.div>
      </section>

      {/* ══ 哲学引言 ══════════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden min-h-[82svh] lg:min-h-[92vh] flex items-center" style={{ padding: '72px 24px' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="absolute inset-0"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, #020810 0%, #020810 6%, #030a18 22%, #0d0820 40%, #0a0618 68%, #030a18 86%, #020810 100%)'
              : 'linear-gradient(to bottom, #f5efe0 0%, #f5efe0 6%, #c08055 18%, #6a2810 32%, #1e0a02 50%, #1e0a02 70%, #6a2810 84%, #f5efe0 100%)',
            transition: 'background 0.4s ease',
          }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span aria-hidden="true" className="font-bold" style={{ fontSize: 'clamp(220px, 38vw, 460px)', color: 'rgba(212,168,67,0.012)', lineHeight: 1, fontFamily: 'serif' }}>命</span>
        </div>
        <FadeIn className="relative mx-auto text-center w-full" y={20}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.45))' }} />
            <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: 'rgba(212,168,67,0.5)' }}>Cách nhìn về số mệnh</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.45))' }} />
          </div>
          <div className="space-y-3" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {[
              { text: 'Ý nghĩa của việc nhìn trước số mệnh', size: 'clamp(17px, 2.2vw, 28px)', color: 'rgba(215,228,252,0.72)', delay: 0.1 },
              { text: 'không nằm ở chỗ đoán trước tương lai', size: 'clamp(21px, 2.6vw, 32px)', color: 'rgba(220,232,250,0.74)', delay: 0.25 },
              { text: 'mà ở chỗ ngày càng hiểu rõ chính mình', size: 'clamp(24px, 3vw, 40px)', color: 'rgba(218,230,248,0.8)', delay: 0.34 },
            ].map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: line.delay }}
                className="tracking-wide" style={{ fontSize: line.size, color: line.color, fontWeight: 400 }}>
                {line.text}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold`}
              style={{ fontSize: 'clamp(24px, 3.4vw, 48px)', letterSpacing: '0.02em', lineHeight: 1.35 }}>
              để rồi tự viết nên câu chuyện đời mình
            </motion.p>
          </div>
        </FadeIn>
      </section>

      {/* ══ 4 大学习板块时间轴 ════════════════════════════ */}
      <section className="relative z-10 py-20 lg:py-24 px-6"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.03) 50%, transparent 100%)'
            : 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.04) 50%, transparent 100%)',
        }}>
        <FadeIn className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid, opacity: 0.7 }}>Curriculum</span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </div>
          <div className="text-2xl lg:text-3xl font-bold mb-2 tracking-[0.03em]" style={{ color: c.textPrimary }}>
            Phương pháp của Nghê sư · Mở dần từng phần
          </div>
          <div className="text-xs lg:text-sm tracking-[0.03em]" style={{ color: c.textMuted }}>
            Bắt đầu từ Tử Vi, rồi lần lượt mở các phần học Thiên Kỷ / Địa Kỷ / Nhân Kỷ
          </div>
        </FadeIn>

        <div className="max-w-sm lg:max-w-5xl mx-auto relative">
          {/* 横向连接线（仅桌面）*/}
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5"
            style={{
              background: `linear-gradient(90deg, ${c.goldSolid} 0%, ${c.goldSolid} 25%, ${c.goldLine} 25%)`,
              opacity: 0.6,
            }} />

          {/* 纵向连接线（仅手机）—— 圆点贴在线上，做"地铁线路图"风格 */}
          <div className="lg:hidden absolute left-7 top-7 bottom-7 w-px -translate-x-1/2"
            style={{
              background: `linear-gradient(180deg, ${c.goldSolid} 0%, ${c.goldSolid} 22%, ${c.goldLine} 22%)`,
              opacity: 0.6,
            }} />

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-4">
            {SECTIONS.map((s, i) => {
              const ready = s.status === 'ready';
              return (
                <motion.div key={s.key}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative flex flex-row lg:flex-col items-center lg:items-center text-left lg:text-center gap-4 lg:gap-0">
                  {/* 节点圆 */}
                  <div className="relative w-14 h-14 shrink-0 rounded-full flex items-center justify-center lg:mb-3"
                    style={{
                      background: ready
                        ? `linear-gradient(135deg, ${c.goldSolid} 0%, ${c.goldSolid}cc 100%)`
                        : (theme === 'dark' ? 'rgba(184,146,42,0.05)' : '#fdf8ee'),
                      border: ready ? 'none' : `2px dashed ${c.goldLine}`,
                      color: ready ? '#fff' : c.textMuted,
                      boxShadow: ready ? `0 4px 16px ${c.goldSolid}55` : 'none',
                    }}>
                    <span className="text-2xl">{s.icon}</span>
                    {ready && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white"
                        style={{ background: '#10b981', boxShadow: '0 2px 6px rgba(16,185,129,0.4)' }}>
                        ✓
                      </div>
                    )}
                  </div>
                  {/* 文字组：手机端右排单列；桌面端居中堆叠 */}
                  <div className="flex-1 lg:flex-none flex flex-col items-start lg:items-center min-w-0">
                    {/* 顶行：时间标签 + 板块名 + note（手机端 inline；桌面端依然分行） */}
                    <div className="flex items-baseline gap-2 lg:flex-col lg:gap-0 lg:mb-1">
                      <div className="text-[10px] tracking-[0.08em] whitespace-nowrap lg:mb-1.5"
                        style={{ color: ready ? '#10b981' : c.textMuted, fontWeight: 500 }}>
                        {s.when}
                      </div>
                      <div className="text-base lg:text-xl font-semibold tracking-[0.04em] whitespace-nowrap"
                        style={{ color: c.textPrimary }}>
                        {s.name}
                      </div>
                      {s.note && (
                        <div className="text-[9px] tracking-[0.05em] whitespace-nowrap px-2 py-0.5 rounded-full lg:hidden"
                          style={{
                            color: c.goldSolid,
                            background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                            border: `1px solid ${c.goldLine}`,
                            opacity: 0.85,
                          }}>
                          {s.note}
                        </div>
                      )}
                    </div>
                    {/* 桌面专属 note（手机已在顶行 inline 展示）*/}
                    {s.note && (
                      <div className="hidden lg:block text-[9px] tracking-[0.05em] mb-1.5 px-2 py-0.5 rounded-full"
                        style={{
                          color: c.goldSolid,
                          background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                          border: `1px solid ${c.goldLine}`,
                          opacity: 0.85,
                        }}>
                        {s.note}
                      </div>
                    )}
                    {/* 简介 */}
                    <div className="text-[11px] lg:text-xs leading-relaxed lg:max-w-[200px] mt-0.5 lg:mt-0"
                      style={{ color: c.textSecond }}>
                      {s.desc}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 功能详解 ══════════════════════════════════════ */}
      <section className="relative z-10">
        {FEATURES.map((feature, i) => (
          <div key={i}
            className={`flex items-center px-6 md:px-10 lg:px-14 py-20 md:py-24 ${i <= 2 ? 'min-h-[82svh] lg:min-h-[92vh]' : ''}`}
            style={{ background: i % 2 === 1 ? c.altSection : 'transparent' }}>
            <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
              <div className={`grid grid-cols-1 ${i % 2 === 0 ? 'lg:grid-cols-[0.45fr_0.55fr]' : 'lg:grid-cols-[0.55fr_0.45fr]'} gap-10 lg:gap-16 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                {/* 文字区 */}
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <FadeIn delay={0}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px w-8" style={{ background: c.goldLine }} />
                      <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: c.tagText }}>{feature.tag}</span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.1}>
                    <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-tight mb-5 tracking-tight`}
                      style={{
                        fontSize: i < 2 ? 'clamp(36px, 4vw, 56px)' : 'clamp(30px, 3.5vw, 48px)',
                        whiteSpace: 'pre-line',
                      }}>
                      {feature.title}
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="text-base mb-8 leading-relaxed" style={{ color: c.textSecond }}>{feature.subtitle}</p>
                  </FadeIn>
                  <div className="space-y-4">
                    {feature.points.map((point, j) => (
                      <FadeIn key={j} delay={0.25 + j * 0.08}>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: c.goldSolid, opacity: 0.6 }} />
                          <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{point}</p>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
                {/* 视觉装饰区 */}
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <FadeIn delay={0.15}>
                    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12"
                      style={{
                        border: `1px solid ${c.featureBord}`,
                        background: c.featureBg,
                        minHeight: i <= 1 ? '540px' : i === 2 ? '460px' : '320px',
                        boxShadow: c.cardShadow,
                      }}>
                      <FeatureVisual index={i} colors={c} />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ 天·地·人 三分理论 ════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20"
        style={{ background: c.altSection, minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: c.tagText }}>Ni Haixia · Philosophy</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-5 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Thiên · Địa · Nhân
              </h2>
              <p className="max-w-2xl mx-auto text-sm leading-relaxed" style={{ color: c.textSecond }}>
                Cách nhìn cốt lõi của thầy Nghê Hải Hạ: số mệnh chưa bao giờ là toàn bộ cuộc đời.<br />
                Ông chia những sức mạnh ảnh hưởng đến đời người thành ba phần quan trọng ngang nhau.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { glyph: 'Thiên', label: 'Số mệnh bẩm sinh', pct: '⅓', color: c.goldSolid, borderColor: c.goldLine, desc: 'Điều Tử Vi Đẩu Số cho thấy là cách cục lá số bẩm sinh của một người: cách các sao được an theo giờ sinh, cục Ngũ hành, chính tinh cung Mệnh. Đây chỉ là một phần ba số mệnh, là màu nền của cuộc đời chứ không phải toàn bộ.', sub: 'Lá số · Các sao · Ngũ hành' },
              { glyph: 'Địa', label: 'Nơi mình sống', pct: '⅓', color: 'rgba(96,165,250,0.9)', borderColor: 'rgba(96,165,250,0.3)', desc: 'Nơi bạn sống, thành phố, đất nước, phong thuỷ, cho đến hoàn cảnh gia đình và xã hội, cùng tạo nên phần thứ hai của số mệnh. Cùng một lá số, sinh ra ở những nơi khác nhau thì cảnh ngộ có thể khác nhau một trời một vực.', sub: 'Vùng đất · Phong thuỷ · Môi trường' },
              { glyph: 'Nhân', label: 'Lòng người và ý chí', pct: '⅓', color: 'rgba(100,216,139,0.9)', borderColor: 'rgba(100,216,139,0.3)', desc: 'Ý chí, tâm thế, lựa chọn và hành động của mỗi người mới là sức mạnh chủ động nhất để thay đổi số mệnh. Nghê sư nhấn mạnh: hiểu lá số là để sống tốt hơn, chứ không phải ngồi chờ số mệnh sắp đặt. Không ngừng rèn mình là cách mạnh nhất để vượt qua giới hạn.', sub: 'Ý chí · Lựa chọn · Hành động' },
            ].map((item, i) => (
              <FadeIn key={item.glyph} delay={0.1 + i * 0.12}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.1 }}
                  className="rounded-2xl p-7 h-full flex flex-col"
                  style={{ background: c.cardBg, border: `1px solid ${item.borderColor}`, boxShadow: c.cardShadow }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="text-4xl font-bold leading-tight" style={{ color: item.color }}>{item.glyph}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.pct}</div>
                      <div className="text-[9px] mt-0.5 tracking-wide" style={{ color: c.textMuted }}>cuộc đời</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-0.5" style={{ color: item.color }}>{item.label}</div>
                    <div className="text-[10px] tracking-wider" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                  <div className="h-px mb-4" style={{ background: item.borderColor }} />
                  <p className="text-xs leading-relaxed flex-1" style={{ color: c.textSecond }}>{item.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="mt-10 text-center">
              <p className="text-sm leading-relaxed" lang="zh" style={{ color: c.textSecond }}>
                「命运不是人生的全部，加上地理位置和人念，才是。」
              </p>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: c.textMuted }}>
                “Số mệnh không phải là toàn bộ cuộc đời; cộng thêm nơi mình sống và ý niệm của con người thì mới đủ.”
              </p>
              <p className="mt-2 text-[10px] tracking-wide" style={{ color: c.tagText }}>— Nghê Hải Hạ</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 倪海厦介绍 ════════════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20" style={{ minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: c.tagText }}>Master · 1953 – 2012</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-6 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Thầy Nghê Hải Hạ
              </h2>
              <p className="max-w-2xl mx-auto leading-relaxed text-sm" style={{ color: c.textSecond }}>
                Một trong những bậc thầy Đông y và thuật số có ảnh hưởng nhất trong giới người Hoa ngày nay<br />
                Người lập ra Học viện Đông y Hán Đường ở Mỹ · Để lại hai bộ bài giảng “Nhân Kỷ” và “Thiên Kỷ”
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl p-8 md:p-10 mb-8"
              style={{ border: `1px solid ${c.niBorder}`, background: c.niBg, boxShadow: c.cardShadow }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Sinh năm', value: '1954', sub: 'Đài Loan' },
                  { label: 'Mất năm', value: '2012', sub: 'Ngày 31/1 · Hưởng thọ 58 tuổi' },
                  { label: 'Truyền lại', value: 'Tử Vi Đẩu Số', sub: 'Đông y Kinh phương · Kinh Dịch' },
                ].map(item => (
                  <div key={item.label} className="text-center rounded-xl px-4 py-3"
                    style={{ border: `1px solid ${c.niDivider}`, background: 'rgba(255,255,255,0.02)' }}>
                    <div className="text-[10px] tracking-[0.1em] mb-1" style={{ color: c.textFaint }}>{item.label}</div>
                    <div className="text-2xl font-semibold mb-0.5" style={{ color: c.goldSolid }}>{item.value}</div>
                    <div className="text-[11px]" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <div className="h-px mb-8" style={{ background: c.niDivider }} />
              <div className="space-y-4 text-sm leading-relaxed max-w-3xl mx-auto" style={{ color: c.textSecond }}>
                <p>
                  <strong style={{ color: c.goldSolid }}>Cuộc đời</strong>:{' '}
                  Ông Nghê Hải Hạ (1954–2012) sinh ra ở Đài Loan, thuở trẻ theo học nhiều danh y Đông y, chuyên sâu phái Kinh phương (dòng truyền của sách Thương Hàn Luận).
                  Tuổi trung niên ông sang Mỹ chữa bệnh, lập ra <strong>Học viện Đông y Hán Đường</strong> ở Mỹ, hơn hai mươi năm dạy bài bản Đông y và thuật số truyền thống.
                  Ông mất ngày 31/1/2012 tại Đài Loan vì ung thư gan, hưởng thọ 58 tuổi.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Các bộ bài giảng</strong>:{' '}
                  Nghê sư gom những gì học được cả đời thành hai bộ bài giảng công khai.
                  <strong>“Nhân Kỷ”</strong> gồm Châm Cứu Đại Thành, Thần Nông Bản Thảo Kinh, Hoàng Đế Nội Kinh, Thương Hàn Luận, Kim Quỹ Yếu Lược —
                  đây là “kỷ của người”, đặt nền cho con đường học Đông y trọn vẹn;
                  <strong>“Thiên Kỷ”</strong> gồm Tử Vi Đẩu Số và Kinh Dịch — đây là “kỷ của trời”, là thành quả sắp xếp việc nghiên cứu thuật số thành hệ thống.
                  Hai bộ hợp lại là di sản trọn vẹn nhất Nghê sư để lại cho đời sau.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Quan điểm về Tử Vi</strong>:{' '}
                  Về Tử Vi Đẩu Số, Nghê sư rõ ràng thuộc <strong>Nam phái Tam Hợp</strong>, chủ trương “lấy cung Mệnh làm gốc, lấy tam phương tứ chính làm dụng, lấy Tứ Hoá làm cương lĩnh”.
                  Trong khoá Thiên Kỷ, ông nói thẳng:
                  <span className="block my-2 pl-3" style={{ borderLeft: `2px solid ${c.goldLine}` }}>
                    <em lang="zh">「飞星（四化）飞来飞去太复杂，不搞这个，毕竟大道至简」</em>
                    <span className="block text-xs mt-0.5" style={{ color: c.textMuted }}>
                      “Phi tinh (Tứ Hoá) bay tới bay lui quá phức tạp, tôi không làm theo cách đó; dù sao đại đạo vốn rất giản dị.”
                    </span>
                  </span>
                  Quan điểm này tách ông hẳn khỏi phái Phi Tinh rườm rà.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Cách học</strong>:{' '}
                  Nghê sư phản đối học thuộc lòng khẩu quyết, nhấn mạnh “hiểu nguyên lý hơn học thuộc”, “lập luận kiểm lại được hơn huyền bí khó hiểu”.
                  Cách nghĩ này đưa Tử Vi Đẩu Số từ một hệ thống khép kín chỉ thầy truyền riêng cho trò thành kiến thức hiện đại có hệ thống, kiểm chứng được và ai cũng học được.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Ảnh hưởng ngày nay</strong>:{' '}
                  Video bài giảng của Nghê sư được lan truyền rộng trên Bilibili, YouTube và nhiều nền tảng khác, được thế hệ mới yêu thích mệnh lý và Đông y xem là bài nhập môn phải học.
                  Ông không chỉ là người truyền lại Tử Vi Đẩu Số, mà còn là một trong những người chủ chốt đưa mệnh lý truyền thống và Đông y vào kho kiến thức hiện đại.
                </p>
                <p style={{ fontSize: '11px', color: c.textMuted, fontStyle: 'italic', marginTop: '12px' }}>
                  Mọi lời giải trên trang này được tổng hợp từ giáo trình công khai Thiên Kỷ của Nghê sư, bản đời Minh của Tử Vi Đẩu Số Toàn Thư và các sách cổ phái Tam Hợp truyền thống,
                  chỉ để tham khảo về văn hoá và phát triển bản thân. Nghê sư không có bất kỳ liên quan thương mại nào với trang này.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NI_TEACHINGS.map((teaching, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.08}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.1 }}
                  className="rounded-xl p-6 h-full"
                  style={{ border: `1px solid ${c.niCardBord}`, background: c.niCardBg, boxShadow: c.niCardShadow }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5"
                      style={{ borderColor: c.goldLine }}>
                      <span className="text-[9px]" style={{ color: c.goldSolid }}>{i + 1}</span>
                    </div>
                    <h3 className="text-sm font-medium leading-relaxed" style={{ color: c.goldSolid }}>{teaching.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-8" style={{ color: c.textSecond }}>{teaching.body}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 合盘入口 ══════════════════════════════════════ */}
      <section className="relative z-10 px-6 md:px-10 lg:px-14 py-20">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="rounded-2xl p-10 md:p-14 text-center"
            style={{
              background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${c.cardBorder}`,
              boxShadow: c.cardShadow,
            }}>
            <FadeIn>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: c.goldLine }} />
                <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: c.tagText }}>Compatibility · Analysis</span>
                <div className="h-px w-8" style={{ background: c.goldLine }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-4 tracking-tight`}
                style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
                Xem đôi · Hợp hôn
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: c.textSecond }}>
                Nhập ngày giờ sinh của hai người. AI theo hệ thống Nghê Hải Hạ so cung Phu Thê của hai bên, xem cung Mệnh có hợp nhau không và tam phương tứ chính tác động qua lại ra sao,<br className="hidden md:block" />{' '}
                rồi cho biết hai người hợp nhau đến đâu, có nên làm ăn chung không và cách sống với nhau tốt nhất.
              </p>
              <div className="flex justify-center gap-3 flex-wrap mb-6">
                {['Xem hợp nhau về tình cảm', 'Xem có nên làm ăn chung', 'Xem duyên cha mẹ và con', 'Xem hợp nhau trước khi cưới'].map(item => (
                  <span key={item} style={{
                    fontSize: '12px', padding: '5px 14px', borderRadius: '20px',
                    background: theme === 'dark' ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.12)',
                    border: `1px solid ${c.goldLine}`,
                    color: c.goldSolid,
                  }}>
                    {item}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/heming')}
                className="px-10 py-3 font-medium text-sm tracking-wide rounded-full"
                style={{
                  background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(140,100,20,0.1)',
                  border: `1px solid ${c.goldLine}`,
                  color: c.goldSolid,
                  cursor: 'pointer',
                }}>
                Bắt đầu xem đôi
              </motion.button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ 最终 CTA ══════════════════════════════════════ */}
      <section className="relative z-10 py-40 px-6 text-center" style={{ background: c.altSection }}>
        <FadeIn>
          <p className="text-[10px] tracking-[0.25em] uppercase mb-6" style={{ color: c.tagText }}>Bắt đầu xem lá số của bạn</p>
          <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-8 tracking-tight leading-tight`}
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
            Lá số Tử Vi của bạn<br />đang chờ được giải
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            Nhập ngày giờ sinh, chỉ vài giây là có lá số của riêng bạn<br />
            rồi AI sẽ giải thật kỹ theo hệ thống Nghê Hải Hạ
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="px-14 py-4 font-semibold text-base tracking-wide rounded-full"
            style={{ background: c.ctaBg, color: c.ctaText }}>
            Lập lá số miễn phí
          </motion.button>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <motion.a
              href="/knowledge"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.05em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              ✦ Kho kiến thức Tử Vi →
            </motion.a>
            <motion.a
              href="/library"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.05em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              📜 Thư viện sách cổ →
            </motion.a>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6"
        style={{ borderTop: `1px solid ${c.niCardBord}` }}>

        {/* 4 板块导航占位（已上线 + 即将开放）*/}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-[9px] tracking-[0.15em] text-center mb-4 uppercase"
            style={{ color: c.textMuted, opacity: 0.6 }}>
            Phương pháp của Nghê sư · Các phần học
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {SECTIONS.map(s => {
              const ready = s.status === 'ready';
              return (
                <a
                  key={s.key}
                  href={ready ? '/chart' : undefined}
                  onClick={ready ? undefined : (e) => e.preventDefault()}
                  className="rounded-lg px-3 py-3 text-center transition-all"
                  style={{
                    background: ready ? c.starBg : 'transparent',
                    border: `1px ${ready ? 'solid' : 'dashed'} ${ready ? c.goldLine : c.navBorder}`,
                    cursor: ready ? 'pointer' : 'not-allowed',
                    opacity: ready ? 1 : 0.5,
                    textDecoration: 'none',
                  }}
                >
                  <div className="text-base font-semibold mb-0.5 tracking-[0.03em]"
                    style={{ color: ready ? c.goldSolid : c.textMuted }}>
                    {s.name}
                  </div>
                  <div className="text-[9px] tracking-wider"
                    style={{ color: ready ? '#10b981' : c.textMuted }}>
                    {ready ? '✓ Đã mở' : `Mở vào ${s.when.toLowerCase()}`}
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] tracking-wider mb-3" style={{ color: c.footerText }}>
            Lá số Tử Vi · Theo hệ thống chính tông Nghê Hải Hạ · Chỉ để tham khảo, số mệnh nằm trong tay bạn
          </p>
          <p className="text-[10px] tracking-wider mb-3 max-w-2xl mx-auto leading-relaxed"
            style={{ color: c.footerText, opacity: 0.85 }}>
            Trang này dựa trên việc nghiên cứu văn hoá truyền thống Trung Hoa, chỉ để học tập và tham khảo.<br className="sm:hidden" />{' '}
            Đây không phải lời khuyên về y tế, đầu tư, pháp luật hay các quyết định lớn.
          </p>
          <p className="text-[10px] tracking-wider" style={{ color: c.footerText }}>
            <a href="/terms" style={{ color: c.footerText, textDecoration: 'underline' }}>Điều khoản sử dụng</a>
            {' · '}
            <a href="/privacy" style={{ color: c.footerText, textDecoration: 'underline' }}>Chính sách quyền riêng tư</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
