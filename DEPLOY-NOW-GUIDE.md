# 🚀 Hướng Dẫn Deploy Ngay - HappyMarketDocs

## ⚡ Deploy Nhanh Nhất

**Mở Command Prompt hoặc PowerShell và chạy:**

```cmd
cd "C:\Users\028.36383838 ext 2\Downloads\HappyMarketDocs-main"

# Build Hugo
hugo --gc --minify

# Deploy lên Netlify
netlify deploy --prod --dir=public
```

## 🔧 Các Cách Khác

### Cách 1: Sử dụng script có sẵn
```cmd
deploy-direct-netlify.bat
```

### Cách 2: Build + Deploy riêng
```cmd
# Build trước
build-now.bat

# Sau đó deploy
netlify deploy --prod --dir=public
```

### Cách 3: Sử dụng npm scripts
```cmd
npm run deploy
```

## 🌐 Deploy Lên Project Có Sẵn

### Nếu đã có project trên Netlify:

1. **Login Netlify:**
   ```cmd
   netlify login
   ```

2. **Link với project có sẵn:**
   ```cmd
   netlify link
   ```
   - Chọn project `wikiw` hoặc `wiki.vn`

3. **Deploy:**
   ```cmd
   netlify deploy --prod --dir=public
   ```

### Nếu chưa có project:

1. **Tạo project mới:**
   ```cmd
   netlify init
   ```

2. **Hoặc deploy trực tiếp:**
   ```cmd
   netlify deploy --prod --dir=public --site=your-site-name
   ```

## 📋 Kiểm Tra Trước Khi Deploy

1. **Hugo đã cài đặt:**
   ```cmd
   hugo version
   ```
   Nếu chưa có: `choco install hugo-extended`

2. **Node.js đã cài đặt:**
   ```cmd
   node --version
   ```

3. **Netlify CLI:**
   ```cmd
   netlify --version
   ```
   Nếu chưa có: `npm install -g netlify-cli`

## 🎯 Kết Quả

Sau khi deploy thành công:
- ✅ Site live trên Netlify
- ✅ URL: `https://your-site.netlify.app` hoặc custom domain
- ✅ Browser tự động mở trang web

## 🔐 Nếu Chưa Login Netlify

```cmd
netlify login
```
- Browser sẽ mở để login
- Sau khi login xong, chạy lại deploy

## 🆘 Troubleshooting

### Build Failed
```cmd
# Kiểm tra Hugo
hugo version

# Test build
hugo --gc --minify --verbose
```

### Deploy Failed
```cmd
# Kiểm tra login status
netlify status

# Login lại nếu cần
netlify login
```

### Git Issues
```cmd
git add .
git commit -m "deploy update"
git push
```

## 🎉 Hoàn Thành!

**Chạy lệnh này để deploy:**
```cmd
netlify deploy --prod --dir=public
```

**Chúc bạn deploy thành công! 🚀**
