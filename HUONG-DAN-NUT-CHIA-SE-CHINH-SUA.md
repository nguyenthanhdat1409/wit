# 🎉 Hướng Dẫn Sử Dụng Nút Chia Sẻ & Chỉnh Sửa

## ✨ TÍNH NĂNG MỚI

Trang từ vựng - khái niệm giờ đây có 2 nút mới:

1. **🔗 Nút Chia Sẻ** - Copy link trang hiện tại
2. **✏️ Nút Chỉnh Sửa** - Chỉnh sửa và cập nhật từ vựng

---

## 📍 VỊ TRÍ CÁC NÚT

Ở **cuối mỗi trang từ vựng**, bạn sẽ thấy 2 nút:

```
┌─────────────────────────────────────────┐
│  Cập nhật lần cuối: 30/09/2025          │
│                                         │
│     [🔗 Chia sẻ]    [✏️ Chỉnh sửa]    │
└─────────────────────────────────────────┘
```

---

## 🔗 NÚT CHIA SẺ

### Chức năng:
- Click để **copy URL** của trang hiện tại vào clipboard
- Hiển thị "✓ Đã copy!" khi thành công
- Tự động reset sau 2 giây

### Cách sử dụng:

1. **Vào trang từ vựng bất kỳ**, ví dụ:
   ```
   http://localhost:1313/tu-khainiem/tam-thai/
   ```

2. **Kéo xuống cuối trang**

3. **Click nút "Chia sẻ"**

4. **Thấy thông báo "✓ Đã copy!"**

5. **Paste** (Ctrl+V) vào bất kỳ đâu → Link đã được copy!

### Demo:
```
Trước khi click: [🔗 Chia sẻ]
Sau khi click:   [✓ Đã copy!] (màu xanh)
Sau 2 giây:      [🔗 Chia sẻ] (về bình thường)
```

---

## ✏️ NÚT CHỈNH SỬA

### Chức năng:
- Chuyển đến trang chỉnh sửa từ vựng
- Load dữ liệu hiện tại tự động
- Cập nhật và lưu vào source code
- Tự động Git commit & push

### Cách sử dụng:

#### **Bước 1: Click nút "Chỉnh sửa"**

Từ trang từ vựng, click nút "Chỉnh sửa" → Chuyển đến:
```
http://localhost:1313/admin/chinh-sua-tu-vung.html?slug=tam-thai&title=Tâm%20Thái
```

#### **Bước 2: Chờ load dữ liệu**

Hệ thống tự động:
- Gọi API: `GET /api/get-vocabulary/tam-thai`
- Parse file `_index.md`
- Điền dữ liệu vào form

#### **Bước 3: Chỉnh sửa**

Form hiển thị:
- ✅ **Tên từ vựng** - Có thể sửa
- 🔒 **URL slug** - KHÔNG thay đổi (readonly)
- ✅ **Nội dung khái niệm** - Có thể sửa
- ✅ **Tags** - Có thể sửa
- ✅ **Categories** - Có thể sửa

#### **Bước 4: Click "Cập Nhật"**

Hệ thống sẽ:
1. Validate dữ liệu
2. Call API: `POST /api/update-vocabulary`
3. Ghi đè file `_index.md`
4. Auto `git add`
5. Auto `git commit -m "feat: update vocabulary [tên]"`
6. Auto `git push`
7. Hiển thị modal thành công

#### **Bước 5: Xem kết quả**

Click "Xem từ vựng" → Quay lại trang từ vựng với nội dung mới!

---

## 🔄 WORKFLOW HOÀN CHỈNH

### Chia sẻ:
```
User ở trang từ vựng
    ↓
Click nút "Chia sẻ"
    ↓
JavaScript copy URL hiện tại
    ↓
Hiển thị "✓ Đã copy!"
    ↓
User paste vào chat/email/... → Done!
```

### Chỉnh sửa:
```
User ở trang từ vựng
    ↓
Click nút "Chỉnh sửa"
    ↓
Redirect → /admin/chinh-sua-tu-vung.html?slug=...
    ↓
API load dữ liệu hiện tại
    ↓
User chỉnh sửa trong form
    ↓
Click "Cập Nhật"
    ↓
API cập nhật file _index.md
    ↓
Git auto: add → commit → push
    ↓
Hugo auto rebuild
    ↓
Nội dung mới live ngay!
```

---

## 🛡️ BẢO MẬT & VALIDATION

### Validation:
- ✅ Slug phải tồn tại
- ✅ Tiêu đề không được rỗng
- ✅ Nội dung không được rỗng
- ✅ File phải tồn tại trong source

### Bảo mật:
- 🔒 Chỉ cập nhật file đã tồn tại (không tạo mới)
- 🔒 Slug không thay đổi (tránh đổi URL)
- 🔒 Git commit tự động (track changes)

---

## 📋 YÊU CẦU

### Để sử dụng tính năng chỉnh sửa:

1. ✅ **API Server phải chạy** (port 3001)
   ```bash
   node simple-server.js
   ```

2. ✅ **Hugo Server phải chạy** (port 1313)
   ```bash
   hugo server -D
   ```

3. ✅ **Git đã được config**
   ```bash
   git config user.name "Your Name"
   git config user.email "your@email.com"
   ```

---

## 🎯 DEMO THỰC TẾ

### Test Chia Sẻ:

1. Vào: `http://localhost:1313/tu-khainiem/test-22/`
2. Kéo xuống cuối
3. Click "Chia sẻ"
4. Mở Notepad → Paste (Ctrl+V)
5. Kết quả: `http://localhost:1313/tu-khainiem/test-22/`

### Test Chỉnh Sửa:

1. Vào: `http://localhost:1313/tu-khainiem/test-22/`
2. Kéo xuống cuối
3. Click "Chỉnh sửa"
4. Sửa nội dung: "test 22 updated"
5. Click "Cập Nhật"
6. Thấy modal "Cập nhật thành công!"
7. Click "Xem từ vựng"
8. Thấy nội dung đã thay đổi!

---

## 🐛 XỬ LÝ LỖI

### Lỗi 1: "Không thể tải dữ liệu từ vựng"

**Nguyên nhân:** API server chưa chạy

**Giải pháp:**
```bash
node simple-server.js
```

---

### Lỗi 2: "Không thể copy link"

**Nguyên nhân:** Browser không hỗ trợ Clipboard API

**Giải pháp:**
- Dùng HTTPS (hoặc localhost)
- Hoặc copy URL thủ công từ address bar

---

### Lỗi 3: "Vocabulary not found"

**Nguyên nhân:** File không tồn tại trong source

**Giải pháp:**
- Kiểm tra file có tồn tại: `content/TU-KHAINIEM/[slug]/_index.md`
- Hoặc tạo mới từ vựng trước

---

### Lỗi 4: Git push failed

**Nguyên nhân:** Git chưa config hoặc conflict

**Giải pháp:**
```bash
# Config Git
git config user.name "Your Name"
git config user.email "your@email.com"

# Pull trước khi push
git pull
git push
```

---

## 📊 API ENDPOINTS MỚI

### 1. GET `/api/get-vocabulary/:slug`

**Mô tả:** Lấy dữ liệu từ vựng hiện tại

**Request:**
```
GET http://localhost:3001/api/get-vocabulary/tam-thai
```

**Response:**
```json
{
  "success": true,
  "data": {
    "slug": "tam-thai",
    "title": "Tâm Thái",
    "content": "Tâm thái là...",
    "tags": ["TVHL Giàu Trí tuệ", "Nội tâm"],
    "categories": ["Khái niệm nguồn"]
  }
}
```

---

### 2. POST `/api/update-vocabulary`

**Mô tả:** Cập nhật từ vựng

**Request:**
```json
POST http://localhost:3001/api/update-vocabulary
Content-Type: application/json

{
  "slug": "tam-thai",
  "title": "Tâm Thái (Updated)",
  "content": "Nội dung mới...",
  "tags": ["tag1", "tag2"],
  "categories": ["cat1"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Tâm Thái (Updated)",
    "slug": "tam-thai",
    "filePath": "content/TU-KHAINIEM/tam-thai/_index.md",
    "url": "/tu-khainiem/tam-thai/"
  },
  "message": "Từ vựng đã được cập nhật thành công!"
}
```

---

## 🎉 KẾT LUẬN

Giờ đây trang từ vựng có đầy đủ tính năng:

✅ **Chia sẻ** - Copy link nhanh chóng  
✅ **Chỉnh sửa** - Cập nhật dễ dàng  
✅ **Auto Git** - Tự động commit & push  
✅ **Live Update** - Hugo rebuild tức thì  

**Workflow hoàn hảo cho content management!** 🚀

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Check API server log (Terminal 1)
2. Check Hugo server log (Terminal 2)
3. Check Browser DevTools Console (F12)

Hoặc xem file: `CACH-TAO-TU-VUNG.md` để biết thêm chi tiết.
