# THE HANOI TRAIN — TÀU HÀ NỘI 5 CỬA Ô
### Chuyến tàu du lịch văn hóa đầu tiên của Hà Nội

Trang web giới thiệu và đặt vé cho chuyến tàu du lịch văn hóa "The Hanoi Train - Tàu Hà Nội 5 Cửa Ô".

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

- `index.html` & `index(1).html`: Trang chủ giao diện website đầy đủ, tối ưu chuẩn PC bố cục ngang và Mobile, tích hợp sẵn Form đặt vé và hiệu ứng tương tác.
- `google-apps-script.js`: Mã nguồn backend Google Apps Script để nhận dữ liệu từ Form đặt vé website và tự động lưu vào Google Sheets.
- `HUONG-DAN-GOOGLE-SHEET.md`: Tài liệu hướng dẫn từng bước thiết lập Google Sheet và triển khai Web App Webhook kết nối Form.
- `logo.png`: Logo nhận diện The Hanoi Train.
- `tau-ha-noi.mp4`: Video clip nền giới thiệu không gian và trải nghiệm trên tàu.
- `toa/`: Thư mục chứa hình ảnh chi tiết của 6 toa tàu (Ô Quan Chưởng, Ô Cầu Dền, Ô Đống Mác, Ô Chợ Dừa, Toa Check-in, Ô Cầu Giấy).

---

## 🚀 CÁC TÍNH NĂNG ĐÃ NÂNG CẤP & TỐI ƯU

1. **Giữ nguyên 100% các section**:
   - `01. #hero`: Video nền cố định, tiêu đề, CTA, bảng đếm ngược ca tàu chạy trực tiếp.
   - `02. #proof`: Dải logo báo chí lớn (VTV, VnExpress, Tuổi Trẻ, Thanh Niên...).
   - `03. #vi-sao`: 6 lý do trải nghiệm độc quyền với hiệu ứng hover kính mờ.
   - `04. #hanh-trinh`: **Đã chuyển đổi hoàn toàn sang bố cục hàng ngang (Horizontal Layout)** trên PC với đường ray tương tác và đầu tàu `🚂` di chuyển ngang qua 4 trạm dừng.
   - `05. #toa`: Khám phá chi tiết 6 toa tàu mang tên các cửa ô lịch sử kèm thư viện ảnh phóng to (Lightbox).
   - `06. #gia-ve`: Bảng 3 hạng vé (Phổ Thông, Premium, VIP) kèm **Form Đặt Vé Google Sheet**.
   - `07. #lich`: Lịch khởi hành tháng trực quan, hiển thị ngày chạy Thứ 6, Thứ 7, Chủ Nhật.
   - `08. #uu-dai`: Chính sách ưu đãi cho trẻ em, người cao tuổi, cựu chiến binh...
   - `09. #anh`: Thư viện ảnh khoảnh khắc đường ray (Masonry gallery).
   - `10. #bao-chi`: Đánh giá từ các đơn vị truyền thông báo chí lớn.
   - `11. #final`: Lời kêu gọi hành động cuối trang và Footer thông tin liên hệ.

2. **Bố cục PC tối ưu ngang**:
   - Khung giao diện mở rộng tới 1360px cho trải nghiệm panoramic trên desktop.
   - Phần Hero hiển thị 2 cột ngang cân đối (Thông tin bên trái + Bảng đếm ngược bên phải), không bị kéo dài dọc.

3. **Cập nhật link đặt vé chính thức**:
   - Toàn bộ nút "Đặt vé ngay" liên kết trực tiếp tới: `https://booking.hanoitrain.vn/?refCode=quayve5cuao`.

4. **Tích hợp Form đặt vé Google Sheet**:
   - Form đặt vé trực tiếp trên website (Họ tên, SĐT, Email, Ngày đi, Ca chạy, Hạng vé, Số lượng, Ghi chú).
   - Dữ liệu gửi bất đồng bộ qua Google Apps Script Webhook không lo bị chặn CORS.
