# 🎨 HƯỚNG DẪN SỬ DỤNG FORM TẠO ĐỒ HÌNH

## ⚡ NHANH CHÓNG

1. **Khởi động server:** Double-click `RUN-API-SERVER.bat`
2. **Mở form:** http://localhost:58571/admin/tao-do-hinh.html
3. **Tạo đồ hình:** Điền thông tin → Bấm nút **✈️ Tạo Đồ Hình** (màu xanh lá)
4. **Xem kết quả:** Sau 10 giây sẽ tự động chuyển sang trang `/hinh/`

---

## 📋 CHI TIẾT TỪNG BƯỚC

### Bước 1: Khởi động API Server

**Windows:**
1. Mở File Explorer
2. Đi tới thư mục dự án: `C:\Users\028.36383838 ext 2\Downloads\HappyMarketDocs-main`
3. **Double-click** file **`RUN-API-SERVER.bat`**
4. Cửa sổ Command Prompt màu xanh lá sẽ hiện:
   ```
   ✅ API server running on http://localhost:3002
   🔗 Health check: http://localhost:3002/api/health
   📝 Create diagram: http://localhost:3002/api/create-diagram
   
   Server is ready to receive requests!
   ```
5. **GIỮ CỬA SỔ NÀY MỞ!** ⚠️

### Bước 2: Kiểm tra Server

Mở trình duyệt, truy cập: **http://localhost:3002/api/health**

- ✅ Thấy: `{"status":"OK"}` → Server OK
- ❌ Không load được → Server chưa chạy, quay lại Bước 1

### Bước 3: Mở Form Tạo Đồ Hình

Truy cập: **http://localhost:58571/admin/tao-do-hinh.html**

(Thay `58571` bằng port mà Hugo server đang chạy)

### Bước 4: Điền Thông Tin

1. **Link hình:** Nhập URL hình ảnh
   - VD: `http://convoi.com.vn/wp-content/uploads/2025/09/hinh119a.png`

2. **Tên hình:** Nhập tên mô tả
   - VD: `Bảy Sự Giàu Toàn Diện`

3. **Đường dẫn khái niệm:** (Tùy chọn) Link đến trang khái niệm
   - VD: `https://example.com/khai-niem`

4. **Đường dẫn bài học:** (Tùy chọn) Link đến trang bài học
   - VD: `https://example.com/bai-hoc`

### Bước 5: Tạo Đồ Hình

1. Bấm nút **"✈️ Tạo Đồ Hình"** (màu xanh lá)
2. Loading sẽ hiện lên (10 giây)
3. Sau 10 giây, tự động chuyển sang trang `/hinh/`

### Bước 6: Kiểm Tra Kết Quả

**Trong Console (F12):**

Bạn sẽ thấy các log sau:

```
🚀 [DEBUG] Sending request to API...
🚀 [DEBUG] Data: {imageTitle: '...', ...}
✅ [DEBUG] Success response: {...}
📊 [DEBUG] Response details: {success: true, ...}
🎉 [SUCCESS] Diagram created successfully!
📁 [DEBUG] File created at: content/HINH/[slug].md
🔗 [DEBUG] Will redirect to: /hinh/
```

**Trong Server Terminal:**

```
📝 [DEBUG] Creating file at: C:\...\content\HINH\[slug].md
✅ [SUCCESS] Created diagram file: ...
🔄 [DEBUG] Updating HINH index...
✅ [SUCCESS] Updated HINH index
🔨 [DEBUG] Triggering Hugo rebuild...
✅ [SUCCESS] Hugo rebuild completed
📤 [DEBUG] Sending response: {...}
```

**Trên trang /hinh/:**

- Đồ hình mới sẽ xuất hiện trong danh sách
- Có hình ảnh, tên, và 2 nút "Khái Niệm" và "Bài Học"

---

## 🔍 DEBUG VÀ XỬ LÝ LỖI

### Vấn đề: Không thấy đồ hình mới sau khi tạo

**Kiểm tra:**

1. **Xem Console (F12):**
   - Tìm dòng: `📁 [DEBUG] File created at: ...`
   - Kiểm tra file path có đúng không

2. **Xem Server Terminal:**
   - Tìm dòng: `✅ [SUCCESS] Created diagram file`
   - Tìm dòng: `✅ [SUCCESS] Updated HINH index`
   - Tìm dòng: `✅ [SUCCESS] Hugo rebuild completed`

3. **Kiểm tra file thực tế:**
   - Mở File Explorer
   - Đi tới: `content/HINH/`
   - Tìm file `.md` mới tạo (tên theo slug)

4. **Refresh trang /hinh/:**
   - Bấm F5 để refresh
   - Hoặc Ctrl + Shift + R (hard refresh)

5. **Kiểm tra Hugo server:**
   - Hugo server có đang chạy không?
   - Có thấy log rebuild không?

### Lỗi: `ERR_CONNECTION_REFUSED`

**Nguyên nhân:** Server chưa chạy

**Giải pháp:**
1. Kiểm tra cửa sổ Command Prompt có còn mở không
2. Chạy lại `RUN-API-SERVER.bat`
3. Đợi thấy "Server is ready to receive requests!"

### Lỗi: `404 Not Found`

**Nguyên nhân:** Endpoint không đúng hoặc server chạy sai port

**Giải pháp:**
1. Kiểm tra server đang chạy trên port **3002**
2. Kiểm tra form đang gọi API trên port **3002**
3. Restart server

### Lỗi: File được tạo nhưng không xuất hiện

**Nguyên nhân:** Hugo chưa rebuild

**Giải pháp:**
1. Kiểm tra Hugo server có đang chạy không
2. Restart Hugo server:
   ```bash
   hugo server -D
   ```
3. Chờ Hugo rebuild xong
4. Refresh trang /hinh/

---

## 📝 LƯU Ý QUAN TRỌNG

1. **Server phải luôn chạy** khi sử dụng form
2. **Hugo server phải chạy** để thấy kết quả
3. **Refresh trang** nếu không thấy đồ hình mới
4. **Kiểm tra console** (F12) để debug
5. **Kiểm tra server log** để biết tiến trình

---

## ✅ CHECKLIST

Trước khi tạo đồ hình, đảm bảo:

- [ ] API Server đang chạy (port 3002)
- [ ] Hugo server đang chạy
- [ ] Test endpoint: http://localhost:3002/api/health → OK
- [ ] Form đã load xong
- [ ] Đã mở Console (F12) để xem log
- [ ] Đã nhập đầy đủ thông tin

Sau khi tạo đồ hình:

- [ ] Console không có lỗi
- [ ] Server log hiện "SUCCESS"
- [ ] Đã chờ 10 giây
- [ ] Đã chuyển sang trang /hinh/
- [ ] Đã refresh trang
- [ ] Thấy đồ hình mới trong danh sách

---

## 🎯 TÓM TẮT

```
1. Double-click: RUN-API-SERVER.bat → Giữ cửa sổ mở
2. Test: http://localhost:3002/api/health → OK
3. Mở form: http://localhost:58571/admin/tao-do-hinh.html
4. Điền thông tin → Bấm ✈️ Tạo Đồ Hình
5. Xem Console (F12) → Thấy log SUCCESS
6. Xem Server → Thấy log file created
7. Chờ 10s → Tự động chuyển /hinh/
8. Refresh (F5) → Thấy đồ hình mới
```

---

**CHÚC BẠN THÀNH CÔNG! 🎉**


