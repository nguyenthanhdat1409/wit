# HappyMarketDocs Admin Panel

## 📋 Tổng quan

Admin Panel cho HappyMarketDocs cung cấp giao diện quản lý để tạo bài học dynamic từ 3 nguồn nội dung chính.

## 🚀 Tính năng

### 1. Tạo Bài Học Dynamic
- **Form tương tác**: Giao diện thân thiện với 3 dropdown chọn nguồn
- **Tìm kiếm**: Tìm kiếm nhanh trong danh sách files
- **Preview**: Xem trước nội dung trước khi lưu
- **Validation**: Kiểm tra đầy đủ thông tin trước khi tạo

### 2. Nguồn Nội dung
- **Hình ảnh** (`/content/HINH/`): 12 file hình ảnh minh họa
- **Khái niệm nguồn** (`/content/KHAI-NIEM-NGUON/`): 25+ khái niệm cốt lõi
- **Từ khái niệm** (`/content/TU-KHAINIEM/knn-nội-tâm/`): 22+ từ chuyên môn

### 3. Cấu trúc Bài Học
Mỗi bài học được tạo sẽ có cấu trúc:
```markdown
# [Tên bài học]

## Hình ảnh minh họa
[Nội dung từ file HINH]

## Khái niệm nguồn  
[Nội dung từ file KHAI-NIEM-NGUON]

## Từ - Khái niệm
[Nội dung từ file TU-KHAINIEM]

## Tổng kết
[Phần tổng hợp tự động]
```

## 🛠️ Cách sử dụng

### Truy cập Admin Panel
1. Mở trình duyệt và truy cập: `http://localhost:1313/admin/`
2. Click "Bắt đầu tạo" trong card "Tạo Bài Học"

### Tạo Bài Học Mới
1. **Nhập thông tin cơ bản**:
   - Tên bài học (bắt buộc)
   - URL slug (tự động tạo)

2. **Chọn nội dung từ 3 nguồn**:
   - Sử dụng dropdown hoặc tìm kiếm
   - Mỗi nguồn đều có tìm kiếm riêng

3. **Preview**:
   - Click "Preview" để xem nội dung ghép
   - Kiểm tra và chỉnh sửa nếu cần

4. **Tạo bài học**:
   - Click "Tạo Bài Học" để lưu
   - Hệ thống sẽ tạo file MD trong `/content/BAI-HOC/`

## 📁 Cấu trúc Files

```
/admin/
├── index.html              # Trang chủ admin
├── tao-bai-hoc.html        # Form tạo bài học
├── js/
│   ├── file-loader.js      # Load files từ API
│   ├── lesson-generator.js # Logic tạo bài học
│   └── preview.js          # Preview functionality
├── api/files/
│   ├── hinh                # API cho hình ảnh
│   ├── khai-niem-nguon     # API cho khái niệm nguồn
│   └── tu-khainiem         # API cho từ khái niệm
└── README.md               # Tài liệu này
```

## 🔧 Công nghệ sử dụng

- **Frontend**: HTML5, CSS3 (Tailwind), JavaScript (Vanilla)
- **API**: JSON files (có thể thay thế bằng API thực)
- **Integration**: Hugo static site generator
- **UI/UX**: Responsive design, modern interface

## 🎨 Giao diện

- **Design**: Gradient background với glassmorphism effect
- **Color Scheme**: Orange (#FF9900) chủ đạo, phù hợp với theme chính
- **Components**: Cards, dropdowns, preview panels
- **Responsive**: Hoạt động tốt trên mọi thiết bị

## 📝 API Endpoints

### GET `/api/files/hinh`
Trả về danh sách files hình ảnh
```json
[
  {
    "id": "3-goc-nhin-cua-con-nguoi",
    "title": "3 GỐC NHÌN CỦA CON NGƯỜI",
    "description": "Hình ảnh WNT36003 - 3 GỐC NHÌN CỦA CON NGƯỜI",
    "path": "/content/HINH/3-gốc-nhìn-của-con-người.md",
    "tags": ["hình-ảnh", "đồ-họa", "THẤU HIỂU NỘI TÂM - KIẾN TẠO AN VUI"],
    "category": "hinh"
  }
]
```

### GET `/api/files/khai-niem-nguon`
Trả về danh sách khái niệm nguồn

### GET `/api/files/tu-khainiem`
Trả về danh sách từ khái niệm

## 🚀 Phát triển

### Thêm nguồn nội dung mới
1. Thêm file JSON vào `/api/files/`
2. Cập nhật `file-loader.js` để load nguồn mới
3. Thêm UI component trong form

### Tùy chỉnh cấu trúc bài học
1. Chỉnh sửa `generateMarkdown()` trong `lesson-generator.js`
2. Cập nhật `markdownToHtml()` để render đúng

### Thêm validation
1. Chỉnh sửa `validateForm()` trong `preview.js`
2. Thêm custom validation rules

## 🔒 Bảo mật

- Form validation phía client
- Sanitize input trước khi tạo file
- Kiểm tra quyền truy cập (có thể thêm authentication)

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console browser để xem lỗi
2. Đảm bảo API endpoints hoạt động
3. Kiểm tra cấu trúc file content

---

**HappyMarketDocs Admin Panel** - Tạo bài học dễ dàng và hiệu quả! 🚀
