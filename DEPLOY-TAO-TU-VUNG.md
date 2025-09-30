# Hướng Dẫn Deploy Tính Năng Tạo Từ Vựng

## ⚠️ VẤN ĐỀ QUAN TRỌNG

Bạn đã phát hiện đúng vấn đề:

### Trên Local (Development)
- ✅ API server chạy → tạo file trong `content/TU-KHAINIEM/`
- ✅ Hugo rebuild → hiển thị nội dung
- ❌ File **CHƯA được commit vào Git** tự động

### Trên Production (Netlify/Vercel)
- ❌ Netlify/Vercel là **static hosting** → KHÔNG có Node.js server runtime
- ❌ API endpoint `/api/create-vocabulary` sẽ **KHÔNG hoạt động**
- ❌ Không thể tạo file mới trên production

---

## 💡 CÁC GIẢI PHÁP

### **Giải pháp 1: Auto Git Commit & Push** ⭐ (Đã tích hợp)

**Ưu điểm:**
- ✅ Tự động commit và push file mới lên Git
- ✅ Netlify/Vercel tự động deploy khi có commit mới
- ✅ File được lưu vĩnh viễn trong source code

**Nhược điểm:**
- ⚠️ Cần chạy API server local
- ⚠️ Chỉ dùng cho development/content management

**Cách hoạt động:**
```
1. User tạo từ vựng → API server tạo file
2. API server tự động: git add → git commit → git push
3. GitHub nhận commit mới
4. Netlify/Vercel tự động rebuild và deploy
5. Từ vựng mới xuất hiện trên production
```

**Setup:**
```bash
# Đã tích hợp sẵn trong simple-server.js
# Chỉ cần chạy:
npm run api
```

---

### **Giải pháp 2: Netlify Functions** (Cho production)

Tạo serverless function để tạo file trên production.

**File:** `netlify/functions/create-vocabulary.js`

```javascript
const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { title, content, tags, categories } = JSON.parse(event.body);
  
  // Generate slug
  const slug = title.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
  
  // Generate markdown
  const date = new Date().toISOString().split('T')[0];
  const tagsYaml = tags.length > 0 ? `tags: [${tags.map(t => `"${t}"`).join(', ')}]` : 'tags: [""]';
  const categoriesYaml = categories.length > 0 ? `categories: [${categories.map(c => `"${c}"`).join(', ')}]` : 'categories: [""]';
  
  const markdownContent = `---
title: "${title}"
description: ""
date: ${date}
draft: false
weight: 59
${tagsYaml}
${categoriesYaml}
---

# ${title}

## Khái Niệm

${content}`;

  // Create commit via GitHub API
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  try {
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: 'your-username',
      repo: 'your-repo',
      path: `content/TU-KHAINIEM/${slug}/_index.md`,
      message: `feat: add vocabulary "${title}"`,
      content: Buffer.from(markdownContent).toString('base64'),
      branch: 'main'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: {
          title,
          slug,
          filePath: `content/TU-KHAINIEM/${slug}/_index.md`,
          url: `/tu-khainiem/${slug}/`
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
```

**Setup:**
1. Install dependencies:
```bash
npm install @octokit/rest
```

2. Tạo GitHub Personal Access Token:
   - Vào: https://github.com/settings/tokens
   - Tạo token với quyền `repo`

3. Thêm vào Netlify Environment Variables:
   - `GITHUB_TOKEN`: token vừa tạo

4. Update `vocabulary-generator.js`:
```javascript
// Change from:
fetch('http://localhost:3001/api/create-vocabulary', ...)

// To:
fetch('/.netlify/functions/create-vocabulary', ...)
```

---

### **Giải pháp 3: Vercel Serverless Functions**

**File:** `api/create-vocabulary.js`

```javascript
const { Octokit } = require("@octokit/rest");

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { title, content, tags, categories } = req.body;
  
  // Same logic as Netlify Functions...
  
  try {
    // Create commit via GitHub API (same as above)
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    
    // ... create file logic ...
    
    return res.status(200).json({
      success: true,
      data: { title, slug, filePath, url }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
```

**Setup:**
1. Thêm vào `vercel.json`:
```json
{
  "functions": {
    "api/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "env": {
    "GITHUB_TOKEN": "@github-token"
  }
}
```

2. Add secret:
```bash
vercel secrets add github-token "your-token-here"
```

---

### **Giải pháp 4: CMS Integration** (Nâng cao)

Tích hợp với Headless CMS:

1. **Netlify CMS**
2. **Strapi**
3. **Contentful**
4. **Sanity.io**

---

## 🎯 KHUYẾN NGHỊ

### Cho Development (Local):
✅ **Sử dụng: Auto Git Commit & Push** (Đã tích hợp)

**Workflow:**
```bash
# Terminal 1: API Server
npm run api

# Terminal 2: Hugo Server  
hugo server -D

# Browser
http://localhost:1313/admin/tao-tu-vung-khai-niem.html
```

**Khi tạo từ vựng:**
1. File được tạo trong `content/TU-KHAINIEM/`
2. Tự động: `git add` → `git commit` → `git push`
3. GitHub nhận commit
4. Netlify/Vercel auto deploy
5. Từ vựng xuất hiện trên production

### Cho Production:
✅ **Sử dụng: Netlify/Vercel Functions + GitHub API**

**Lý do:**
- Tạo file trực tiếp trên production
- Không cần chạy local server
- Tạo commit qua GitHub API
- Auto trigger deploy

---

## 📝 CHECKLIST DEPLOYMENT

### Bước 1: Setup Git Auto Commit (Local)
- [x] Đã tích hợp trong `simple-server.js`
- [ ] Test tạo từ vựng và kiểm tra Git
- [ ] Kiểm tra commit tự động

### Bước 2: Setup Production (Chọn 1)

#### Option A: Netlify Functions
- [ ] Tạo `netlify/functions/create-vocabulary.js`
- [ ] Install `@octokit/rest`
- [ ] Tạo GitHub Token
- [ ] Add token vào Netlify Environment Variables
- [ ] Update `vocabulary-generator.js` endpoint

#### Option B: Vercel Functions  
- [ ] Tạo `api/create-vocabulary.js`
- [ ] Install `@octokit/rest`
- [ ] Tạo GitHub Token
- [ ] Add secret: `vercel secrets add`
- [ ] Update `vocabulary-generator.js` endpoint

### Bước 3: Test
- [ ] Test local: tạo từ vựng → kiểm tra git commit
- [ ] Test production: tạo từ vựng → kiểm tra deploy
- [ ] Kiểm tra URL không bị 404

---

## 🚨 LƯU Ý QUAN TRỌNG

### 1. Git Conflicts
Nếu nhiều người tạo từ vựng cùng lúc → có thể bị conflict

**Giải pháp:**
- Pull trước khi commit
- Hoặc dùng queue system

### 2. Deploy Trigger
Mỗi lần tạo từ vựng = 1 commit = 1 deploy

**Giải pháp:**
- Batch commits (tạo nhiều từ vựng trước, commit 1 lần)
- Hoặc chỉ trigger deploy khi cần

### 3. GitHub API Rate Limit
- Public repo: 60 requests/hour
- Authenticated: 5000 requests/hour

**Giải pháp:**
- Dùng authenticated token
- Cache responses

---

## 🎉 KẾT LUẬN

**Hiện tại (đã update):**
- ✅ Local: Tạo file + Auto Git commit & push
- ✅ Netlify/Vercel: Auto deploy khi có commit mới
- ✅ File được lưu vĩnh viễn trong source code

**Để production hoàn chỉnh:**
- Cài đặt Netlify/Vercel Functions
- Tích hợp GitHub API
- Update endpoint trong frontend

**Workflow cuối cùng:**
```
User tạo từ vựng 
→ API/Function tạo file 
→ Git commit (auto/API) 
→ Deploy trigger 
→ Live trên production
```

Bạn muốn implement giải pháp nào? 🚀
