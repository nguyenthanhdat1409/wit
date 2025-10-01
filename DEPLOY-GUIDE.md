# Hướng Dẫn Deploy Tự Động

## Tóm Tắt

Hệ thống đã được cấu hình để **tự động deploy** khi tạo từ vựng mới qua Admin Panel.

---

## Cách Hoạt Động

### 1. Tạo Từ Vựng Mới
- Truy cập Admin Panel: `http://localhost:1313/admin/tao-tu-vung-khai-niem.html`
- Nhập thông tin và tạo từ vựng

### 2. Quy Trình Tự Động
1. ✅ **Tạo file** từ vựng trong `content/TU-KHAINIEM/[slug]/_index.md`
2. ✅ **Hugo rebuild** tự động
3. ✅ **Git commit** với message: `feat: add vocabulary "Tên từ vựng"`
4. ✅ **Git push** lên repository
5. ✅ **Auto-deploy** (Netlify/Vercel) sẽ tự động build và deploy

### 3. Bảng Tự Động Cập Nhật
- Hugo Shortcode `{{< vocabulary-table >}}` sẽ tự động:
  - Đọc tất cả từ vựng mới
  - Tạo bảng với 2 cột: Tên từ vựng (có link) | 10 ký tự đầu + "..."
  - Sắp xếp theo tên từ vựng
  - Có phân trang tự động

---

## Cấu Hình Deploy

### Netlify
```yaml
# netlify.toml
[build]
  command = "hugo --gc --minify"
  publish = "public"

[[redirects]]
  from = "/admin/*"
  to = "/admin/:splat"
  status = 200
```

### Vercel
```json
{
  "buildCommand": "hugo --gc --minify",
  "outputDirectory": "public",
  "installCommand": "npm install"
}
```

---

## Lợi Ích

### ✅ Tự Động Hoàn Toàn
- Không cần chỉnh sửa bảng thủ công
- Không cần commit/push thủ công
- Không cần deploy thủ công

### ✅ Luôn Cập Nhật
- Bảng tự động cập nhật khi có từ vựng mới
- Deploy tự động khi có thay đổi
- Không bị lỗi do quên cập nhật

### ✅ Dễ Bảo Trì
- Chỉ cần tạo từ vựng qua Admin Panel
- Mọi thứ khác tự động
- Có thể deploy từ bất kỳ đâu

---

## Kiểm Tra Deploy

### 1. Local Development
```bash
# Khởi động API server
node simple-server.js

# Khởi động Hugo server
hugo server -D
```

### 2. Production Deploy
- Tạo từ vựng qua Admin Panel
- Kiểm tra log trong terminal
- Kiểm tra website sau 2-3 phút

### 3. Debug
- Xem log API server để kiểm tra quá trình
- Xem log deploy platform (Netlify/Vercel)
- Kiểm tra Git repository để xem commit

---

## Lưu Ý

- **API Server** phải chạy để tạo từ vựng
- **Git** phải được cấu hình với remote repository
- **Deploy platform** phải được kết nối với repository
- **Hugo Shortcode** sẽ tự động cập nhật bảng
