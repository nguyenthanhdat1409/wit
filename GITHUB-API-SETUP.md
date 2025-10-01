# 🔐 GitHub API Setup - Auto Commit từ Production

## ✅ Đã Hoàn Thành

### 1. Code Integration
- ✅ Tạo `netlify/functions/lib/github-helper.js`
- ✅ Update `netlify/functions/create-vocabulary.js`  
- ✅ Update `netlify/functions/create-diagram.js`

### 2. Repository Info
- **Owner:** `nguyenthanhdat1409`
- **Repo:** `wit`
- **Branch:** `main`
- **URL:** https://github.com/nguyenthanhdat1409/wit

---

## 🚀 Các Bước Tiếp Theo

### Step 1: Commit & Push Code

```bash
git add .
git commit -m "feat: add GitHub API integration for auto-commit from production"
git push origin main
```

### Step 2: Setup Netlify Environment Variables

1. **Truy cập Netlify Site Settings:**
   ```
   https://app.netlify.com/sites/YOUR_SITE_NAME/settings/deploys
   ```

2. **Scroll xuống "Environment variables"**

3. **Click "Edit variables" → "Add a variable"**

4. **Thêm Variable sau:**
   
   **Key:** `GITHUB_TOKEN`
   
   **Value:** `ghp_9PjBIRVWa...` (Token bạn đã tạo)
   
   ⚠️ **LƯU Ý:** Paste TOÀN BỘ token vào (bắt đầu với `ghp_`)

5. **Click "Save"**

6. **(Optional) Thêm các variables khác nếu muốn custom:**
   ```
   GITHUB_OWNER=nguyenthanhdat1409
   GITHUB_REPO=wit
   GITHUB_BRANCH=main
   ```
   
   ℹ️ **Note:** Nếu không thêm, sẽ dùng giá trị default đã hardcode trong code

### Step 3: Redeploy Netlify Site

1. **Trigger Deploy:**
   - Cách 1: Push code mới (đã làm ở Step 1)
   - Cách 2: Manual deploy trên Netlify Dashboard

2. **Đợi deploy xong (~2-3 phút)**

---

## 🧪 Test Trên Production

### Test Create Vocabulary

1. Truy cập: `https://YOUR_SITE_URL/admin/tao-tu-vung.html`

2. Điền thông tin và submit

3. **Kết quả mong đợi:**
   ```javascript
   {
     success: true,
     data: {
       created: true,  // ← TRUE!
       githubCommit: "abc123...",
       message: "File đã được tạo và commit vào GitHub. Netlify sẽ tự động rebuild..."
     }
   }
   ```

4. **Check GitHub:**
   - Vào repo: https://github.com/nguyenthanhdat1409/wit
   - Xem commits → Sẽ thấy commit mới: `feat: add vocabulary "..." via Netlify Function`

5. **Đợi Netlify rebuild (~2-3 phút)**
   - Netlify tự động detect commit mới
   - Auto rebuild
   - Vocabulary sẽ hiện trên site

### Test Create Diagram

Tương tự với: `https://YOUR_SITE_URL/admin/tao-do-hinh.html`

---

## 🎯 Cách Hoạt Động

### Local Development
```
User submit form
  ↓
Netlify Dev (port 8888) 
  ↓
Simple Server (port 3001) hoặc Netlify Functions
  ↓
Ghi file trực tiếp vào disk
  ↓
Git commit & push (local)
  ↓
Netlify auto-deploy
```

### Production (Netlify)
```
User submit form
  ↓
Netlify Function
  ↓
GitHub API
  ↓
Tạo/Update file trên GitHub
  ↓
Git commit (automatic)
  ↓
Netlify auto-detect commit
  ↓
Auto rebuild (~2-3 min)
  ↓
File hiện trên site
```

---

## 🔒 Security Notes

### Token Security
- ✅ **DO:** Store token trong Netlify Environment Variables
- ✅ **DO:** Sử dụng token với quyền **chỉ repo hiện tại**
- ❌ **DON'T:** Commit token vào code
- ❌ **DON'T:** Share token công khai

### Revoke Token
Nếu token bị lộ, revoke ngay:
```
https://github.com/settings/tokens
→ Find token
→ Delete/Revoke
→ Tạo token mới
→ Update Netlify Environment Variable
```

---

## ⚠️ Limitations

### GitHub API Rate Limit
- **Authenticated:** 5,000 requests/hour
- **Typical usage:** ~1-2 requests per vocabulary/diagram
- **Should be fine** cho hầu hết use cases

### Netlify Function Timeout
- **Default:** 10 seconds
- **Max:** 26 seconds (Pro plan)
- GitHub API thường < 2 seconds

### Rebuild Time
- Mỗi lần tạo vocabulary/diagram → **1 commit** → **1 rebuild**
- Nếu tạo nhiều items cùng lúc → Nhiều rebuilds
- **Best practice:** Tạo từng cái một, đợi rebuild xong

---

## 🐛 Troubleshooting

### Error: "GitHub API Error: Bad credentials"
**Nguyên nhân:** Token không đúng hoặc chưa set Environment Variable

**Giải pháp:**
1. Check Environment Variable `GITHUB_TOKEN` trên Netlify
2. Verify token còn valid trên GitHub
3. Redeploy Netlify site

### Error: "GitHub API Error: Not Found"
**Nguyên nhân:** Repository info không đúng

**Giải pháp:**
1. Check `GITHUB_OWNER`, `GITHUB_REPO` trong code
2. Verify token có quyền truy cập repo

### Vocabulary được tạo nhưng không hiển thị
**Nguyên nhân:** Netlify chưa rebuild xong

**Giải pháp:**
1. Đợi 2-3 phút
2. Check Netlify Deploy log
3. Hard refresh browser (Ctrl + F5)

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check Netlify Function Logs:**
   ```
   Netlify Dashboard → Functions → Logs
   ```

2. **Check GitHub Commits:**
   ```
   https://github.com/nguyenthanhdat1409/wit/commits/main
   ```

3. **Check Browser Console:**
   ```
   F12 → Console → Xem API response
   ```

---

**Happy Coding! 🚀**
