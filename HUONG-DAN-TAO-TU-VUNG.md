# Hướng Dẫn Tạo Từ Vựng - Khái Niệm

## 🎯 Vấn đề đã được giải quyết

Trước đây, khi tạo từ vựng qua Admin Panel:
- ✅ Hiển thị "Tạo thành công" 
- ❌ Nhưng file KHÔNG được tạo thực tế trong folder `content/TU-KHAINIEM/`
- ❌ Dẫn đến lỗi 404 khi truy cập

**Nguyên nhân:** API endpoint cũ chỉ là file HTML tĩnh, không thể tạo file thật.

**Giải pháp:** Đã tích hợp endpoint `/api/create-vocabulary` vào API server Node.js để tạo file thực sự.

---

## 🚀 Cách Sử Dụng

### Bước 1: Khởi động API Server

Mở terminal và chạy:

```bash
npm run api
```

Hoặc:

```bash
node simple-server.js
```

Server sẽ chạy trên: `http://localhost:3001`

### Bước 2: Khởi động Hugo Server

Mở terminal khác và chạy:

```bash
hugo server -D
```

Hugo sẽ chạy trên: `http://localhost:1313`

### Bước 3: Truy cập Admin Panel

Mở trình duyệt và truy cập:

```
http://localhost:1313/admin/tao-tu-vung-khai-niem.html
```

### Bước 4: Tạo Từ Vựng

1. **Nhập tên từ vựng - khái niệm** (bắt buộc)
2. **Nhập nội dung khái niệm** (bắt buộc)
3. **Nhập tags** (tùy chọn, phân cách bằng dấu phẩy)
4. **Nhập categories** (tùy chọn, phân cách bằng dấu phẩy)
5. Click **Preview** để xem trước
6. Click **Tạo Từ Vựng - Khái Niệm** để tạo

### Bước 5: Kiểm tra kết quả

Sau khi tạo thành công:
- ✅ File sẽ được tạo tại: `content/TU-KHAINIEM/[slug]/_index.md`
- ✅ Truy cập tại: `http://localhost:1313/tu-khainiem/[slug]/`
- ✅ Hugo sẽ tự động rebuild và hiển thị nội dung

---

## 🔧 Cấu trúc kỹ thuật

### API Endpoint

**Endpoint:** `POST http://localhost:3001/api/create-vocabulary`

**Request Body:**
```json
{
  "title": "Tên từ vựng",
  "content": "Nội dung khái niệm",
  "tags": ["tag1", "tag2"],
  "categories": ["category1", "category2"]
}
```

**Response Success:**
```json
{
  "success": true,
  "data": {
    "title": "Tên từ vựng",
    "slug": "ten-tu-vung",
    "filePath": "content/TU-KHAINIEM/ten-tu-vung/_index.md",
    "url": "/tu-khainiem/ten-tu-vung/"
  },
  "message": "Từ vựng đã được tạo thành công!"
}
```

**Response Error:**
```json
{
  "success": false,
  "error": "Tiêu đề không được để trống"
}
```

### Files đã thay đổi

1. **`simple-server.js`**
   - Thêm endpoint `/api/create-vocabulary`
   - Xử lý POST request
   - Tạo thư mục và file `_index.md`
   - Validation dữ liệu

2. **`public/admin/js/vocabulary-generator.js`**
   - Gọi API endpoint thật thay vì file HTML
   - Xử lý response từ server
   - Fallback mechanism khi API không khả dụng

---

## 🐛 Xử lý lỗi

### Lỗi: "Không thể tạo từ vựng"

**Nguyên nhân:** API server chưa chạy

**Giải pháp:**
```bash
npm run api
```

### Lỗi: "Từ vựng đã tồn tại"

**Nguyên nhân:** File đã được tạo trước đó

**Giải pháp:** 
- Đổi tên từ vựng
- Hoặc xóa file cũ trong `content/TU-KHAINIEM/[slug]/`

### Lỗi 404 khi truy cập URL

**Nguyên nhân:** Hugo chưa rebuild

**Giải pháp:**
- Đợi vài giây để Hugo tự động rebuild
- Hoặc restart Hugo server

---

## 📝 Ví dụ

### Tạo từ vựng "Tâm Thái"

**Input:**
- Tên: `Tâm Thái`
- Nội dung: `Tâm thái là trạng thái tâm lý, cách nhìn nhận và phản ứng của con người đối với các sự kiện, tình huống trong cuộc sống.`
- Tags: `TVHL Giàu Trí tuệ, Nội tâm`
- Categories: `Khái niệm nguồn`

**Output:**
- File: `content/TU-KHAINIEM/tam-thai/_index.md`
- URL: `http://localhost:1313/tu-khainiem/tam-thai/`

**Nội dung file:**
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

<!-- **Mã:** 
**Nhóm:**  -->

## Khái Niệm

Tâm thái là trạng thái tâm lý, cách nhìn nhận và phản ứng của con người đối với các sự kiện, tình huống trong cuộc sống.
```

---

## ✅ Checklist

Trước khi tạo từ vựng, đảm bảo:

- [ ] API server đang chạy (`npm run api`)
- [ ] Hugo server đang chạy (`hugo server -D`)
- [ ] Đã nhập đầy đủ tên và nội dung
- [ ] Tên từ vựng chưa tồn tại

---

## 🎉 Kết luận

Giờ đây bạn có thể tạo từ vựng - khái niệm THỰC SỰ qua Admin Panel:

1. ✅ File được tạo trong `content/TU-KHAINIEM/`
2. ✅ Hugo tự động rebuild
3. ✅ Truy cập URL không bị 404
4. ✅ Nội dung hiển thị đầy đủ

**Chúc bạn tạo từ vựng thành công!** 🚀
