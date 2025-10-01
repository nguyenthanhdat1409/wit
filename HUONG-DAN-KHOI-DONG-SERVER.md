# 🚀 HƯỚNG DẪN KHỞI ĐỘNG SERVER API

## ⚠️ QUAN TRỌNG

Trước khi sử dụng form "Tạo Đồ Hình", bạn **BẮT BUỘC** phải khởi động API Server!

---

## 📋 Các bước thực hiện

### Bước 1: Khởi động Server

1. Mở **File Explorer**
2. Đi tới thư mục: `C:\Users\028.36383838 ext 2\Downloads\HappyMarketDocs-main`
3. **Double-click** vào file **`RUN-API-SERVER.bat`**
4. Một cửa sổ Command Prompt màu xanh lá sẽ hiện ra
5. Đợi cho đến khi thấy dòng:
   ```
   ✅ API Server đã khởi động thành công!
   📡 Listening on: http://localhost:3002
   ```
6. **GIỮ CỬA SỔ NÀY MỞ** (không đóng lại!)

### Bước 2: Kiểm tra Server

Mở trình duyệt và truy cập: **http://localhost:3002/api/health**

- Nếu thấy: `{"status":"OK","port":3002}` → ✅ Server đang chạy
- Nếu không load được → ❌ Server chưa chạy, quay lại Bước 1

### Bước 3: Sử dụng Form

Bây giờ bạn có thể:
1. Mở form: **http://localhost:56230/admin/tao-do-hinh.html**
2. Điền thông tin hình ảnh
3. Bấm nút **"✈️ Tạo Đồ Hình"** (màu xanh lá)

---

## 🔧 Xử lý lỗi

### Lỗi: `ERR_CONNECTION_REFUSED`

**Nguyên nhân:** Server chưa chạy hoặc đã bị tắt

**Giải pháp:**
1. Kiểm tra cửa sổ Command Prompt có còn mở không
2. Nếu đã đóng, chạy lại file `RUN-API-SERVER.bat`
3. Đợi server khởi động xong (thấy dòng "✅ API Server đã khởi động thành công!")
4. Thử lại form

### Lỗi: `Port already in use`

**Nguyên nhân:** Port 3002 đã được sử dụng bởi process khác

**Giải pháp:**
1. Tìm và tắt process đang dùng port 3002
2. Hoặc thay đổi port trong file `simple-api-server.js`

### Lỗi: `node: command not found`

**Nguyên nhân:** Node.js chưa được cài đặt

**Giải pháp:**
1. Tải và cài đặt Node.js từ: https://nodejs.org/
2. Chọn phiên bản LTS (Long Term Support)
3. Khởi động lại máy tính
4. Chạy lại `RUN-API-SERVER.bat`

---

## 📝 Lưu ý

- Server phải **LUÔN CHẠY** khi bạn sử dụng form tạo đồ hình
- Nếu đóng cửa sổ Command Prompt, server sẽ bị tắt
- Để dừng server, bấm `Ctrl + C` trong cửa sổ Command Prompt

---

## ✅ Checklist trước khi sử dụng

- [ ] Đã cài đặt Node.js
- [ ] Đã chạy file `RUN-API-SERVER.bat`
- [ ] Cửa sổ Command Prompt vẫn đang mở
- [ ] Đã test endpoint: http://localhost:3002/api/health
- [ ] Thấy message: `{"status":"OK","port":3002}`

Nếu tất cả đều ✅, bạn có thể sử dụng form tạo đồ hình!

---

**Chúc bạn thành công! 🎉**

