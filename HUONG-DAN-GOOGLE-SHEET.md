# HƯỚNG DẪN KẾT NỐI FORM ĐẶT VÉ VỚI GOOGLE SHEET

Tài liệu này hướng dẫn bạn cách thiết lập để dữ liệu khi khách hàng điền vào **Form đặt vé** trên website sẽ tự động nhảy về file **Google Sheet** của bạn theo thời gian thực (real-time).

---

## BƯỚC 1: TẠO FILE GOOGLE SHEET MỚI
1. Truy cập [Google Sheets (Trang tính)](https://sheets.google.com) và tạo một bảng tính mới.
2. Đổi tên file bảng tính thành: `Du-Lieu-Dat-Ve-The-Hanoi-Train`.
3. Đổi tên Sheet (tab bên dưới) thành `DanhSachDatVe` (hoặc để mặc định, hệ thống sẽ tự nhận).

---

## BƯỚC 2: DÁN MÃ GOOGLE APPS SCRIPT
1. Trên menu trên cùng của Google Sheet, bấm vào: **Tiện ích mở rộng** (Extensions) ➔ **Apps Script**.
2. Một tab trình duyệt mới sẽ mở ra với giao diện lập trình Apps Script.
3. Xóa hết toàn bộ nội dung mặc định (`function myFunction() { ... }`).
4. Mở file [google-apps-script.js](google-apps-script.js) trong thư mục này, **copy toàn bộ nội dung** và dán vào cửa sổ Apps Script.
5. Bấm vào icon **💾 Save** (Lưu dự án) hoặc nhấn phím tắt `Ctrl + S`.

---

## BƯỚC 3: TRIỂN KHAI ỨNG DỤNG WEB (DEPLOY WEB APP)
1. Ở góc trên cùng bên phải của giao diện Apps Script, bấm vào nút màu xanh **Triển khai** (Deploy) ➔ Chọn **Tùy chọn triển khai mới** (New deployment).
2. Ở mục **Chọn loại** (hình bánh răng ⚙️ bên trái), chọn **Ứng dụng web** (Web app).
3. Điền các trường thông tin như sau:
   - **Mô tả** (Description): `Webhook đặt vé Hanoi Train`
   - **Thực thi dưới dạng** (Execute as): `Tôi` (Me - địa chỉ email của bạn)
   - **Ai có quyền truy cập** (Who has access): Chọn **Bất kỳ ai** (`Anyone`) *(⚠️ RẤT QUAN TRỌNG: Phải chọn mục này thì website mới gửi dữ liệu vào Sheet được mà không bị chặn xác thực)*.
4. Bấm nút **Triển khai** (Deploy).
5. Nếu Google hiển thị bảng thông báo yêu cầu cấp quyền:
   - Bấm **Ủy quyền truy cập** (Authorize access).
   - Chọn tài khoản Google của bạn.
   - Nếu có cảnh báo *"Google chưa xác minh ứng dụng này"*, bấm vào **Nâng cao** (Advanced) ➔ Bấm vào **Đi tới [Tên dự án] (không an toàn)**.
   - Bấm nút **Cho phép** (Allow).
6. Sau khi hoàn tất, Google sẽ cung cấp cho bạn một **URL ứng dụng web** (Web App URL) có dạng:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
7. Bấm **Sao chép** (Copy) đường link URL này.

---

## BƯỚC 4: DÁN URL VÀO WEBSITE
1. Mở file `index(1).html` (hoặc `index.html`).
2. Tìm đến dòng có biến `GOOGLE_SHEET_URL` ở phần `<script>` (gần cuối file):
   ```javascript
   // Thay đường dẫn URL Apps Script của bạn vào đây:
   const GOOGLE_SHEET_URL = "DÁN_URL_APPS_SCRIPT_CỦA_BẠN_VÀO_ĐÂY";
   ```
3. Thay thế chuỗi bằng đường link URL bạn vừa sao chép ở Bước 3.
4. Lưu file lại.

---

## BƯỚC 5: KIỂM TRA THỬ NGHIỆM
1. Mở website lên bằng trình duyệt.
2. Kéo đến phần **Form Đặt Vé** hoặc bấm nút **Đặt vé qua Form**.
3. Điền thông tin thử nghiệm (Họ tên, SĐT, Email, ngày đi, số lượng...) và bấm **XÁC NHẬN ĐẶT VÉ**.
4. Mở lại Google Sheet: Bạn sẽ thấy ngay một dòng thông tin mới xuất hiện với đầy đủ cột ngày giờ, số điện thoại, hạng vé...
