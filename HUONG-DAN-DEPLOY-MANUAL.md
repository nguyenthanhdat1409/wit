# 🚀 Hướng Dẫn Deploy Manual - HappyMarketDocs

## 📋 Tổng Quan

Do terminal không hoạt động trong môi trường hiện tại, bạn cần thực hiện deploy thủ công theo các bước sau:

## 🛠️ Các Bước Thực Hiện

### 1️⃣ Mở Command Prompt hoặc PowerShell

1. **Windows**: Nhấn `Win + R`, gõ `cmd` hoặc `powershell`
2. **Điều hướng** đến thư mục dự án:
   ```cmd
   cd "C:\Users\028.36383838 ext 2\Downloads\HappyMarketDocs-main"
   ```

### 2️⃣ Commit Git Changes (Nếu cần)

```cmd
git add .
git commit -m "fix: update content before deployment"
git push
```

### 3️⃣ Chạy Script Deploy

**Cách 1: Sử dụng script có sẵn**
```cmd
deploy-direct-netlify.bat
```

**Cách 2: Chạy từng bước thủ công**
```cmd
REM Clean previous build
if exist public rmdir /s /q public
if exist resources rmdir /s /q resources

REM Install dependencies
npm install

REM Build Hugo site
hugo --gc --minify

REM Deploy to Netlify
netlify deploy --prod --dir=public --open
```

### 4️⃣ Nếu Chưa Login Netlify

```cmd
netlify login
```
- Sẽ mở browser để login
- Sau khi login xong, quay lại chạy deploy

## 🎯 Kết Quả Mong Đợi

Sau khi deploy thành công:
- ✅ Site sẽ live trên Netlify
- ✅ Browser sẽ tự động mở trang web
- ✅ URL sẽ có dạng: `https://[random-name].netlify.app`

## 🔧 Troubleshooting

### Nếu Hugo không tìm thấy:
```cmd
choco install hugo-extended
```

### Nếu Node.js không tìm thấy:
- Download từ: https://nodejs.org/
- Cài đặt và restart terminal

### Nếu Netlify CLI không tìm thấy:
```cmd
npm install -g netlify-cli
```

### Nếu Build Failed:
```cmd
REM Kiểm tra Hugo version
hugo version

REM Test build
hugo --gc --minify --verbose
```

## 📱 Sau Khi Deploy

1. **Kiểm tra site**: Truy cập URL được cung cấp
2. **Test các tính năng**: Admin panel, API endpoints
3. **Custom domain** (nếu cần): Setup trong Netlify dashboard

## 🎉 Hoàn Thành!

Sau khi deploy thành công, site sẽ được host trên Netlify với:
- ✅ Auto-deployment khi push code
- ✅ CDN global
- ✅ SSL certificate tự động
- ✅ Netlify Functions cho API

---

**Lưu ý**: Nếu gặp lỗi, hãy copy error message và tôi sẽ hỗ trợ troubleshoot!
