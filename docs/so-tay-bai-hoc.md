# Sổ tay bài học — ziwei-doushu (bản tiếng Việt, tuvi.vuongnm.com)

Đọc trước khi sửa code hoặc deploy. Bẫy chung của máy Oracle và Coolify nằm ở `~/docs/so-tay-bai-hoc.md`.

## 1. Không đưa chữ đã dịch vào bộ máy lập lá số

- **Ngày:** 2026-11-03
- **Triệu chứng dễ gặp:** đổi `astro.bySolar(..., 'zh-CN')` sang `'vi-VN'` cho nhanh thì lá số vẫn hiện nhưng sai lặng lẽ: bảng độ sáng, các bản vá sao và hơn 45 cách cục trong `patterns.ts` đều so tên chữ Hán (`'紫微'`, `'命宫'`).
- **Cách làm đúng:** bộ máy giữ chữ Hán; chỉ dịch ở chỗ hiển thị bằng `vi()` trong `lib/i18n/vi.ts`. Bảng thuật ngữ sinh từ locale của iztro (`npx tsx scripts/i18n/gen-vi-terms.ts`), chữ cần sửa thì thêm vào `VI_OVERRIDES`, không sửa tay file `.generated.ts`.
- **Phòng tránh:** khoá của bảng tra (ví dụ `PALACE_ROLES` trong `InsightPanel`) phải đúng tên bộ máy trả ra: iztro gọi `命宫` có chữ 宫, các cung khác không có (`夫妻`, `仆役`). Bản gốc dùng `夫妻宫` nên tra không bao giờ ra.

## 2. Giờ mặt trời thật phải dùng giờ chuẩn của nơi sinh, không cứng 120°

- **Ngày:** 2026-11-03
- **Nguyên nhân:** `lib/ziwei/share.ts` gốc luôn coi giờ đồng hồ là giờ Bắc Kinh (kinh tuyến 120°). Với người sinh ở Việt Nam sẽ lệch 1 giờ, và miền Nam 1960–1975 còn dùng GMT+8.
- **Cách làm:** `lib/ziwei/vn-timezone.ts` (bảng theo tz Asia/Ho_Chi_Minh; miền Bắc GMT+7 từ 2/9/1945) và `lib/ziwei/birth-place.ts` cho biết giờ chuẩn theo nơi sinh và ngày giờ sinh. Miền giờ lấy theo vĩ độ nơi sinh so với vĩ tuyến 17 (không theo tên tỉnh), vì tỉnh mới sau 2025 có thể gộp qua hai miền (Quảng Trị mới gồm cả Quảng Bình).
- **Dữ liệu nơi sinh:** danh sách tỉnh cũ (63, kèm quận/huyện) và tỉnh mới (34, kèm phường/xã) lấy từ provinces.open-api.vn; API không có toạ độ nên `scripts/data/build-vn-places.ts` tra OpenStreetMap (Nominatim 1 lượt/giây, Photon cho phường/xã), loại kết quả nằm ngoài khung tỉnh, có bộ nhớ đệm `scripts/data/geocode-cache.json`. Quận/huyện, xã ở `public/data/*.json`, chỉ tải khi chọn tỉnh. Kinh độ, vĩ độ nơi đã chọn lưu thẳng trong form và link chia sẻ (`lo`, `la`). Bài test `scripts/regression/vn-timezone.test.ts` đối chiếu từng giờ với dữ liệu tz của Node.
- **Bẫy:** quét tz theo từng giờ để lấy mốc chuyển giờ sẽ làm tròn sai mốc 1911 (chuyển lúc 16:53:30 UTC, nửa đêm giờ 7:06:30). Lấy mốc từ dữ liệu tz rồi để test đối chiếu, đừng tin số làm tròn.

## 3. Soát chữ Hán còn sót: `grep -P "\p{Han}"` báo nhầm dòng chữ Việt

- **Ngày:** 2026-11-03
- **Triệu chứng:** trong locale `C.UTF-8`, `grep -P "\p{Han}"` khớp cả dòng chỉ có chữ Việt có dấu.
- **Cách làm:** soát bằng Python với dải `[㐀-鿿]`, bỏ qua dòng chú thích.

## 4. Dịch giao diện từ chữ Hán: bố cục, phông và ngày tháng

- **Ngày:** 2026-11-03
- Ngày kiểu tháng/ngày (`5/1 — 5/8`) phải đảo thành ngày/tháng khi dịch.
- `letterSpacing` từ 0.3em, lưới cố định số cột, `whiteSpace: nowrap` vốn đo cho tên 2 chữ Hán: chữ Việt sẽ tràn. Chữ tô màu bằng `background-clip: text` đi cùng `leading-none` làm mất dấu chồng; dùng `line-height` từ 1.2.
- Nhiều chỗ đặt thẳng `fontFamily` là phông Trung (PingFang SC, STKaiti…): đổi sang `var(--font)`.
- `**chữ**` viết thẳng trong JSX hiện nguyên dấu sao; dùng `<strong>`.
- Kiểu bỏ dấu: cả giao diện dùng kiểu cũ (Hoả, Thuỷ, Hoá); script sinh bảng thuật ngữ tự đổi về kiểu này.

## 5. API luận giải AI: khoá chỉ ở server, có giới hạn lượt

- **Ngày:** 2026-11-03
- `app/api/interpret` và `app/api/heming` gọi codex-lb (`AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`, chỉ đặt ở runtime trên Coolify; bản sao ở `~/backups/coolify-oracle/tuvi.env`, quyền 600).
- Server tự lập lại lá số từ ngày giờ sinh, không tin lá số trình duyệt gửi; giới hạn lượt theo IP (`AI_RATE_LIMIT_PER_15M`) và số lượt chạy cùng lúc (`AI_MAX_CONCURRENT`), vì trang công khai mà mỗi lượt tốn hạn mức của chủ trang.
- Đọc luồng SSE phải giữ phần dòng bị cắt giữa hai lần đọc (bản gốc `InsightPanel` làm rơi chữ); upstream đã sửa trang hợp hôn ở #53.
