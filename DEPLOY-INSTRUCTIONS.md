# 🚀 Hướng Dẫn Deploy HappyMarketDocs

## ⚡ Cách Nhanh Nhất

**Mở Command Prompt hoặc PowerShell và chạy:**

```cmd
cd "C:\Users\028.36383838 ext 2\Downloads\HappyMarketDocs-main"
npm run deploy
```

## 🔧 Các Cách Khác

### Cách 1: Sử dụng script có sẵn
```cmd
deploy-direct-netlify.bat
```

### Cách 2: Chạy từng bước
```cmd
npm run build
netlify deploy --prod --dir=public
```

### Cách 3: Sử dụng script đơn giản
```cmd
deploy-simple.bat
```

## 🔐 Nếu Chưa Login Netlify

```cmd
netlify login
```
- Browser sẽ mở để login
- Sau khi login xong, chạy lại deploy

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
   Nếu chưa có: Download từ https://nodejs.org/

3. **Netlify CLI:**
   ```cmd
   netlify --version
   ```
   Nếu chưa có: `npm install -g netlify-cli`

## 🎯 Kết Quả

Sau khi deploy thành công:
- ✅ Site live trên Netlify
- ✅ URL: `https://[random-name].netlify.app`
- ✅ Browser tự động mở

## 🌐 Custom Domain (Tùy chọn)

Nếu muốn dùng domain `wikiw.vn`:
1. Vào Netlify dashboard
2. Site settings → Domain management
3. Add custom domain: `wikiw.vn`
4. Cấu hình DNS theo hướng dẫn

## 🆘 Troubleshooting

### Build Failed
```cmd
hugo --gc --minify --verbose
```

### Deploy Failed
```cmd
netlify status
netlify login
```

### Git Issues
```cmd
git add .
git commit -m "deploy update"
git push
```

---

## 🎉 Hoàn Thành!

Chạy lệnh này để deploy:
```cmd
npm run deploy
```

**Chúc bạn deploy thành công! 🚀**
