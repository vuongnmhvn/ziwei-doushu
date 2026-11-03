import type { VnTimeRegion } from './vn-timezone';

export interface VnCityInfo {
  name: string;
  /** Kinh độ (độ Đông) của trung tâm thành phố. */
  longitude: number;
  /** Ghi đè miền giờ khi khác với cả tỉnh (ví dụ Vĩnh Linh ở bờ bắc sông Bến Hải). */
  region?: VnTimeRegion;
}

export interface VnProvinceInfo {
  name: string;
  /** Miền dùng để tra giờ chuẩn lịch sử: phía bắc hay phía nam vĩ tuyến 17. */
  region: VnTimeRegion;
  /** Thành phố đầu tiên là tỉnh lỵ, được chọn sẵn khi chọn tỉnh. */
  cities: VnCityInfo[];
}

/**
 * 63 tỉnh thành Việt Nam theo địa giới trước khi sáp nhập năm 2025 (tên ghi trên giấy khai sinh của
 * phần lớn mọi người). Kinh độ lấy ở trung tâm tỉnh lỵ; tỉnh trải rộng theo chiều đông tây có thêm
 * vài thành phố, vì mỗi độ kinh lệch 4 phút giờ mặt trời.
 */
export const VN_PROVINCES: VnProvinceInfo[] = [
  // ─── Miền Bắc (tới Quảng Bình) ───
  { name: 'Hà Nội', region: 'bac', cities: [{ name: 'Hà Nội', longitude: 105.85 }, { name: 'Sơn Tây', longitude: 105.50 }] },
  { name: 'Hải Phòng', region: 'bac', cities: [{ name: 'Hải Phòng', longitude: 106.68 }] },
  { name: 'Hà Giang', region: 'bac', cities: [{ name: 'Hà Giang', longitude: 104.98 }] },
  { name: 'Cao Bằng', region: 'bac', cities: [{ name: 'Cao Bằng', longitude: 106.26 }] },
  { name: 'Bắc Kạn', region: 'bac', cities: [{ name: 'Bắc Kạn', longitude: 105.83 }] },
  { name: 'Tuyên Quang', region: 'bac', cities: [{ name: 'Tuyên Quang', longitude: 105.21 }] },
  { name: 'Lào Cai', region: 'bac', cities: [{ name: 'Lào Cai', longitude: 103.97 }, { name: 'Sa Pa', longitude: 103.84 }] },
  { name: 'Điện Biên', region: 'bac', cities: [{ name: 'Điện Biên Phủ', longitude: 103.02 }] },
  { name: 'Lai Châu', region: 'bac', cities: [{ name: 'Lai Châu', longitude: 103.46 }] },
  { name: 'Sơn La', region: 'bac', cities: [{ name: 'Sơn La', longitude: 103.91 }, { name: 'Mộc Châu', longitude: 104.68 }] },
  { name: 'Yên Bái', region: 'bac', cities: [{ name: 'Yên Bái', longitude: 104.87 }] },
  { name: 'Hoà Bình', region: 'bac', cities: [{ name: 'Hoà Bình', longitude: 105.34 }] },
  { name: 'Thái Nguyên', region: 'bac', cities: [{ name: 'Thái Nguyên', longitude: 105.84 }] },
  { name: 'Lạng Sơn', region: 'bac', cities: [{ name: 'Lạng Sơn', longitude: 106.76 }] },
  { name: 'Quảng Ninh', region: 'bac', cities: [
    { name: 'Hạ Long', longitude: 107.08 }, { name: 'Cẩm Phả', longitude: 107.29 },
    { name: 'Uông Bí', longitude: 106.78 }, { name: 'Móng Cái', longitude: 107.97 },
  ] },
  { name: 'Bắc Giang', region: 'bac', cities: [{ name: 'Bắc Giang', longitude: 106.19 }] },
  { name: 'Phú Thọ', region: 'bac', cities: [{ name: 'Việt Trì', longitude: 105.40 }] },
  { name: 'Vĩnh Phúc', region: 'bac', cities: [{ name: 'Vĩnh Yên', longitude: 105.60 }] },
  { name: 'Bắc Ninh', region: 'bac', cities: [{ name: 'Bắc Ninh', longitude: 106.06 }] },
  { name: 'Hải Dương', region: 'bac', cities: [{ name: 'Hải Dương', longitude: 106.33 }] },
  { name: 'Hưng Yên', region: 'bac', cities: [{ name: 'Hưng Yên', longitude: 106.05 }] },
  { name: 'Thái Bình', region: 'bac', cities: [{ name: 'Thái Bình', longitude: 106.34 }] },
  { name: 'Hà Nam', region: 'bac', cities: [{ name: 'Phủ Lý', longitude: 105.92 }] },
  { name: 'Nam Định', region: 'bac', cities: [{ name: 'Nam Định', longitude: 106.17 }] },
  { name: 'Ninh Bình', region: 'bac', cities: [{ name: 'Ninh Bình', longitude: 105.97 }] },
  { name: 'Thanh Hoá', region: 'bac', cities: [{ name: 'Thanh Hoá', longitude: 105.78 }] },
  { name: 'Nghệ An', region: 'bac', cities: [{ name: 'Vinh', longitude: 105.68 }] },
  { name: 'Hà Tĩnh', region: 'bac', cities: [{ name: 'Hà Tĩnh', longitude: 105.90 }] },
  { name: 'Quảng Bình', region: 'bac', cities: [{ name: 'Đồng Hới', longitude: 106.62 }] },

  // ─── Miền Trung và Tây Nguyên (từ Quảng Trị) ───
  { name: 'Quảng Trị', region: 'nam', cities: [
    { name: 'Đông Hà', longitude: 107.10 },
    { name: 'Vĩnh Linh (bờ bắc Bến Hải)', longitude: 107.03, region: 'bac' },
  ] },
  { name: 'Thừa Thiên Huế', region: 'nam', cities: [{ name: 'Huế', longitude: 107.59 }] },
  { name: 'Đà Nẵng', region: 'nam', cities: [{ name: 'Đà Nẵng', longitude: 108.22 }] },
  { name: 'Quảng Nam', region: 'nam', cities: [{ name: 'Tam Kỳ', longitude: 108.48 }, { name: 'Hội An', longitude: 108.33 }] },
  { name: 'Quảng Ngãi', region: 'nam', cities: [{ name: 'Quảng Ngãi', longitude: 108.80 }] },
  { name: 'Bình Định', region: 'nam', cities: [{ name: 'Quy Nhơn', longitude: 109.22 }] },
  { name: 'Phú Yên', region: 'nam', cities: [{ name: 'Tuy Hoà', longitude: 109.32 }] },
  { name: 'Khánh Hoà', region: 'nam', cities: [{ name: 'Nha Trang', longitude: 109.19 }, { name: 'Cam Ranh', longitude: 109.16 }] },
  { name: 'Ninh Thuận', region: 'nam', cities: [{ name: 'Phan Rang – Tháp Chàm', longitude: 108.99 }] },
  { name: 'Bình Thuận', region: 'nam', cities: [{ name: 'Phan Thiết', longitude: 108.10 }] },
  { name: 'Kon Tum', region: 'nam', cities: [{ name: 'Kon Tum', longitude: 108.00 }] },
  { name: 'Gia Lai', region: 'nam', cities: [{ name: 'Pleiku', longitude: 108.00 }, { name: 'An Khê', longitude: 108.66 }] },
  { name: 'Đắk Lắk', region: 'nam', cities: [{ name: 'Buôn Ma Thuột', longitude: 108.04 }] },
  { name: 'Đắk Nông', region: 'nam', cities: [{ name: 'Gia Nghĩa', longitude: 107.69 }] },
  { name: 'Lâm Đồng', region: 'nam', cities: [{ name: 'Đà Lạt', longitude: 108.44 }, { name: 'Bảo Lộc', longitude: 107.81 }] },

  // ─── Miền Nam ───
  { name: 'TP. Hồ Chí Minh', region: 'nam', cities: [
    { name: 'TP. Hồ Chí Minh', longitude: 106.70 }, { name: 'Củ Chi', longitude: 106.49 }, { name: 'Cần Giờ', longitude: 106.95 },
  ] },
  { name: 'Bình Phước', region: 'nam', cities: [{ name: 'Đồng Xoài', longitude: 106.90 }] },
  { name: 'Tây Ninh', region: 'nam', cities: [{ name: 'Tây Ninh', longitude: 106.10 }] },
  { name: 'Bình Dương', region: 'nam', cities: [{ name: 'Thủ Dầu Một', longitude: 106.65 }] },
  { name: 'Đồng Nai', region: 'nam', cities: [{ name: 'Biên Hoà', longitude: 106.82 }] },
  { name: 'Bà Rịa – Vũng Tàu', region: 'nam', cities: [
    { name: 'Vũng Tàu', longitude: 107.08 }, { name: 'Bà Rịa', longitude: 107.17 }, { name: 'Côn Đảo', longitude: 106.61 },
  ] },
  { name: 'Long An', region: 'nam', cities: [{ name: 'Tân An', longitude: 106.41 }] },
  { name: 'Tiền Giang', region: 'nam', cities: [{ name: 'Mỹ Tho', longitude: 106.36 }] },
  { name: 'Bến Tre', region: 'nam', cities: [{ name: 'Bến Tre', longitude: 106.38 }] },
  { name: 'Trà Vinh', region: 'nam', cities: [{ name: 'Trà Vinh', longitude: 106.34 }] },
  { name: 'Vĩnh Long', region: 'nam', cities: [{ name: 'Vĩnh Long', longitude: 105.97 }] },
  { name: 'Đồng Tháp', region: 'nam', cities: [{ name: 'Cao Lãnh', longitude: 105.63 }] },
  { name: 'An Giang', region: 'nam', cities: [{ name: 'Long Xuyên', longitude: 105.44 }, { name: 'Châu Đốc', longitude: 105.12 }] },
  { name: 'Kiên Giang', region: 'nam', cities: [
    { name: 'Rạch Giá', longitude: 105.08 }, { name: 'Hà Tiên', longitude: 104.49 }, { name: 'Phú Quốc', longitude: 103.97 },
  ] },
  { name: 'Cần Thơ', region: 'nam', cities: [{ name: 'Cần Thơ', longitude: 105.78 }] },
  { name: 'Hậu Giang', region: 'nam', cities: [{ name: 'Vị Thanh', longitude: 105.47 }] },
  { name: 'Sóc Trăng', region: 'nam', cities: [{ name: 'Sóc Trăng', longitude: 105.97 }] },
  { name: 'Bạc Liêu', region: 'nam', cities: [{ name: 'Bạc Liêu', longitude: 105.72 }] },
  { name: 'Cà Mau', region: 'nam', cities: [{ name: 'Cà Mau', longitude: 105.15 }] },
];
