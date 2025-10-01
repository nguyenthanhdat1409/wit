# 🪟 Hướng Dẫn Khởi Động Nhanh - Windows

## 🚀 Cách Chạy Dự Án (3 Bước)

### 1️⃣ Mở Terminal

**Cách 1: PowerShell (Khuyến nghị)**
- Click chuột phải vào folder dự án
- Chọn "Open in Terminal" hoặc "Open PowerShell window here"

**Cách 2: Command Prompt**
- Nhấn `Win + R`
- Gõ `cmd`
- `cd` đến folder dự án

### 2️⃣ Chạy Lệnh

```powershell
npm start
```

**Lần đầu tiên?** Cài đặt trước:
```powershell
# Cài đặt dependencies
npm install

# Cài đặt Netlify CLI (chỉ 1 lần)
npm install -g netlify-cli
```

### 3️⃣ Mở Trình Duyệt

Truy cập: **http://localhost:8888**

**Admin Panel:** **http://localhost:8888/admin/**

---

## ✅ Hoàn Thành!

Server đang chạy. Bạn có thể:

- 📝 Tạo Từ vựng: `/admin/tao-tu-vung.html`
- 🖼️ Tạo Đồ hình: `/admin/tao-do-hinh.html`
- 📚 Tạo Bài học: `/admin/tao-bai-hoc.html`

**Khi nào muốn dừng:**
- Nhấn `Ctrl + C` trong terminal
- Đóng terminal window

---

## 🐛 Gặp Lỗi?

### Error: "npm not found"

**➡️ Cài đặt Node.js:**
1. Download: https://nodejs.org/
2. Chọn "LTS" version
3. Install với settings mặc định
4. Restart terminal
5. Thử lại `npm start`

### Error: "netlify not found"

**➡️ Cài đặt Netlify CLI:**
```powershell
npm install -g netlify-cli
```

### Error: "Hugo not found"

**➡️ Cài đặt Hugo:**
```powershell
# Sử dụng Chocolatey
choco install hugo-extended

# Hoặc download trực tiếp:
# https://github.com/gohugoio/hugo/releases
```

### Error: "Port 8888 already in use"

**➡️ Dừng process đang dùng port 8888:**
```powershell
# Tìm process
netstat -ano | findstr :8888

# Kill process (thay <PID> bằng số tìm được)
taskkill /PID <PID> /F
```

---

## 📖 Thêm Thông Tin

- **Full Documentation:** [README.md](README.md)
- **Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Chúc bạn làm việc hiệu quả! 🎉**

