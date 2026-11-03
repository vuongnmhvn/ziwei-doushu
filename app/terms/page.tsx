export const metadata = { title: 'Điều khoản sử dụng · Lá số Tử Vi', description: 'Điều khoản sử dụng và thoả thuận người dùng của Lá số Tử Vi' };

export default function TermsPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>Về trang chủ</span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.08em' }}>Lá số Tử Vi</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Điều khoản sử dụng</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: tháng 4/2026</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Giới thiệu dịch vụ</h2>
      <p>Lá số Tử Vi (sau đây gọi là &ldquo;trang này&rdquo;) lập và giải lá số theo hệ thống Tử Vi Đẩu Số trong bộ Thiên Kỷ của Nghê Hải Hạ. Mọi nội dung mệnh lý trên trang chỉ để tham khảo, <strong>không phải lời khuyên về y tế, đầu tư, pháp luật, tâm lý hay các quyết định lớn trong đời</strong>.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Quy định khi sử dụng</h2>
      <p>Khi dùng trang này, bạn đồng ý:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Chỉ dùng trang cho mục đích hợp pháp, để tự tham khảo</li>
        <li>Không lan truyền nội dung của trang để bán, đăng lại hoặc công bố công khai</li>
        <li>Không làm gì gây cản trở hoạt động bình thường của trang</li>
        <li>Thông tin ngày giờ sinh bạn nhập là thật và đúng; trang không chịu trách nhiệm khi lời giải sai lệch do thông tin sai</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Sở hữu trí tuệ và các điều cấm · Cấm thu thập tự động, cấm dùng để huấn luyện AI</h2>
      <p style={{ background: 'rgba(168,50,40,0.06)', border: '1px solid rgba(168,50,40,0.2)', padding: 16, borderRadius: 8 }}>
        <strong>Toàn bộ nội dung mệnh lý, kho kiến thức (gồm mọi lời giải theo 14 chính tinh × 12 cung × nam nữ × Tứ Hoá × đại hạn, lưu niên), thiết kế giao diện, cách kết hợp thuật toán và kho ví dụ đều do trang này tự soạn hoặc tổng hợp hợp pháp.</strong><br/><br/>
        Nghiêm cấm các hành vi sau; với người vi phạm, trang này giữ quyền yêu cầu bồi thường dân sự và truy cứu trách nhiệm hình sự:<br/>
        ① Lấy nội dung của trang bằng bất kỳ cách kỹ thuật nào như chương trình thu thập tự động (crawler), script tự động, gọi API hàng loạt;<br/>
        ② Dùng lời giải lá số, văn bản, dữ liệu API do trang tạo ra <strong>để huấn luyện bất kỳ mô hình học máy nào</strong> (gồm nhưng không giới hạn ở mô hình ngôn ngữ lớn, mô hình tạo nội dung mệnh lý, mô hình tạo văn bản…);<br/>
        ③ Bán lại hoặc đăng nội dung do trang tạo ra lên website, ứng dụng hay tài khoản mạng xã hội khác;<br/>
        ④ Dịch ngược, sao chép, sửa mã nguồn giao diện hoặc máy chủ của trang rồi tự cung cấp dịch vụ tương tự như của mình.<br/><br/>
        Văn bản do trang tạo ra có gắn dấu vết để truy nguồn; nội dung sinh ra từ việc sao chép hay huấn luyện trái phép có thể bị phát hiện và truy ra. Khi phát hiện vi phạm, trang có quyền yêu cầu <strong>bồi thường 1.000.000 nhân dân tệ cho mỗi lần vi phạm</strong>, đồng thời giữ quyền khởi kiện ra toà và phối hợp với cơ quan công an điều tra.
      </p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Miễn trừ trách nhiệm</h2>
      <p>Nội dung mệnh lý của trang được tổng hợp từ kiến thức Tử Vi Đẩu Số truyền thống và hệ thống Nghê Hải Hạ, <strong>không bảo đảm đúng 100%</strong>. Số mệnh chịu ảnh hưởng chung của Thiên, Địa, Nhân; những gì trang đưa ra chỉ để bạn tham khảo khi tìm hiểu bản thân. Hãy xem xét một cách tỉnh táo, đừng quá dựa vào bất kỳ một nhận định mệnh lý riêng lẻ nào.</p>
      <p>Trang này không chịu trách nhiệm pháp lý cho bất kỳ hậu quả nào do việc dùng nội dung của trang (gồm nhưng không giới hạn ở quyết định sai, ảnh hưởng tâm lý, thay đổi trong các mối quan hệ…).</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Thay đổi và chấm dứt dịch vụ</h2>
      <p>Trang này giữ quyền điều chỉnh, tạm dừng hoặc chấm dứt một phần hay toàn bộ dịch vụ bất cứ lúc nào. Thay đổi lớn sẽ được báo cho người dùng bằng thông báo trên trang hoặc email.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. Luật áp dụng và giải quyết tranh chấp</h2>
      <p>Điều khoản này áp dụng pháp luật nước Cộng hoà Nhân dân Trung Hoa. Khi có tranh chấp, hai bên nên thương lượng thiện chí; nếu không thương lượng được, tranh chấp sẽ được đưa ra Toà án nhân dân có thẩm quyền tại nơi đặt trụ sở của đơn vị vận hành trang để giải quyết.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. Liên hệ</h2>
      <p>Nếu có thắc mắc, hãy liên hệ qua WeChat hoặc email hỗ trợ được công bố trên trang.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/privacy" style={{ color: 'var(--ac)' }}>Chính sách quyền riêng tư</a> · <a href="/" style={{ color: 'var(--ac)' }}>Về trang chủ</a>
        </p>
      </main>
    </>
  );
}
