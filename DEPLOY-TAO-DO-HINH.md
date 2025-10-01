# 🚀 Deploy Tính Năng Tạo Đồ Hình

## ⚠️ QUAN TRỌNG: Hiểu Về Môi Trường

### Local Development (Máy Tính)
- ✅ **API Server chạy**: `simple-server.js` trên port 3001
- ✅ **Tạo file tự động**: File `.md` được tạo trong `content/HINH/`
- ✅ **Auto commit & push**: Git tự động commit và push lên GitHub
- ✅ **Hugo rebuild**: Hugo tự động rebuild và hiển thị ngay
- ✅ **Thấy ngay kết quả**: Đồ hình xuất hiện trên trang `/hinh/`

### Production (Netlify)
- ❌ **Không có API Server**: Netlify là static hosting, không chạy Node.js server
- ⚠️ **Netlify Function**: Chỉ tạo nội dung, KHÔNG ghi file
- ⚠️ **Cần commit thủ công**: Phải tạo PR hoặc commit trực tiếp vào GitHub
- ⚠️ **Netlify auto deploy**: Sau khi commit, Netlify tự động rebuild

---

## 🔄 Luồng Hoạt Động

### A. Local Development (Khuyến nghị)

```
1. User điền form → Bấm "Tạo Đồ Hình"
2. Form gọi API: http://localhost:3001/api/create-diagram
3. Server tạo file: content/HINH/[slug].md
4. Server cập nhật: content/HINH/_index.md
5. Server commit: git add → git commit → git push
6. GitHub nhận commit mới
7. Netlify tự động rebuild và deploy
8. Đồ hình xuất hiện trên production
```

**Thời gian**: ~2-3 phút (bao gồm Git push và Netlify deploy)

### B. Production (Không khuyến nghị cho tính năng này)

```
1. User điền form → Bấm "Tạo Đồ Hình"
2. Form gọi API: /.netlify/functions/create-diagram
3. Netlify Function trả về nội dung file
4. User copy nội dung
5. User tạo file thủ công hoặc tạo PR
6. Commit vào GitHub
7. Netlify tự động rebuild và deploy
```

**Thời gian**: ~5-10 phút (cần thao tác thủ công)

---

## ✅ KHUYẾN NGHỊ

### Sử Dụng Local Development Cho Tạo Đồ Hình

**Lý do:**
1. ✅ Tự động tạo file
2. ✅ Tự động commit và push
3. ✅ Không cần thao tác thủ công
4. ✅ Nhanh chóng và tiện lợi
5. ✅ Có đầy đủ log để debug

**Cách setup:**
```bash
# 1. Clone repository về máy
git clone <your-repo-url>
cd HappyMarketDocs

# 2. Install dependencies
npm install

# 3. Chạy API server
npm run api
# hoặc
node simple-server.js

# 4. Chạy Hugo server (terminal khác)
hugo server -D

# 5. Mở form
http://localhost:1313/admin/tao-do-hinh.html
```

---

## 🔧 Cấu Hình

### 1. Auto-detect Environment

Form tự động phát hiện môi trường:

```javascript
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const apiUrl = isLocal 
    ? 'http://localhost:3001/api/create-diagram'  // Local
    : '/.netlify/functions/create-diagram';        // Production
```

### 2. API Endpoints

**Local:**
- URL: `http://localhost:3001/api/create-diagram`
- Method: `POST`
- Tạo file: ✅ Có
- Commit Git: ✅ Có
- Hugo rebuild: ✅ Có

**Production:**
- URL: `/.netlify/functions/create-diagram`
- Method: `POST`
- Tạo file: ❌ Không (chỉ trả nội dung)
- Commit Git: ❌ Không
- Hugo rebuild: ❌ Không

---

## 📋 Checklist Trước Khi Deploy

### Local Development

- [ ] Node.js đã được cài đặt
- [ ] Hugo đã được cài đặt
- [ ] Đã clone repository về máy
- [ ] Đã chạy `npm install`
- [ ] API server đang chạy (port 3001)
- [ ] Hugo server đang chạy (port 1313)
- [ ] Đã config Git (user.name và user.email)
- [ ] Đã có quyền push lên GitHub

### Production (Netlify)

- [ ] Netlify site đã được setup
- [ ] Build command: `hugo --gc --minify`
- [ ] Publish directory: `public`
- [ ] Hugo version: `0.100.0` trở lên
- [ ] Netlify Functions đã enabled
- [ ] File `netlify/functions/create-diagram.js` đã có trong repo

---

## 🐛 Troubleshooting

### Vấn đề 1: ERR_CONNECTION_REFUSED

**Nguyên nhân**: API server chưa chạy

**Giải pháp**:
```bash
# Kiểm tra server có đang chạy không
netstat -an | findstr :3001  # Windows
lsof -ti:3001                # macOS/Linux

# Chạy server
node simple-server.js
# hoặc
npm run api
```

### Vấn đề 2: File được tạo nhưng không push lên GitHub

**Nguyên nhân**: Git chưa config hoặc không có quyền push

**Giải pháp**:
```bash
# Config Git
git config user.name "Your Name"
git config user.email "your@email.com"

# Kiểm tra Git remote
git remote -v

# Test push
git push origin main
```

### Vấn đề 3: Đồ hình không xuất hiện sau khi tạo

**Nguyên nhân**: Hugo chưa rebuild hoặc cache

**Giải pháp**:
```bash
# 1. Refresh trang (Ctrl + Shift + R)

# 2. Restart Hugo server
hugo server -D

# 3. Kiểm tra file đã được tạo chưa
ls content/HINH/

# 4. Check Git status
git status
git log --oneline -5
```

### Vấn đề 4: Production không hoạt động

**Nguyên nhân**: Netlify Function chưa deploy hoặc chưa config

**Giải pháp**:
1. Kiểm tra file `netlify/functions/create-diagram.js` có trong repo
2. Kiểm tra Netlify build log
3. Test function trực tiếp: `/.netlify/functions/create-diagram`
4. **Sử dụng Local Development thay vì Production**

---

## 📊 So Sánh Local vs Production

| Tính năng | Local | Production |
|-----------|-------|------------|
| Tạo file tự động | ✅ | ❌ |
| Commit tự động | ✅ | ❌ |
| Hugo rebuild | ✅ | ❌ |
| Thời gian | 10 giây | 5-10 phút |
| Thao tác thủ công | Không | Có |
| Debug dễ dàng | ✅ | ❌ |
| Log chi tiết | ✅ | ❌ |
| **Khuyến nghị** | ✅ **DÙNG** | ⚠️ Tránh |

---

## 🎯 KẾT LUẬN

### Cho Content Creators / Admins

**➡️ HÃY DÙNG LOCAL DEVELOPMENT**

```bash
1. Clone repo về máy
2. Chạy: npm run api
3. Chạy: hugo server -D
4. Mở: http://localhost:1313/admin/tao-do-hinh.html
5. Tạo đồ hình → Tự động commit → Tự động deploy
```

### Cho Developers

**Production API chỉ nên dùng cho:**
- Tính năng READ-ONLY (đọc data)
- Tính năng không cần tạo file
- Tính năng có thể dùng Netlify Forms
- Tính năng có thể dùng GitHub API để commit

**Production API KHÔNG nên dùng cho:**
- ❌ Tạo file markdown
- ❌ Cập nhật index
- ❌ Trigger rebuild
- ❌ Git operations

➡️ **Dùng Local Development + Auto Git Push** thay thế!

---

**KHUYẾN NGHỊ CUỐI CÙNG**: 

Sử dụng Local Development cho tính năng "Tạo Đồ Hình". Nhanh hơn, tiện hơn, ít lỗi hơn!

