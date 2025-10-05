# Hướng Dẫn Setup Auto-Deploy cho wikiw.vn

## 🎯 Mục tiêu
Thiết lập auto-deployment từ Git repository `https://github.com/nguyenthanhdat1409/wit.git` lên Netlify project `wikiw.vn` tại [https://app.netlify.com/projects/wikiw/configuration/general#project-details](https://app.netlify.com/projects/wikiw/configuration/general#project-details)

## ✅ Bước 1: Code đã được push lên Git
- ✅ Repository: `https://github.com/nguyenthanhdat1409/wit.git`
- ✅ Branch: `main`
- ✅ Latest commit: `d9d4229a` (Fix Netlify CLI deployment issue)

## 🔗 Bước 2: Kết nối Netlify với Git Repository

### Truy cập Netlify Dashboard:
1. Mở: [https://app.netlify.com/projects/wikiw/configuration/general#project-details](https://app.netlify.com/projects/wikiw/configuration/general#project-details)
2. Đăng nhập vào tài khoản Netlify

### Thiết lập Git Integration:
1. **Vào tab "Build & deploy"** (hoặc "Deploy settings")
2. **Chọn "Link repository"** hoặc **"Connect to Git"**
3. **Chọn GitHub** làm Git provider
4. **Authorize Netlify** truy cập GitHub (nếu chưa)
5. **Chọn repository**: `nguyenthanhdat1409/wit`
6. **Chọn branch**: `main`

## ⚙️ Bước 3: Cấu hình Build Settings

### Build Settings cho Hugo:
```yaml
Build command: hugo --gc --minify
Publish directory: public
```

### Environment Variables:
```yaml
HUGO_VERSION: 0.150.0
HUGO_ENV: production
HUGO_ENABLEGITINFO: true
```

### Advanced Build Settings:
- **Base directory**: `/` (root)
- **Functions directory**: `netlify/functions`
- **Build hooks**: Có thể tạo để trigger manual build

## 🚀 Bước 4: Deploy Settings

### Deploy Preferences:
- **Branch deploys**: Enable (để test trên branch khác)
- **Deploy previews**: Enable (để preview PR)
- **Production branch**: `main`

### Headers & Redirects:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 📋 Bước 5: Test Auto-Deployment

### Trigger Deploy:
1. **Automatic**: Push code lên GitHub sẽ tự động trigger
2. **Manual**: Click "Trigger deploy" trong Netlify dashboard
3. **Build Hook**: Sử dụng webhook URL để trigger từ external

### Script để test:
```bash
# Thay đổi nhỏ và push
echo "# Test auto-deploy $(date)" >> README.md
git add README.md
git commit -m "Test auto-deployment"
git push origin main
```

## 🔧 Bước 6: Custom Domain (nếu cần)

### Thiết lập Domain:
1. Vào **"Domain settings"**
2. **Add custom domain**: `wikiw.vn`
3. **Configure DNS**: Point về Netlify
4. **SSL Certificate**: Tự động được cấp

### DNS Configuration:
```
Type: CNAME
Name: www
Value: wikiw.netlify.app

Type: A
Name: @
Value: [Netlify IP]
```

## 📊 Bước 7: Monitoring & Analytics

### Deploy Status:
- **Deploy logs**: Xem trong Netlify dashboard
- **Build time**: Thường ~2-5 phút
- **Deploy notifications**: Email/Slack integration

### Performance:
- **CDN**: Tự động qua Netlify CDN
- **Caching**: Headers đã cấu hình
- **Compression**: Gzip/Brotli tự động

## 🎉 Kết quả mong đợi

Sau khi setup xong:
- ✅ **Auto-deploy** khi push code lên GitHub
- ✅ **Build time**: ~2-5 phút
- ✅ **Deploy URL**: `https://wikiw.netlify.app`
- ✅ **Custom domain**: `https://wikiw.vn` (nếu setup)
- ✅ **SSL**: Tự động HTTPS
- ✅ **CDN**: Global content delivery

## 🔄 Workflow sau này

### Development Workflow:
1. **Edit code** locally
2. **Test locally**: `hugo server`
3. **Commit & push**: `git push origin main`
4. **Auto-deploy**: Netlify tự động build & deploy
5. **Check result**: Truy cập website

### Scripts có sẵn:
```bash
# Quick deploy
.\commit-and-push.ps1

# Manual build test
.\deploy-manual.ps1
```

## 🆘 Troubleshooting

### Nếu build fail:
1. **Check logs** trong Netlify dashboard
2. **Verify Hugo version** trong environment variables
3. **Check file paths** trong repository
4. **Test locally**: `hugo --gc --minify`

### Nếu deploy không trigger:
1. **Check webhook** trong GitHub settings
2. **Verify branch** configuration
3. **Check permissions** giữa Netlify và GitHub

## 📞 Support

- **Netlify Docs**: https://docs.netlify.com/
- **Hugo on Netlify**: https://docs.netlify.com/integrations/frameworks/hugo/
- **Git Integration**: https://docs.netlify.com/site-deploys/create-deploys/#deploy-with-git

---

**🎊 Sau khi setup xong, bạn chỉ cần push code lên GitHub là website sẽ tự động deploy!**
