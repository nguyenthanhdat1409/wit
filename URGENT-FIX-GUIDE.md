# 🚨 Hướng Dẫn Fix Khẩn Cấp - Iframe + Authentication

## 🔍 **Vấn đề hiện tại:**
1. ❌ **Iframe bị chặn**: `X-Frame-Options: sameorigin`
2. ❌ **Authentication lỗi**: JWT 403, Basic Auth 401

## 🛠️ **GIẢI PHÁP 1: Fix Iframe (Ưu tiên cao)**

### **Cách nhanh nhất - Thêm vào WordPress:**

#### **Option A: Code Snippets Plugin (Khuyến nghị)**
1. Vào WordPress Admin → **Snippets** → **Add New**
2. **Title**: `Quick Iframe Fix`
3. **Code**: Copy từ file `quick-iframe-fix.php`
4. **Save Changes and Activate**

#### **Option B: Thêm vào functions.php**
1. Vào WordPress Admin → **Appearance** → **Theme Editor**
2. Chọn **functions.php**
3. Thêm code từ `quick-iframe-fix.php` vào cuối file
4. **Update File**

#### **Option C: .htaccess (Nếu có quyền)**
1. Vào cPanel → **File Manager**
2. Tìm file `.htaccess` trong thư mục gốc WordPress
3. Thêm code:
```apache
<IfModule mod_headers.c>
    Header always unset X-Frame-Options
    Header always set X-Frame-Options "ALLOWALL"
</IfModule>
```

## 🛠️ **GIẢI PHÁP 2: Fix Authentication (Tạm thời)**

### **Bypass Authentication để test iframe:**

1. **Mở browser console** trên `https://wikiw.vn`
2. **Copy và paste** code từ file `auth-bypass-solution.js`
3. **Chạy lệnh**:
```javascript
window.handleLogin = handleLoginBypass;
window.handleRegister = handleRegisterBypass;
```
4. **Thử đăng nhập/đăng ký** - sẽ hoạt động ở bypass mode
5. **Test iframe** sau khi đăng nhập thành công

## 🎯 **Thứ tự ưu tiên:**

### **Bước 1: Fix Iframe (Quan trọng nhất)**
- ✅ Thêm code fix vào WordPress
- ✅ Test iframe hiển thị nội dung

### **Bước 2: Test Authentication**
- ✅ Sử dụng bypass mode để test
- ✅ Verify user profile modal hoạt động

### **Bước 3: Fix Authentication thật**
- ✅ Cấu hình JWT plugin đúng cách
- ✅ Hoặc setup Application Passwords

## 🔧 **Troubleshooting:**

### **Nếu iframe vẫn bị chặn:**
1. **Clear cache** WordPress và browser
2. **Thử incognito mode**
3. **Kiểm tra plugin security** có override headers không
4. **Thử .htaccess method**

### **Nếu bypass không hoạt động:**
1. **Kiểm tra console** có lỗi JavaScript không
2. **Refresh trang** sau khi paste code
3. **Thử trên trang khác** nếu cần

## 📞 **Hỗ trợ nhanh:**

### **Test ngay:**
1. Fix iframe trước (quan trọng nhất)
2. Sử dụng bypass để test functionality
3. Báo cáo kết quả để fix authentication thật

### **Nếu cần hỗ trợ:**
- Gửi screenshot lỗi
- Copy console logs
- Mô tả bước đã thực hiện

## ⚡ **Quick Commands:**

### **Test iframe fix:**
```bash
# Mở browser console và chạy:
fetch('https://admin.wikiw.vn/wp-json/wp/v2/posts/1')
  .then(r => console.log('Headers:', r.headers.get('X-Frame-Options')))
```

### **Test bypass mode:**
```javascript
// Trong console:
localStorage.setItem('auth_user', JSON.stringify({id: 1, name: 'Test', email: 'test@test.com'}));
location.reload();
```

**Mục tiêu: Fix iframe trước, test functionality, sau đó fix authentication thật!** 🎯
