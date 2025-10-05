# 🔐 WordPress Authentication Setup Guide

## 📋 Tổng quan

Hướng dẫn thiết lập WordPress REST API để hỗ trợ authentication cho HappyMarketDocs website.

## 🎯 Mục tiêu

- ✅ Thiết lập WordPress REST API cho authentication
- ✅ Cài đặt JWT Authentication plugin
- ✅ Cấu hình CORS cho cross-origin requests
- ✅ Test authentication endpoints
- ✅ Tích hợp với HappyMarketDocs frontend

## 🚀 Bước 1: Cài đặt JWT Authentication Plugin

### 1.1 Cài đặt Plugin

1. **Truy cập WordPress Admin**
   ```
   https://admin.wikiw.vn/wp-admin/
   ```

2. **Cài đặt JWT Authentication Plugin**
   - Vào `Plugins` > `Add New`
   - Tìm kiếm "JWT Authentication for WP REST API"
   - Cài đặt và kích hoạt plugin

3. **Plugin khuyến nghị**: [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)

### 1.2 Cấu hình Plugin

1. **Thêm vào wp-config.php**
   ```php
   // JWT Authentication
   define('JWT_AUTH_SECRET_KEY', 'your-secret-key-here');
   define('JWT_AUTH_CORS_ENABLE', true);
   ```

2. **Tạo Secret Key**
   ```bash
   # Sử dụng online generator hoặc tạo random string
   # Ví dụ: https://api.wordpress.org/secret-key/1.1/salt/
   ```

## 🔧 Bước 2: Cấu hình REST API

### 2.1 Kiểm tra REST API

1. **Test endpoint cơ bản**
   ```bash
   curl "https://admin.wikiw.vn/wp-json/wp/v2/"
   ```

2. **Test users endpoint**
   ```bash
   curl "https://admin.wikiw.vn/wp-json/wp/v2/users"
   ```

### 2.2 Cấu hình Permalinks

1. **Vào WordPress Admin**
   - `Settings` > `Permalinks`
   - Chọn "Post name" hoặc "Custom Structure"
   - Click "Save Changes"

### 2.3 Cấu hình CORS (nếu cần)

1. **Thêm vào functions.php của theme**
   ```php
   // Enable CORS
   function add_cors_http_header(){
       header("Access-Control-Allow-Origin: *");
       header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
       header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
   }
   add_action('init','add_cors_http_header');
   ```

## 🔐 Bước 3: Cấu hình Authentication

### 3.1 JWT Authentication Endpoints

Sau khi cài đặt plugin, các endpoints sau sẽ có sẵn:

```
POST /wp-json/jwt-auth/v1/token
POST /wp-json/jwt-auth/v1/token/validate
POST /wp-json/jwt-auth/v1/token/revoke
```

### 3.2 Test Authentication

1. **Test Login**
   ```bash
   curl -X POST "https://admin.wikiw.vn/wp-json/jwt-auth/v1/token" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "your-username",
       "password": "your-password"
     }'
   ```

2. **Expected Response**
   ```json
   {
     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
     "user_email": "user@example.com",
     "user_nicename": "username",
     "user_display_name": "User Name"
   }
   ```

### 3.3 Test Token Validation

```bash
curl -X POST "https://admin.wikiw.vn/wp-json/jwt-auth/v1/token/validate" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 👥 Bước 4: Cấu hình User Registration

### 4.1 Enable User Registration

1. **Vào WordPress Admin**
   - `Settings` > `General`
   - Check "Anyone can register"
   - Set "New User Default Role" to "Subscriber"

### 4.2 Test User Registration

```bash
curl -X POST "https://admin.wikiw.vn/wp-json/wp/v2/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }'
```

## 🛡️ Bước 5: Security Configuration

### 5.1 Rate Limiting

1. **Cài đặt plugin rate limiting** (khuyến nghị)
   - Wordfence Security
   - WP Limit Login Attempts

### 5.2 SSL Configuration

1. **Đảm bảo HTTPS được bật**
   - JWT tokens chỉ nên được truyền qua HTTPS
   - Cấu hình redirect HTTP to HTTPS

### 5.3 API Security Headers

```php
// Thêm vào functions.php
function add_security_headers() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
}
add_action('send_headers', 'add_security_headers');
```

## 🧪 Bước 6: Testing với HappyMarketDocs

### 6.1 Test Script

Tạo file test để kiểm tra authentication:

```javascript
// test-auth.js
const WORDPRESS_URL = 'https://admin.wikiw.vn';

async function testAuth() {
    try {
        // Test login
        const loginResponse = await fetch(`${WORDPRESS_URL}/wp-json/jwt-auth/v1/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'test-user',
                password: 'test-password'
            })
        });
        
        if (loginResponse.ok) {
            const data = await loginResponse.json();
            console.log('Login successful:', data);
            
            // Test protected endpoint
            const userResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            });
            
            if (userResponse.ok) {
                const userData = await userResponse.json();
                console.log('User data:', userData);
            }
        } else {
            console.error('Login failed:', await loginResponse.text());
        }
    } catch (error) {
        console.error('Test error:', error);
    }
}

testAuth();
```

### 6.2 Test với Browser

1. **Mở Developer Tools**
2. **Chạy test script**
3. **Kiểm tra Network tab** để xem API calls

## 🔧 Bước 7: Troubleshooting

### 7.1 Lỗi thường gặp

1. **"REST API disabled"**
   - Kiểm tra plugin conflicts
   - Disable security plugins tạm thời
   - Kiểm tra .htaccess rules

2. **"CORS error"**
   - Cài đặt CORS plugin
   - Thêm CORS headers vào functions.php
   - Kiểm tra server configuration

3. **"JWT token invalid"**
   - Kiểm tra secret key trong wp-config.php
   - Đảm bảo plugin được kích hoạt
   - Kiểm tra token format

### 7.2 Debug Mode

```php
// Thêm vào wp-config.php để debug
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

## 📊 Bước 8: Monitoring & Analytics

### 8.1 Log Authentication Events

```php
// Thêm vào functions.php
function log_auth_events($user_login, $user) {
    error_log("User login: " . $user_login . " at " . current_time('mysql'));
}
add_action('wp_login', 'log_auth_events', 10, 2);
```

### 8.2 Monitor API Usage

1. **Cài đặt plugin analytics**
2. **Monitor failed login attempts**
3. **Track API response times**

## 🚀 Bước 9: Production Deployment

### 9.1 Security Checklist

- [ ] SSL certificate installed
- [ ] Strong JWT secret key
- [ ] Rate limiting enabled
- [ ] User registration properly configured
- [ ] CORS properly configured
- [ ] Security headers added
- [ ] Regular backups enabled

### 9.2 Performance Optimization

- [ ] Enable caching
- [ ] Optimize database
- [ ] Use CDN for static assets
- [ ] Monitor server resources

## 📞 Support & Maintenance

### 9.1 Regular Maintenance

1. **Update WordPress core**
2. **Update plugins**
3. **Monitor security logs**
4. **Backup database regularly**

### 9.2 Support Resources

- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [JWT Authentication Plugin Docs](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
- [WordPress Security Best Practices](https://wordpress.org/support/article/hardening-wordpress/)

## 🎯 Kết quả mong đợi

Sau khi hoàn thành setup:

✅ **WordPress REST API** hoạt động bình thường  
✅ **JWT Authentication** được cấu hình  
✅ **User registration** hoạt động  
✅ **CORS** được cấu hình đúng  
✅ **HappyMarketDocs** có thể authenticate users  
✅ **Security** được đảm bảo  

## 🔄 Next Steps

1. Test authentication với HappyMarketDocs
2. Cấu hình user roles và permissions
3. Thêm tính năng password reset
4. Implement user profile management
5. Add social login (optional)

---

**Chúc bạn setup thành công!** 🎉

Nếu gặp vấn đề, hãy kiểm tra:
1. WordPress version >= 5.0
2. PHP version >= 7.4
3. Plugin conflicts
4. Server configuration
5. Network connectivity
