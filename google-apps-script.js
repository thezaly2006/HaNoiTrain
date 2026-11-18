/**
 * ============================================================================
 * WEBHOOK GOOGLE APPS SCRIPT CHO FORM ĐẶT VÉ "THE HANOI TRAIN"
 * ============================================================================
 * Hướng dẫn sử dụng:
 * 1. Mở Google Sheet (Trang tính Google) của bạn.
 * 2. Bấm Menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa code cũ, dán toàn bộ đoạn code này vào.
 * 4. Bấm "💾 Lưu" (Save).
 * 5. Bấm nút màu xanh "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment).
 *    - Loại: Chọn "Ứng dụng web" (Web App)
 *    - Mô tả: "Webhook Hanoi Train Booking"
 *    - Thực thi dưới dạng: "Tôi" (Me)
 *    - Ai có quyền truy cập: "Bất kỳ ai" (Anyone) -> RẤT QUAN TRỌNG!
 * 6. Bấm "Triển khai", cấp quyền truy cập tài khoản Google.
 * 7. Copy link Web App URL dán vào biến GOOGLE_SHEET_URL trong file index.html.
 */

// Hàm kiểm tra trạng thái hoạt động (mở link trực tiếp trên trình duyệt để test)
function doGet(e) {
  return ContentService.createTextOutput("Webhook Tàu Hà Nội 5 Cửa Ô đang hoạt động bình thường!")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Hàm tiếp nhận dữ liệu đặt vé khi khách bấm gửi từ website
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Khóa tránh xung đột khi có nhiều khách gửi cùng lúc

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Nếu trang tính chưa có tiêu đề cột thì tự động tạo dòng tiêu đề chuẩn
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Thời Gian Gửi",
        "Họ và Tên",
        "Số Điện Thoại",
        "Email",
        "Ngày Khởi Hành",
        "Ca Khởi Hành",
        "Hạng Vé",
        "Số Lượng Vé",
        "Ghi Chú / Yêu Cầu",
        "Trạng Thái Xử Lý"
      ];
      sheet.appendRow(headers);
      
      // Định dạng dòng tiêu đề đẹp mắt
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#8E1F2F"); // Màu đỏ đô Indochine
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 35);
      sheet.setFrozenRows(1);
    }

    // Đọc dữ liệu JSON gửi từ website
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var timeStamp = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    var name = data.name || "";
    var phone = "'" + (data.phone || ""); // Thêm dấu ' để Google Sheet không làm mất số 0 đầu
    var email = data.email || "";
    var date = data.date || "";
    var shift = data.shift || "";
    var ticketType = data.ticketType || "";
    var quantity = data.quantity || 1;
    var note = data.note || "";
    var status = "Chờ liên hệ"; // Mặc định để Admin/Sale tiện lọc chăm sóc

    // Thêm dòng dữ liệu mới vào bảng tính
    sheet.appendRow([
      timeStamp,
      name,
      phone,
      email,
      date,
      shift,
      ticketType,
      quantity,
      note,
      status
    ]);

    // Định dạng dòng vừa thêm cho gọn gàng, căn giữa các cột ngày giờ, sđt, số lượng
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center"); // Thời gian gửi
    sheet.getRange(lastRow, 3).setHorizontalAlignment("center"); // SĐT
    sheet.getRange(lastRow, 5).setHorizontalAlignment("center"); // Ngày khởi hành
    sheet.getRange(lastRow, 6).setHorizontalAlignment("center"); // Ca chạy
    sheet.getRange(lastRow, 8).setHorizontalAlignment("center"); // Số lượng
    sheet.getRange(lastRow, 10).setHorizontalAlignment("center")  // Trạng thái
         .setBackground("#FFF3CD") // Màu vàng nhạt nổi bật
         .setFontWeight("bold");

    return ContentService.createTextOutput(JSON.stringify({ status: "success", row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
