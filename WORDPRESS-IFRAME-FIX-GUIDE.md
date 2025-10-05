# 🔧 Hướng Dẫn Fix Lỗi Iframe WordPress

## 🚨 Vấn đề hiện tại
```
Refused to display 'https://admin.wikiw.vn/' in a frame because it set 'X-Frame-Options' to 'sameorigin'
```

WordPress mặc định chặn iframe để bảo mật, khiến không thể hiển thị nội dung trong iframe từ domain khác.

## 🛠️ Giải pháp: Sử dụng Code Snippets Plugin

### Bước 1: Cài đặt Code Snippets Plugin (nếu chưa có)
1. Vào WordPress Admin → **Plugins** → **Add New**
2. Tìm kiếm "Code Snippets"
3. Cài đặt và kích hoạt plugin **Code Snippets**

### Bước 2: Thêm Code Fix Iframe
1. Vào **Snippets** → **Add New**
2. **Title**: `WordPress Iframe Fix for Hugo`
3. **Code**: Copy toàn bộ nội dung từ file `wordpress-iframe-fix.php`
4. **Run snippet**: Chọn **Everywhere**
5. Click **Save Changes and Activate**

### Bước 3: Kiểm tra kết quả
1. Vào Hugo site: `https://wikiw.vn/bai-hoc-mtw7/`
2. Click vào một bài học
3. Iframe sẽ hiển thị nội dung WordPress mà không bị chặn

## 🔍 Cách hoạt động

### Code sẽ:
1. **Xóa X-Frame-Options header** cho phép iframe
2. **Thêm Content-Security-Policy** cho phép iframe từ wikiw.vn
3. **Thêm meta tags** để bypass iframe restrictions
4. **JavaScript tự động** ẩn header WordPress khi trong iframe

### Headers được thêm:
```
X-Frame-Options: ALLOW-FROM https://wikiw.vn
Content-Security-Policy: frame-ancestors 'self' https://wikiw.vn https://*.wikiw.vn
```

## 🎯 Kết quả mong đợi

### Trước khi fix:
- ❌ Iframe bị chặn với lỗi "X-Frame-Options: sameorigin"
- ❌ Không thể hiển thị nội dung WordPress
- ❌ Chỉ thấy trang trắng trong iframe

### Sau khi fix:
- ✅ Iframe hiển thị nội dung WordPress
- ✅ Header WordPress tự động ẩn
- ✅ Nội dung bài học hiển thị đầy đủ
- ✅ Responsive và đẹp trên mọi thiết bị

## 🔧 Troubleshooting

### Nếu vẫn bị chặn:
1. **Clear cache** WordPress và browser
2. **Kiểm tra plugin security** có thể override headers
3. **Thử incognito mode** để bypass cache
4. **Kiểm tra server config** có thể override headers

### Nếu iframe hiển thị nhưng có header WordPress:
1. **JavaScript sẽ tự động ẩn** header sau 1-2 giây
2. **Refresh trang** nếu header vẫn hiển thị
3. **Kiểm tra console** có lỗi JavaScript không

### Nếu không hoạt động:
1. **Kiểm tra Code Snippets** đã active chưa
2. **Kiểm tra code syntax** có lỗi không
3. **Thử deactivate/activate** snippet lại

## 🚀 Alternative Solutions

### Nếu Code Snippets không hoạt động:

#### Option 1: Thêm vào functions.php
```php
// Thêm vào cuối file functions.php
header_remove('X-Frame-Options');
header("X-Frame-Options: ALLOW-FROM https://wikiw.vn");
```

#### Option 2: Sử dụng .htaccess
```apache
# Thêm vào .htaccess
<IfModule mod_headers.c>
    Header always unset X-Frame-Options
    Header always set X-Frame-Options "ALLOW-FROM https://wikiw.vn"
</IfModule>
```

#### Option 3: Plugin Security Headers
1. Cài plugin "Security Headers"
2. Cấu hình để cho phép iframe từ wikiw.vn

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. **Kiểm tra WordPress error logs**
2. **Kiểm tra browser console** cho lỗi JavaScript
3. **Test trên nhiều browser** khác nhau
4. **Kiểm tra network tab** khi load iframe

## ⚠️ Lưu ý bảo mật

- Code này chỉ cho phép iframe từ domain wikiw.vn
- Không ảnh hưởng đến bảo mật của WordPress
- Chỉ áp dụng cho các trang bài học cụ thể
- Có thể disable bất kỳ lúc nào
