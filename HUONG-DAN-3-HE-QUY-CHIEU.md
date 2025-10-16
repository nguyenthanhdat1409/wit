# 🎯 Hướng dẫn Trang 3 Hệ Quy Chiếu

## 📋 Tổng quan

Đã tạo thành công trang **3 Hệ Quy Chiếu** với các tính năng tương tự trang **Khái Niệm Nguồn**, bao gồm:

- ✅ Call API từ WordPress endpoint mới
- ✅ CSS responsive đầy đủ (desktop, tablet, mobile)
- ✅ Popup modal hiển thị nội dung
- ✅ Tông màu tím nhẹ (purple theme)

## 🔗 Truy cập

**URL:** http://localhost:1313/3-he-quy-chieu/

**Menu:** Khái niệm → 🎯 3 Hệ quy chiếu

## 🛠️ Files đã tạo

### 1. Content File
**Path:** `content/3-HE-QUY-CHIEU/_index.md`

- Trang chính với logic call API
- Endpoint: `https://admin.wikiw.vn/wp-json/custom/v1/3hequychieu-contents`
- JavaScript functions:
  - `loadHeQuyChieuData()` - Load dữ liệu từ API
  - `displayHeQuyChieuContent()` - Hiển thị content
  - `openHeQuyChieuLesson()` - Mở popup
  - `closeHeQuyChieuIframe()` - Đóng popup
  - `hideWordPressHeaderHeQuyChieu()` - Ẩn header WordPress

### 2. Layout Template
**Path:** `themes/happymarket-theme/layouts/3hequychieu-lessons.html`

- Layout riêng với tông màu tím
- CSS responsive hoàn chỉnh
- Popup modal với iframe

### 3. Menu Configuration
**Path:** `config.yaml`

- Đã thêm menu item "🎯 3 Hệ quy chiếu" vào phần "Khái niệm"
- Weight: 31.5 (giữa "Khái niệm nguồn" và "Thư viện khái niệm")

## 🎨 Màu sắc

### Tông màu tím nhẹ:
- **Primary:** `#9333ea` (purple-600)
- **Secondary:** `#7e22ce` (purple-700)
- **Hover:** `#6b21a8` (purple-800)
- **Background:** Gradient từ `purple-50` qua `violet-50` đến `fuchsia-50`

### Card Styling:
- Background: Linear gradient từ trắng qua `#faf5ff` (purple-50)
- Border hover: `#a855f7` (purple-500)
- Shadow: Màu tím nhạt `rgba(147, 51, 234, 0.25)`

### Modal/Popup:
- Overlay: `rgba(88, 28, 135, 0.8)` (purple-900 với opacity)
- Header: Linear gradient `#9333ea` → `#7e22ce`
- Shadow: `rgba(147, 51, 234, 0.3)`

## 📱 Responsive Design

### Desktop (> 1200px)
- Grid: 3-4 columns (auto-fill, minmax 320px)
- Card height: 300px
- Modal: 1200px x 800px

### Tablet (768px - 1024px)
- Grid: 2-3 columns (auto-fill, minmax 280px)
- Modal: 90vw x 80vh
- Reduced gaps and padding

### Mobile (< 768px)
- Grid: 1 column
- Card: auto height, min 280px
- Modal: 95vw x 85vh
- Font size reduced

### Extra Small (< 480px)
- Grid: 1 column
- Card: min 260px
- Modal: fullscreen (100vw x 100vh)
- Special header hiding for WordPress iframe

## 🚀 Tính năng

### 1. Call API
```javascript
const apiUrl = 'https://admin.wikiw.vn/wp-json/custom/v1/3hequychieu-contents';

fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayHeQuyChieuContent(data))
    .catch(error => displayHeQuyChieuError(error));
```

### 2. Grid Layout
- Responsive grid với `auto-fill`
- Minimum card width: 320px (desktop), 280px (mobile)
- Gap: 1.5rem (desktop), 1rem (mobile)

### 3. Card Component
- Title với gradient text
- Excerpt với line-clamp (4 dòng desktop, 3 dòng mobile)
- Button "📖 Đọc thêm" với màu tím
- Hover effect: transform + shadow

### 4. Popup Modal
- Fixed overlay với backdrop blur
- Iframe hiển thị nội dung WordPress
- Close button và close on ESC key
- Close on click outside
- Hide WordPress header tự động

### 5. Error Handling
- Loading state
- Error display với thông tin chi tiết
- Fallback content

## 🔄 API Data Structure

API endpoint trả về cấu trúc:
```json
{
  "data": {
    "contents": {
      "nodes": [
        {
          "title": "Tiêu đề bài viết",
          "content": "Nội dung HTML...",
          "link": "https://..."
        }
      ]
    }
  }
}
```

## 📝 Cách sử dụng

### 1. Truy cập trang
- Mở trình duyệt: `http://localhost:1313/3-he-quy-chieu/`
- Hoặc từ menu: **Khái niệm** → **🎯 3 Hệ quy chiếu**

### 2. Xem danh sách
- Trang sẽ tự động load dữ liệu từ API
- Hiển thị grid cards với tiêu đề và excerpt

### 3. Đọc bài viết
- Click button "📖 Đọc thêm" trên card
- Popup modal mở ra với iframe hiển thị full content
- WordPress header sẽ tự động bị ẩn

### 4. Đóng popup
- Click nút × (close button)
- Click ra ngoài popup
- Nhấn phím ESC

## 🔧 Customization

### Thay đổi màu sắc
Chỉnh sửa file `themes/happymarket-theme/layouts/3hequychieu-lessons.html`:

```css
/* Màu chính */
background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);

/* Màu hover */
background: linear-gradient(135deg, #7e22ce 0%, #6b21a8 100%);

/* Background gradient */
background: linear-gradient(145deg, #ffffff 0%, #faf5ff 50%, #ffffff 100%);
```

### Thay đổi API endpoint
Chỉnh sửa file `content/3-HE-QUY-CHIEU/_index.md`:

```javascript
const apiUrl = 'https://your-wordpress-site.com/wp-json/custom/v1/your-endpoint';
```

### Thay đổi card layout
Chỉnh sửa CSS trong layout file:

```css
.hequychieu-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
}

.hequychieu-card {
    height: 300px; /* Thay đổi chiều cao */
}
```

## 🐛 Troubleshooting

### 1. API không load
- Kiểm tra console: `F12` → Console
- Verify endpoint URL
- Check CORS settings

### 2. Popup không hiển thị
- Kiểm tra z-index conflicts
- Check JavaScript errors in console
- Verify modal functions được define

### 3. Responsive không hoạt động
- Clear browser cache
- Check CSS media queries
- Test với DevTools responsive mode

### 4. WordPress header vẫn hiển thị
- Kiểm tra CORS restrictions
- Thử overlay method
- Adjust CSS trong `hideWordPressHeaderHeQuyChieu()`

## 📊 So sánh với Khái Niệm Nguồn

| Tính năng | Khái Niệm Nguồn | 3 Hệ Quy Chiếu |
|-----------|-----------------|----------------|
| API Endpoint | `/khainiem-contents` | `/3hequychieu-contents` |
| Màu sắc | Hồng (pink) | Tím (purple) |
| Layout | `khainiem-lessons.html` | `3hequychieu-lessons.html` |
| CSS Classes | `khainiem-*` | `hequychieu-*` |
| Functions | `loadKhaiNiemData()` | `loadHeQuyChieuData()` |
| Grid | Auto-fill 320px | Auto-fill 320px |
| Responsive | ✅ Full | ✅ Full |
| Popup | ✅ Modal | ✅ Modal |

## 🚀 Deploy

### Production
Khi deploy lên production, trang sẽ tự động:
- Build bởi Hugo
- Serve từ `/3-he-quy-chieu/`
- Call API từ WordPress production endpoint

### Testing
```bash
# Local development
hugo server -D

# Build production
hugo --minify

# Test build
hugo server --disableFastRender
```

## 📝 Git Commit

Đã commit với message:
```
Add 3-he-quy-chieu page with purple theme
```

Files changed:
- `content/3-HE-QUY-CHIEU/_index.md` (new)
- `themes/happymarket-theme/layouts/3hequychieu-lessons.html` (new)
- `config.yaml` (modified)

## 🔗 Links liên quan

- Trang gốc: `/khai-niem-nguon/`
- API Documentation: (nếu có)
- WordPress Admin: `https://admin.wikiw.vn/`

---

**Lưu ý:** Đảm bảo WordPress endpoint `/3hequychieu-contents` đã được config đúng và trả về data theo cấu trúc expected.

