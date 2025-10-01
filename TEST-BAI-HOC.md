# Hướng dẫn Test Trang Tạo Bài Học

## 1. Test Local (Development)

### Bước 1: Khởi động server

```bash
# Khởi động Hugo server
hugo server -D

# Server sẽ chạy tại: http://localhost:1313
```

### Bước 2: Truy cập trang admin

Mở trình duyệt và truy cập:
```
http://localhost:1313/admin/tao-bai-hoc.html
```

### Bước 3: Test các chức năng

#### A. Nhập Tên Bài Học
- Nhập tên bài học vào ô "Tên Bài Học"
- VD: "Bài Học Test - Nguyên lý Kích hoạt Não"

#### B. Test Hình và Khái Niệm
**Hình Bài Học:**
- Nhập URL hình ảnh
- VD: `https://images.unsplash.com/photo-1516414447565-b14be0adf13e`
- Kiểm tra preview hình ảnh hiển thị đúng

**Khái Niệm:**
- Nhập nội dung khái niệm
- VD: "Nguyên lý kích hoạt não là..."
- Kiểm tra textarea hiển thị đúng

#### C. Test Bài Học Liên Quan
1. Click nút "➕ Thêm Bài Học Liên Quan"
2. Nhập URL hình: `https://example.com/image1.jpg`
3. Nhập đường dẫn: `/bai-hoc/bai-hoc-1`
4. Thêm thêm 2-3 bài học liên quan
5. Test nút xóa (🗑️) để xóa item

#### D. Test Khái Niệm Liên Quan
1. Click nút "➕ Thêm Khái Niệm Liên Quan"
2. Nhập từ khóa: "Nguyên Lý Ánh Sáng"
3. Nhập link: `/khai-niem-nguon/nguyen-ly-anh-sang`
4. Thêm thêm 2-3 khái niệm
5. Test nút xóa

#### E. Test Trọng Điểm (Optional)
1. **Trọng Điểm Tri Thức:**
   - Tick checkbox "Trọng Điểm Tri Thức"
   - Nhập link: `/trong-diem/tri-thuc-1`
   - Kiểm tra input được enable khi tick

2. **Trọng Điểm Nhận Thức:**
   - Tick checkbox "Trọng Điểm Nhận Thức"
   - Nhập link: `/trong-diem/nhan-thuc-1`
   - Kiểm tra input được enable khi tick

### Bước 4: Test Preview

1. Click nút "👁️ Xem Preview"
2. Kiểm tra:
   - ✅ Tên bài học hiển thị đúng
   - ✅ Hình ảnh hiển thị đúng
   - ✅ Khái niệm hiển thị trong box
   - ✅ Bài học liên quan hiển thị dạng grid responsive
   - ✅ Khái niệm liên quan hiển thị dạng table
   - ✅ Trọng điểm hiển thị dạng list có link

### Bước 5: Test Tạo Bài Học

**⚠️ LƯU Ý:** 
- Local test sẽ BÁO LỖI vì không có Netlify Functions
- Đây là bình thường! Để test đầy đủ, cần deploy lên Netlify

**Kỳ vọng khi test local:**
```
❌ Error: Không thể kết nối API. Vui lòng đảm bảo server đang chạy.
```

Điều này là ĐÚNG vì:
- Netlify Functions chỉ chạy khi deploy hoặc dùng `netlify dev`
- Local Hugo server không hỗ trợ Netlify Functions

---

## 2. Test với Netlify Dev (Recommended)

### Bước 1: Cài đặt Netlify CLI

```bash
npm install -g netlify-cli
```

### Bước 2: Khởi động Netlify Dev

```bash
netlify dev

# Server sẽ chạy tại: http://localhost:8888
```

### Bước 3: Test tạo bài học

1. Truy cập: `http://localhost:8888/admin/tao-bai-hoc.html`
2. Điền đầy đủ thông tin
3. Click "✨ Tạo Bài Học"
4. Kiểm tra:
   - ✅ Loading spinner hiển thị
   - ✅ Message thành công: "🎉 Tạo bài học thành công!"
   - ✅ Redirect về trang bài học sau 3 giây

### Bước 4: Kiểm tra file được tạo

```bash
# Kiểm tra folder BAI-HOC
ls content/BAI-HOC/

# Kiểm tra nội dung file vừa tạo
cat content/BAI-HOC/[slug-bai-hoc]/_index.md
```

**Kỳ vọng:**
- File markdown được tạo đúng cấu trúc
- Có đầy đủ frontmatter
- Nội dung markdown render đúng

---

## 3. Test trên Netlify Deploy

### Bước 1: Push code lên GitHub

```bash
git add .
git commit -m "feat: add new lesson creation page"
git push origin main
```

### Bước 2: Đợi Netlify auto-deploy

- Vào Netlify Dashboard
- Kiểm tra deploy status
- Đợi deploy thành công (~2-3 phút)

### Bước 3: Test trên production

1. Truy cập: `https://your-site.netlify.app/admin/tao-bai-hoc.html`
2. Điền form và tạo bài học
3. Kiểm tra:
   - ✅ API call thành công
   - ✅ File được commit vào GitHub
   - ✅ Netlify auto-rebuild
   - ✅ Bài học hiển thị trên site sau ~2-3 phút

---

## 4. Test Cases

### ✅ Test Case 1: Tạo bài học cơ bản (chỉ Tên)
- **Input:** Chỉ nhập tên bài học
- **Expected:** Tạo thành công với cấu trúc tối thiểu

### ✅ Test Case 2: Tạo bài học đầy đủ
- **Input:** Điền tất cả fields
- **Expected:** Tạo thành công với cấu trúc hoàn chỉnh

### ✅ Test Case 3: Tạo bài học với nhiều related items
- **Input:** Thêm 4-5 bài học liên quan và khái niệm
- **Expected:** Grid responsive, table hiển thị đúng

### ✅ Test Case 4: Tạo bài học chỉ với Tri Thức
- **Input:** Tick checkbox Tri Thức, nhập link
- **Expected:** Chỉ hiển thị Trọng Điểm Tri Thức

### ✅ Test Case 5: Tạo bài học chỉ với Nhận Thức
- **Input:** Tick checkbox Nhận Thức, nhập link
- **Expected:** Chỉ hiển thị Trọng Điểm Nhận Thức

### ✅ Test Case 6: Tạo bài học với cả 2 Trọng Điểm
- **Input:** Tick cả 2 checkboxes
- **Expected:** Hiển thị cả 2 items trong list

### ✅ Test Case 7: Test responsive
- **Input:** Test trên mobile, tablet, desktop
- **Expected:** Layout responsive, grid thay đổi theo breakpoints

### ✅ Test Case 8: Test xóa related items
- **Input:** Thêm item rồi click nút 🗑️
- **Expected:** Item bị xóa khỏi form

---

## 5. Troubleshooting

### ⚠️ Lỗi: "Không thể kết nối API"
**Nguyên nhân:** 
- Đang test local với Hugo server
- Netlify Functions không chạy

**Giải pháp:**
- Dùng `netlify dev` thay vì `hugo server`
- Hoặc deploy lên Netlify để test

### ⚠️ Lỗi: "GITHUB_TOKEN not set"
**Nguyên nhân:** 
- Thiếu environment variable trên Netlify

**Giải pháp:**
```bash
# Vào Netlify Dashboard
# Settings > Environment Variables
# Thêm: GITHUB_TOKEN = your_github_token
```

### ⚠️ Preview không hiển thị hình
**Nguyên nhân:**
- URL hình không hợp lệ
- CORS issue

**Giải pháp:**
- Dùng URL hình từ Unsplash hoặc Imgur
- Kiểm tra URL có thể truy cập công khai

---

## 6. Quick Test Script

Chạy script test nhanh:

```bash
# Test 1: Check files exist
echo "✅ Checking files..."
test -f static/admin/tao-bai-hoc.html && echo "✅ HTML file exists"
test -f public/admin/tao-bai-hoc.html && echo "✅ Public HTML file exists"
test -f netlify/functions/create-lesson-new.js && echo "✅ Netlify function exists"

# Test 2: Start Netlify Dev
echo "🚀 Starting Netlify Dev..."
netlify dev
```

---

## 7. Expected Results

### Sau khi tạo bài học thành công:

**File Structure:**
```
content/BAI-HOC/
  └── bai-hoc-test/
      └── _index.md
```

**File Content:**
```markdown
---
title: "Bài Học Test"
description: ""
date: 2025-10-01
draft: false
weight: 100
tags: ["bài-học"]
categories: ["bai-hoc"]
---

# Bài Học Test

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  <div>
    <h2>Hình Bài Học</h2>
    ![Bài Học Test](https://example.com/image.jpg)
  </div>
  <div>
    <h2>Khái Niệm</h2>
    <div class="bg-gray-50 p-4 rounded-lg">
      Nội dung khái niệm...
    </div>
  </div>
</div>

## Bài Học Liên Quan
...

## Khái Niệm Liên Quan
...

## Mục
...
```

**URL Access:**
```
http://localhost:8888/bai-hoc/bai-hoc-test/
```

---

## 8. Performance Check

- ✅ Trang load < 2 giây
- ✅ Form submit < 5 giây
- ✅ Preview render instant
- ✅ Responsive breakpoints work
- ✅ No console errors
- ✅ ARIA labels present
- ✅ Keyboard navigation works

---

**Chúc bạn test thành công! 🎉**

