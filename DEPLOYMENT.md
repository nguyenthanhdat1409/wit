# 🚀 Hướng Dẫn Deployment - HappyMarketDocs

## 📋 Tổng Quan

Dự án HappyMarketDocs sử dụng **Netlify** cho cả local development và production deployment, giúp đồng bộ môi trường và tự động hóa hoàn toàn.

### ✨ Tính Năng Chính

- ✅ **Auto-deploy** khi push code lên Git
- ✅ **Netlify Functions** cho API endpoints
- ✅ **Local development** giống production với `netlify dev`
- ✅ **Tự động commit & push** (chỉ local)
- ✅ **KHÔNG cần start server thủ công**

---

## 🏗️ Kiến Trúc

### Local Development
```
┌─────────────────────────────────────┐
│        Netlify Dev (Port 8888)      │
│  ┌──────────────┐  ┌─────────────┐  │
│  │ Hugo Server  │  │   Netlify   │  │
│  │ (Port 1313)  │  │  Functions  │  │
│  └──────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

### Production (Netlify)
```
┌─────────────────────────────────────┐
│           Netlify CDN               │
│  ┌──────────────┐  ┌─────────────┐  │
│  │ Static Files │  │   Netlify   │  │
│  │   (Hugo)     │  │  Functions  │  │
│  └──────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

---

## 🛠️ Cài Đặt Local Development

### 1️⃣ Cài Đặt Dependencies

```bash
# Clone repository
git clone <repository-url>
cd HappyMarketDocs-main

# Cài đặt Node.js dependencies
npm install

# Cài đặt Netlify CLI (global)
npm install -g netlify-cli
```

### 2️⃣ Cài Đặt Hugo

**Windows (Chocolatey):**
```powershell
choco install hugo-extended
```

**macOS (Homebrew):**
```bash
brew install hugo
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install hugo
```

### 3️⃣ Chạy Local Development

**Cách 1: Sử dụng Netlify Dev (Khuyến nghị)**
```bash
npm start
# hoặc
npm run dev
# hoặc
netlify dev
```

Server sẽ chạy trên:
- 🌐 **Main site**: http://localhost:8888
- 🔧 **Hugo server**: http://localhost:1313 (internal)
- ⚡ **Netlify Functions**: http://localhost:8888/.netlify/functions/

**Cách 2: Sử dụng Simple Server (Backup)**
```bash
npm run dev:simple
```

---

## 📦 API Endpoints

### Local Development
- **Create Vocabulary**: `http://localhost:8888/.netlify/functions/create-vocabulary`
- **Update Vocabulary**: `http://localhost:8888/.netlify/functions/update-vocabulary`
- **Get Vocabulary**: `http://localhost:8888/.netlify/functions/get-vocabulary/{slug}`
- **Create Diagram**: `http://localhost:8888/.netlify/functions/create-diagram`
- **Create Lesson**: `http://localhost:8888/.netlify/functions/create-lesson`

### Production
- **Create Vocabulary**: `https://your-site.netlify.app/.netlify/functions/create-vocabulary`
- **Update Vocabulary**: `https://your-site.netlify.app/.netlify/functions/update-vocabulary`
- **Get Vocabulary**: `https://your-site.netlify.app/.netlify/functions/get-vocabulary/{slug}`
- **Create Diagram**: `https://your-site.netlify.app/.netlify/functions/create-diagram`
- **Create Lesson**: `https://your-site.netlify.app/.netlify/functions/create-lesson`

---

## 🚀 Deployment

### 🔵 Netlify (Khuyến Nghị)

#### Lần Đầu Setup

1. **Tạo Tài Khoản Netlify**
   - Truy cập: https://app.netlify.com/signup
   - Đăng nhập bằng GitHub

2. **Kết Nối Repository**
   - Click "New site from Git"
   - Chọn GitHub repository
   - Chọn branch: `main` hoặc `master`

3. **Cấu Hình Build Settings**
   ```
   Build command: hugo --gc --minify
   Publish directory: public
   ```

4. **Environment Variables**
   ```
   HUGO_VERSION = 0.100.0
   HUGO_ENV = production
   HUGO_ENABLEGITINFO = true
   ```

5. **Deploy**
   - Click "Deploy site"
   - Đợi build hoàn tất (~2-3 phút)

#### Auto-Deploy Sau Đó

```bash
# 1. Thực hiện thay đổi code
git add .
git commit -m "feat: your changes"
git push origin main

# 2. Netlify tự động:
#    - Detect push event
#    - Run build command
#    - Deploy to CDN
#    - Live trong ~2-3 phút
```

---

## 🔄 Git Workflow

### Local Development

```bash
# 1. Tạo/Sửa nội dung qua Admin Panel
#    → Tự động commit & push (nếu chạy netlify dev)

# 2. Hoặc commit thủ công
git add .
git commit -m "feat: add new vocabulary"
git push origin main

# 3. Netlify tự động deploy
```

### Git Commands Tối Ưu

```bash
# Add changes
git add .

# Commit với message ngắn gọn
git commit -m "feat: add vocabulary X"

# Push lên remote
git push

# Nếu có conflict, resolve và merge
git pull --rebase
# Fix conflicts
git add .
git rebase --continue
git push
```

---

## 🔧 Netlify Functions

### Cách Hoạt Động

**Local Development:**
```javascript
// Auto-detect endpoint
const apiUrl = getApiEndpoint('/create-vocabulary');
// Returns: http://localhost:8888/.netlify/functions/create-vocabulary

fetch(apiUrl, {
  method: 'POST',
  body: JSON.stringify(data)
});
```

**Production:**
```javascript
// Auto-detect endpoint
const apiUrl = getApiEndpoint('/create-vocabulary');
// Returns: /.netlify/functions/create-vocabulary

fetch(apiUrl, {
  method: 'POST',
  body: JSON.stringify(data)
});
```

### Danh Sách Functions

1. **create-vocabulary.js** - Tạo từ vựng mới
2. **update-vocabulary.js** - Cập nhật từ vựng
3. **get-vocabulary.js** - Lấy thông tin từ vựng
4. **create-diagram.js** - Tạo đồ hình
5. **create-lesson.js** - Tạo bài học

---

## ⚠️ Lưu Ý Quan Trọng

### Local vs Production

| Tính Năng | Local (netlify dev) | Production (Netlify) |
|-----------|---------------------|----------------------|
| Ghi file trực tiếp | ✅ Có | ❌ Không |
| Auto commit & push | ✅ Có | ❌ Không |
| Netlify Functions | ✅ Có | ✅ Có |
| Hugo rebuild | ✅ Tự động | ✅ Tự động |

### Production Limitations

⚠️ **Trên Production (Netlify), KHÔNG THỂ ghi file trực tiếp vào Git repository!**

**Giải pháp:**

1. **Sử dụng Local Development** (Khuyến nghị)
   ```bash
   npm start
   # Truy cập: http://localhost:8888/admin/
   # Tạo nội dung → Tự động commit & push → Netlify auto-deploy
   ```

2. **Sử dụng GitHub Actions** (Advanced)
   - Tạo GitHub Action để commit file từ Netlify Function
   - Trigger deployment sau khi commit

3. **Manual Commit** (Backup)
   - Copy nội dung từ console log
   - Tạo file thủ công
   - Commit & push

---

## 🐛 Troubleshooting

### 1. Error: "Cannot connect to API"

**Nguyên nhân:** Netlify Dev chưa chạy hoặc chạy sai port

**Giải pháp:**
```bash
# Stop tất cả processes
# Chạy lại:
npm start

# Kiểm tra:
# ✅ Browser: http://localhost:8888
# ✅ Functions: http://localhost:8888/.netlify/functions/
```

### 2. Error: "Từ vựng đã tồn tại"

**Nguyên nhân:** File đã tồn tại trong `content/TU-KHAINIEM/`

**Giải pháp:**
```bash
# Xóa folder cũ hoặc đổi tên
rm -rf content/TU-KHAINIEM/slug-name/
# Hoặc đặt tên khác cho từ vựng mới
```

### 3. Error: "Hugo build failed"

**Nguyên nhân:** Hugo version không đúng hoặc content lỗi

**Giải pháp:**
```bash
# Kiểm tra Hugo version
hugo version
# Phải >= 0.100.0

# Test build local
hugo --gc --minify

# Fix lỗi content nếu có
```

### 4. Error: "Git push failed"

**Nguyên nhân:** Conflict hoặc không có quyền push

**Giải pháp:**
```bash
# Pull latest changes
git pull --rebase

# Resolve conflicts nếu có
git add .
git rebase --continue

# Push lại
git push
```

---

## 📊 Monitoring & Logs

### Netlify Dashboard

1. **Deploy Logs**
   - Truy cập: https://app.netlify.com/sites/your-site/deploys
   - Xem build logs, errors

2. **Function Logs**
   - Truy cập: https://app.netlify.com/sites/your-site/functions
   - Xem function execution logs

3. **Analytics**
   - Truy cập: https://app.netlify.com/sites/your-site/analytics
   - Xem traffic, performance

### Local Logs

```bash
# Netlify Dev logs
npm start
# → Xem terminal output

# Hugo logs
hugo server -D --verbose
# → Xem detailed build logs
```

---

## 🎯 Best Practices

### 1. Development Workflow

✅ **DO:**
- Luôn dùng `npm start` cho local development
- Test kỹ trên local trước khi push
- Commit message rõ ràng, ngắn gọn
- Push thường xuyên để tránh conflict

❌ **DON'T:**
- Không edit file trực tiếp trên production
- Không force push (--force) trừ khi cần thiết
- Không commit file build (public/, resources/)

### 2. Git Commit Messages

```bash
# Format: <type>: <description>

# Types:
feat: add new vocabulary "X"
fix: fix broken link in Y
docs: update README
style: format code
refactor: restructure vocabulary system
test: add tests for API
chore: update dependencies
```

### 3. Performance

- ✅ Optimize images trước khi upload
- ✅ Minify CSS/JS khi build
- ✅ Sử dụng CDN cho static files
- ✅ Enable caching headers

---

## 🔗 Links Hữu Ích

- 📚 [Hugo Documentation](https://gohugo.io/documentation/)
- 🌐 [Netlify Docs](https://docs.netlify.com/)
- ⚡ [Netlify Functions](https://docs.netlify.com/functions/overview/)
- 🛠️ [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- 🎓 [Git Basics](https://git-scm.com/book/en/v2)

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check Logs:**
   - Terminal output
   - Browser console
   - Netlify dashboard logs

2. **Search Issues:**
   - GitHub repository issues
   - Netlify community forum

3. **Contact:**
   - Email: support@happymarketdocs.com
   - GitHub Issues: [Create Issue](https://github.com/your-repo/issues)

---

**Happy Deploying! 🚀**

