# 🧪 Hướng Dẫn Test - Tạo Từ Vựng & Đồ Hình

## 📋 Tổng Quan

Bạn có thể tạo Vocabulary và Diagram ở **2 môi trường**:
1. **Local Development** - Tự động commit & push
2. **Production (Netlify)** - Sử dụng GitHub API

---

## 🏠 TEST Ở LOCAL

### 1️⃣ Chuẩn Bị

**Kill tất cả processes cũ:**
```powershell
taskkill /F /IM hugo.exe; taskkill /F /IM node.exe
```

**Start servers:**
```powershell
# Terminal 1: Start simple-server
node simple-server.js

# Terminal 2 (mở terminal mới): Start Hugo
hugo server -D
```

**Kiểm tra servers đã chạy:**
```powershell
netstat -ano | findstr ":3001 :1313"

# Kết quả mong đợi:
# TCP    0.0.0.0:3001    LISTENING    (Simple-server)
# TCP    127.0.0.1:1313  LISTENING    (Hugo)
```

### 2️⃣ Test Tạo Từ Vựng

**1. Mở browser:**
```
http://localhost:1313/admin/tao-tu-vung.html
```

**2. Clear cache (QUAN TRỌNG!):**
```
Ctrl + Shift + Delete → Clear cache
Hoặc: F12 → Right-click Refresh → "Empty Cache and Hard Reload"
```

**3. Điền thông tin:**
- Tên: `Test Local Vocabulary`
- Nội dung: `Đây là test từ local development`

**4. Click "Tạo Từ Vựng - Khái Niệm"**

**5. Kiểm tra Console Log:**
```javascript
🌐 Calling API endpoint: http://localhost:3001/api/create-vocabulary
📡 API Response received: 200
✅ Vocabulary created successfully
```

**6. Kiểm tra file đã được tạo:**
```powershell
# Check file tồn tại
Test-Path "content\TU-KHAINIEM\test-local-vocabulary\_index.md"
# → Phải trả về: True

# Check Git status
git status
# → Sẽ thấy: new file created and committed
```

**7. Kiểm tra trên website:**
```
# Đợi Hugo rebuild (tự động, ~1-2 giây)
# Truy cập:
http://localhost:1313/tu-khainiem/test-local-vocabulary/
```

### 3️⃣ Test Tạo Đồ Hình

**1. Mở:**
```
http://localhost:1313/admin/tao-do-hinh.html
```

**2. Điền thông tin:**
- Tên Hình: `Test Local Diagram`
- URL Hình: `https://via.placeholder.com/800x600.png?text=Test+Local`
- Link Khái Niệm: `/khai-niem-nguon/nguyen-ly-anh-sang/` (optional)
- Link Bài Học: (để trống)

**3. Click "Tạo Đồ Hình"**

**4. Kiểm tra Console Log:**
```javascript
🌐 Using API endpoint: http://localhost:3001/api/create-diagram
✅ Diagram created on GitHub
```

**5. Xem kết quả:**
```
http://localhost:1313/hinh/
```

---

## 🌐 TEST Ở PRODUCTION (Netlify)

### 1️⃣ Setup Environment Variable

**QUAN TRỌNG:** Phải làm bước này trước!

1. **Truy cập Netlify Dashboard:**
   ```
   https://app.netlify.com/
   ```

2. **Chọn site của bạn**

3. **Vào Settings → Build & deploy → Environment**
   ```
   Site settings → Environment variables → Edit variables
   ```

4. **Add variable:**
   ```
   Key: GITHUB_TOKEN
   Value: YOUR_GITHUB_TOKEN_HERE
   ```
   (Dán TOÀN BỘ token bạn đã tạo - bắt đầu với `ghp_`)

5. **Click "Save"**

6. **Trigger Manual Deploy:**
   ```
   Deploys → Trigger deploy → Deploy site
   ```

7. **Đợi deploy xong (~2-3 phút)**

### 2️⃣ Test Tạo Từ Vựng

**1. Mở production site:**
```
https://YOUR_SITE_NAME.netlify.app/admin/tao-tu-vung.html
```

**2. Điền thông tin:**
- Tên: `Test Production Vocabulary`
- Nội dung: `Đây là test từ production`

**3. Click "Tạo Từ Vựng - Khái Niệm"**

**4. Kiểm tra Console Log:**
```javascript
🌐 Calling API endpoint: /.netlify/functions/create-vocabulary
📡 API Response received: 200
📄 API Response: {
  success: true,
  data: {
    created: true,  // ← TRUE = đã commit vào GitHub!
    githubCommit: "abc123...",
    message: "File đã được tạo và commit vào GitHub..."
  }
}
```

**5. Kiểm tra GitHub:**
```
https://github.com/nguyenthanhdat1409/wit/commits/main
```
→ Sẽ thấy commit mới: `feat: add vocabulary "Test Production Vocabulary" via Netlify Function`

**6. Đợi Netlify auto-rebuild (~2-3 phút)**
```
# Check deploy status:
https://app.netlify.com/sites/YOUR_SITE/deploys

# Khi deploy xong, truy cập:
https://YOUR_SITE_NAME.netlify.app/tu-khainiem/test-production-vocabulary/
```

### 3️⃣ Test Tạo Đồ Hình

Tương tự với:
```
https://YOUR_SITE_NAME.netlify.app/admin/tao-do-hinh.html
```

---

## ✅ Kết Quả Mong Đợi

### Local Development
- ✅ File tạo **NGAY LẬP TỨC**
- ✅ Auto commit vào Git
- ✅ Hiển thị ngay sau Hugo rebuild (~1-2 giây)

### Production (Netlify)
- ✅ File tạo qua **GitHub API**
- ✅ Auto commit vào Git
- ✅ Netlify auto-detect commit → rebuild
- ⏳ Hiển thị sau **~2-3 phút** (rebuild time)

---

## 🐛 Troubleshooting

### Local: Error "ERR_CONNECTION_REFUSED"

**Nguyên nhân:** Simple-server chưa chạy hoặc browser cache

**Giải pháp:**
```powershell
# 1. Check server
netstat -ano | findstr :3001

# 2. Nếu không có, start lại:
node simple-server.js

# 3. Hard refresh browser:
Ctrl + F5
```

### Production: Error "GitHub API Error"

**Nguyên nhân:** Environment Variable chưa set hoặc token sai

**Giải pháp:**
1. Check Netlify Environment Variables
2. Verify token còn valid
3. Check Netlify Function Logs:
   ```
   https://app.netlify.com/sites/YOUR_SITE/functions
   ```

### Vocabulary/Diagram không hiển thị sau khi tạo

**Nguyên nhân:** Netlify chưa rebuild xong

**Giải pháp:**
1. Đợi thêm 2-3 phút
2. Check deploy status
3. Hard refresh browser (Ctrl + F5)

---

## 📊 So Sánh Local vs Production

| Tính Năng | Local | Production |
|-----------|-------|------------|
| Tốc độ tạo file | ⚡ Ngay lập tức | ⏳ 2-3 phút |
| Cần server | ✅ simple-server | ❌ Không |
| Auto commit | ✅ Git local | ✅ GitHub API |
| Hiển thị | ⚡ Ngay (~1s) | ⏳ Sau rebuild |
| Setup | ⚡ Đơn giản | 🔧 Cần token |

---

## 💡 Best Practice

### Cho Development
→ **Sử dụng Local** (nhanh, dễ debug)

### Cho Production/Team
→ **Sử dụng Netlify** (không cần local setup)

### Tạo Nhiều Items
→ **Local** (tránh nhiều rebuilds)

---

## 📞 Nếu Cần Hỗ Trợ

1. Check console logs (F12)
2. Check Netlify Function logs
3. Check GitHub commits
4. Xem file: `GITHUB-API-SETUP.md`

**Chúc test thành công! 🎉**

