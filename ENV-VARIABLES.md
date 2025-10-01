# Environment Variables Configuration

## 🔐 Required Variables

### GITHUB_TOKEN
**Bắt buộc** để tạo/update files trên GitHub từ Netlify Functions

**Cách tạo:**
1. Truy cập: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Chọn scope: `repo` (Full control)
4. Generate và copy token

**Value:** `ghp_YOUR_TOKEN_HERE` (thay bằng token thật)

---

## 📝 Optional Variables

### GITHUB_OWNER
**Default:** `nguyenthanhdat1409`

**Value:** Username hoặc organization name

### GITHUB_REPO
**Default:** `wit`

**Value:** Repository name

### GITHUB_BRANCH
**Default:** `main`

**Value:** Branch để commit vào

---

## 🚀 Setup trên Netlify

1. **Truy cập Netlify Dashboard:**
   ```
   https://app.netlify.com/sites/YOUR_SITE/settings/deploys
   ```

2. **Scroll xuống "Environment variables"**

3. **Click "Edit variables" → "Add a variable"**

4. **Thêm:**
   - Key: `GITHUB_TOKEN`
   - Value: `ghp_YOUR_TOKEN_HERE` (thay bằng token bạn đã tạo)

5. **Click "Save"**

6. **Redeploy site**

---

## ⚠️ Security Notes

- **KHÔNG** commit token vào code
- **CHỈ** set trong Netlify Environment Variables
- Token có thể revoke bất cứ lúc nào

