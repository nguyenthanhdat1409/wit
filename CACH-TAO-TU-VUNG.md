# 🚀 Cách Tạo Từ Vựng - Khái Niệm (ĐÃ FIX LỖI 404)

## ✅ VẤN ĐỀ ĐÃ ĐƯỢC GIẢI QUYẾT

### Trước đây:
- ❌ Tạo từ vựng → Báo "Thành công" → Nhưng file KHÔNG có trong source
- ❌ Truy cập URL → Lỗi 404
- ❌ Deploy lên production → Không hoạt động

### Bây giờ:
- ✅ Tạo từ vựng → File THẬT được tạo trong `content/TU-KHAINIEM/`
- ✅ Hugo tự động rebuild → Hiển thị ngay
- ✅ Tự động commit & push → Deploy lên production

---

## 📋 YÊU CẦU

1. **Node.js** (đã cài)
2. **Hugo** (đã cài)
3. **Git** (đã cài)
4. **2 Terminal/PowerShell windows**

---

## 🎯 HƯỚNG DẪN SỬ DỤNG

### **Bước 1: Khởi động API Server**

Mở **Terminal 1** (PowerShell):

```bash
cd "C:\Users\028.36383838 ext 2\Downloads\HappyMarketDocs-main"
node simple-server.js
```

Bạn sẽ thấy:
```
API server running on http://localhost:3001
Health check: http://localhost:3001/api/health
```

✅ **Giữ terminal này CHẠY - ĐỪNG TẮT**

---

### **Bước 2: Khởi động Hugo Server**

Mở **Terminal 2** (PowerShell mới):

```bash
cd "C:\Users\028.36383838 ext 2\Downloads\HappyMarketDocs-main"
hugo server -D
```

Bạn sẽ thấy:
```
Web Server is available at http://localhost:1313/
```

✅ **Giữ terminal này CHẠY - ĐỪNG TẮT**

---

### **Bước 3: Truy cập Admin Panel**

Mở trình duyệt và truy cập:

```
http://localhost:1313/admin/tao-tu-vung-khai-niem.html
```

---

### **Bước 4: Tạo Từ Vựng**

1. **Nhập thông tin:**
   - **Tên từ vựng:** (Ví dụ: "Tâm Thái")
   - **Nội dung khái niệm:** (Ví dụ: "Tâm thái là trạng thái tâm lý...")
   - **Tags:** (Tùy chọn, ví dụ: "TVHL Giàu Trí tuệ, Nội tâm")
   - **Categories:** (Tùy chọn, ví dụ: "Khái niệm nguồn")

2. **Click "Preview"** để xem trước

3. **Click "Tạo Từ Vựng - Khái Niệm"**

---

### **Bước 5: Kiểm tra kết quả**

#### A. Kiểm tra trong Terminal 1 (API Server):
```
✅ Created vocabulary file: content/TU-KHAINIEM/tam-thai/_index.md
✅ Git add: content/TU-KHAINIEM/tam-thai/_index.md
✅ Git commit: feat: add vocabulary "Tâm Thái"
✅ Git push: pushed to remote
```

#### B. Kiểm tra file đã được tạo:
```bash
# Terminal 3 (mới)
dir "content\TU-KHAINIEM\tam-thai"
```

Bạn sẽ thấy file `_index.md`

#### C. Kiểm tra trên trình duyệt:
```
http://localhost:1313/tu-khainiem/tam-thai/
```

✅ **KHÔNG CÒN 404!** Nội dung hiển thị ngay!

#### D. Kiểm tra Git:
```bash
git log --oneline -1
```

Bạn sẽ thấy commit mới:
```
feat: add vocabulary "Tâm Thái"
```

---

## 🔄 WORKFLOW HOÀN CHỈNH

```
1. User nhập thông tin trong Admin Panel
   ↓
2. Click "Tạo Từ Vựng"
   ↓
3. API Server:
   - Tạo folder: content/TU-KHAINIEM/[slug]/
   - Tạo file: _index.md
   - Git add
   - Git commit
   - Git push
   ↓
4. Hugo Server:
   - Phát hiện file mới
   - Auto rebuild
   - Hiển thị nội dung
   ↓
5. User truy cập URL → ✅ THÀNH CÔNG!
   ↓
6. GitHub nhận commit → Netlify/Vercel auto deploy
   ↓
7. ✅ Live trên Production!
```

---

## 📁 CẤU TRÚC FILE

Khi tạo từ vựng "Tâm Thái", hệ thống tạo:

```
content/
└── TU-KHAINIEM/
    └── tam-thai/           # ← Folder mới
        └── _index.md       # ← File mới
```

**Nội dung `_index.md`:**
```markdown
---
title: "Tâm Thái"
description: ""
date: 2025-09-30
draft: false
weight: 59
tags: ["TVHL Giàu Trí tuệ", "Nội tâm"]
categories: ["Khái niệm nguồn"]
---

# Tâm Thái

## Khái Niệm

Tâm thái là trạng thái tâm lý...
```

---

## ❓ XỬ LÝ LỖI

### Lỗi 1: "Không thể tạo từ vựng"

**Nguyên nhân:** API Server chưa chạy

**Giải pháp:**
```bash
node simple-server.js
```

---

### Lỗi 2: 404 khi truy cập URL

**Nguyên nhân:** Hugo Server chưa chạy

**Giải pháp:**
```bash
hugo server -D
```

Sau đó đợi vài giây để Hugo rebuild.

---

### Lỗi 3: "Từ vựng đã tồn tại"

**Nguyên nhân:** Đã tạo từ vựng với tên giống nhau

**Giải pháp:**
- Đổi tên từ vựng
- Hoặc xóa folder cũ:
  ```bash
  rmdir /s "content\TU-KHAINIEM\[slug]"
  ```

---

### Lỗi 4: Git push failed

**Nguyên nhân:** Chưa config Git hoặc không có quyền

**Giải pháp:**
```bash
# Config Git
git config user.name "Your Name"
git config user.email "your@email.com"

# Check remote
git remote -v

# Test push
git push
```

---

## 🎯 CHECKLIST TRƯỚC KHI TẠO

- [ ] Terminal 1: API Server đang chạy (port 3001)
- [ ] Terminal 2: Hugo Server đang chạy (port 1313)
- [ ] Đã nhập đầy đủ Tên và Nội dung
- [ ] Tên từ vựng chưa tồn tại
- [ ] Git đã được config

---

## 🚀 DEPLOY LÊN PRODUCTION

### Tự động (Khuyến nghị):

Sau khi tạo từ vựng, hệ thống tự động:
1. ✅ Tạo file trong source
2. ✅ Git commit
3. ✅ Git push → GitHub
4. ✅ Netlify/Vercel tự động deploy
5. ✅ Live sau 2-3 phút

### Thủ công:

Nếu không tự động push, chạy:
```bash
git push
```

---

## 📊 KIỂM TRA HỆ THỐNG

### Test API Server:
```bash
curl http://localhost:3001/api/health
```

Kết quả:
```json
{"status":"OK","message":"API server is running"}
```

### Test Hugo Server:
```bash
curl http://localhost:1313/
```

Kết quả: HTML của trang chủ

---

## 💡 TIPS

1. **Đặt tên từ vựng rõ ràng** - Tránh trùng lặp
2. **Sử dụng Preview** trước khi tạo
3. **Giữ 2 servers luôn chạy** khi làm việc
4. **Kiểm tra Git log** sau khi tạo
5. **Đợi Hugo rebuild** (vài giây) trước khi truy cập URL

---

## 🎉 KẾT LUẬN

Giờ đây bạn có thể:

✅ **Tạo từ vựng THẬT** - File có trong source  
✅ **Không bị 404** - Hugo tự động rebuild  
✅ **Tự động Git** - Commit & push tự động  
✅ **Deploy production** - Netlify/Vercel auto deploy  

**Workflow 100% hoạt động!** 🚀

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. Console log của API Server (Terminal 1)
2. Console log của Hugo Server (Terminal 2)
3. Browser DevTools Console (F12)

Hoặc xem file: `DEPLOY-TAO-TU-VUNG.md` để biết thêm chi tiết.
