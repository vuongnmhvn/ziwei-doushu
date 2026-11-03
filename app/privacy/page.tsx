export const metadata = { title: 'Chính sách quyền riêng tư · Lá số Tử Vi', description: 'Chính sách quyền riêng tư của Lá số Tử Vi' };

export default function PrivacyPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Chính sách quyền riêng tư</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: tháng 4/2026</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Thông tin chúng tôi thu thập</h2>
      <p>Để lập và giải lá số Tử Vi cho bạn, chúng tôi có thể thu thập những thông tin sau:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>Thông tin cần để lập lá số</strong>: họ tên (không bắt buộc), ngày tháng năm sinh dương lịch, giờ sinh, giới tính, kinh độ nơi sinh</li>
        <li><strong>Thông tin tài khoản (sau khi đăng ký)</strong>: số điện thoại (để xác minh bằng tin nhắn và dùng dịch vụ hội viên)</li>
        <li><strong>Thông tin sử dụng</strong>: những lần bạn bấm, xem trang và lịch sử lá số trên trang</li>
        <li><strong>Thông tin góp ý</strong>: điểm &ldquo;đúng / không đúng&rdquo; bạn chấm cho lời giải và lời góp ý bạn viết</li>
        <li><strong>Thông tin thanh toán</strong>: khi mua gói hội viên hoặc từng dịch vụ, việc thanh toán do bên thứ ba (Alipay / WeChat Pay) xử lý; trang này không lưu số thẻ đầy đủ hay mật khẩu</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Chúng tôi dùng thông tin như thế nào</h2>
      <ul style={{ paddingLeft: 24 }}>
        <li>Thông tin lá số chỉ dùng cho lần giải này và lịch sử lá số trong tài khoản của bạn</li>
        <li>Số điện thoại dùng để đăng ký, đăng nhập và báo tin về đơn hàng</li>
        <li>Thông tin góp ý dùng để liên tục làm lời giải tốt hơn (đã bỏ thông tin nhận dạng rồi mới gộp lại phân tích)</li>
        <li>Số liệu tổng hợp có thể dùng cho nghiên cứu ngành và cải thiện trang</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Chia sẻ thông tin và bên thứ ba</h2>
      <p>Ngoài những trường hợp dưới đây, chúng tôi không chia sẻ thông tin cá nhân của bạn cho bên thứ ba:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Bên cung cấp thanh toán (Alipay / WeChat Pay): xử lý việc thanh toán đơn hàng</li>
        <li>Bên gửi tin nhắn (ví dụ Alibaba Cloud SMS): gửi mã xác minh</li>
        <li>Bên cung cấp máy chủ đám mây (ví dụ Vercel / Cloudflare / Alibaba Cloud): chạy trang web</li>
        <li>Dịch vụ AI giải lá số (ví dụ Anthropic Claude): xử lý các câu bạn &ldquo;hỏi thêm&rdquo; (đã ẩn danh)</li>
        <li>Cơ quan tư pháp hoặc cơ quan nhà nước yêu cầu hợp pháp theo quy định của pháp luật</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Bảo vệ thông tin</h2>
      <p>Chúng tôi dùng các biện pháp kỹ thuật và quản lý thông dụng để bảo vệ thông tin của bạn (mã hoá đường truyền HTTPS, mã hoá dữ liệu khi lưu, giới hạn người được truy cập…). Tuy vậy, xin lưu ý rằng truyền dữ liệu qua Internet không thể an toàn 100%.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Quyền của bạn</h2>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>Xem lại</strong>: xem toàn bộ lịch sử lá số và đơn hàng trong trang tài khoản</li>
        <li><strong>Xoá</strong>: liên hệ bộ phận hỗ trợ để xoá lá số bạn chọn trong tài khoản hoặc xoá hẳn tài khoản</li>
        <li><strong>Tải về</strong>: có thể yêu cầu tải về toàn bộ dữ liệu cá nhân của bạn</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. Cookie và dữ liệu lưu trên máy</h2>
      <p>Trang này dùng cookie / localStorage để: nhớ bạn chọn nền tối hay nền sáng, lưu các lá số gần đây và giữ trạng thái đăng nhập hội viên. Bạn có thể tắt trong phần cài đặt của trình duyệt, nhưng một số tính năng có thể không chạy đúng.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. Người chưa thành niên</h2>
      <p>Nội dung mệnh lý trên trang dành cho người từ 18 tuổi trở lên. Người chưa thành niên chỉ nên dùng khi có sự đồng ý của người giám hộ, và không được dựa vào lời giải để đưa ra quyết định lớn trong đời.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>8. Thay đổi chính sách</h2>
      <p>Chính sách này có thể được cập nhật bất cứ lúc nào. Thay đổi lớn sẽ được thông báo rõ ràng. Nếu bạn tiếp tục sử dụng, nghĩa là bạn đồng ý với bản đã cập nhật.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/terms" style={{ color: 'var(--ac)' }}>Điều khoản sử dụng</a> · <a href="/" style={{ color: 'var(--ac)' }}>Về trang chủ</a>
        </p>
      </main>
    </>
  );
}
