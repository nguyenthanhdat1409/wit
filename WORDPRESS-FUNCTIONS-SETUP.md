# 🔧 WordPress Functions.php Setup Guide

## 📋 Tổng quan

Hướng dẫn chi tiết setup `functions.php` và các file cần thiết để kết nối WordPress với HappyMarketDocs authentication system.

## 🎯 Mục tiêu

- ✅ Cấu hình `functions.php` cho authentication
- ✅ Setup JWT Authentication plugin
- ✅ Cấu hình CORS và security headers
- ✅ Enable user registration
- ✅ Test API endpoints

## 📁 Các file cần chỉnh sửa

### 1. `wp-config.php` (File chính - QUAN TRỌNG NHẤT)

**Vị trí**: `/wp-config.php` (root directory của WordPress)

**Nội dung cần thêm**:

```php
<?php
// ... existing code ...

// ===== JWT AUTHENTICATION CONFIGURATION =====
// JWT Secret Key - TẠO KEY MỚI CHO MỖI SITE
define('JWT_AUTH_SECRET_KEY', 'your-super-secret-jwt-key-here-make-it-long-and-random');

// Enable CORS for JWT
define('JWT_AUTH_CORS_ENABLE', true);

// JWT Token expiration (optional - default 24 hours)
define('JWT_AUTH_EXPIRATION', 24 * 60 * 60); // 24 hours in seconds

// ===== SECURITY CONFIGURATION =====
// Disable file editing from admin
define('DISALLOW_FILE_EDIT', true);

// Increase memory limit for API
define('WP_MEMORY_LIMIT', '256M');

// Enable debug mode (chỉ dùng khi development)
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);

// ... existing code ...
?>
```

**🔑 Cách tạo JWT Secret Key**:

```bash
# Option 1: Sử dụng online generator
# Truy cập: https://api.wordpress.org/secret-key/1.1/salt/

# Option 2: Tạo random string
# Sử dụng: https://www.uuidgenerator.net/

# Option 3: Command line (nếu có access)
openssl rand -base64 64
```

### 2. `functions.php` (Theme file)

**Vị trí**: `/wp-content/themes/your-theme/functions.php`

**Nội dung cần thêm**:

```php
<?php
// ... existing code ...

// ===== CORS CONFIGURATION =====
function add_cors_http_header() {
    // Allow requests from HappyMarketDocs domain
    $allowed_origins = array(
        'https://your-happymarketdocs-domain.com',
        'http://localhost:1313', // For local development
        'https://localhost:1313'  // For local development with SSL
    );
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-WP-Nonce");
    header("Access-Control-Allow-Credentials: true");
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
add_action('init', 'add_cors_http_header');

// ===== SECURITY HEADERS =====
function add_security_headers() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
}
add_action('send_headers', 'add_security_headers');

// ===== REST API CUSTOMIZATION =====
// Add custom fields to user endpoint
function add_custom_user_fields($response, $user, $request) {
    $response->data['display_name'] = $user->display_name;
    $response->data['first_name'] = $user->first_name;
    $response->data['last_name'] = $user->last_name;
    $response->data['avatar_url'] = get_avatar_url($user->ID);
    
    return $response;
}
add_filter('rest_prepare_user', 'add_custom_user_fields', 10, 3);

// ===== USER REGISTRATION CUSTOMIZATION =====
// Allow user registration via REST API
function allow_user_registration() {
    return true;
}
add_filter('rest_allow_user_registration', 'allow_user_registration');

// Customize user registration response
function customize_user_registration_response($response, $user, $request) {
    $response->data['message'] = 'User registered successfully';
    $response->data['user_id'] = $user->ID;
    
    return $response;
}
add_filter('rest_prepare_user', 'customize_user_registration_response', 10, 3);

// ===== LOGIN/LOGOUT LOGGING =====
function log_user_login($user_login, $user) {
    error_log("User login: $user_login (ID: {$user->ID}) at " . current_time('mysql'));
}
add_action('wp_login', 'log_user_login', 10, 2);

function log_user_logout() {
    $user = wp_get_current_user();
    if ($user->ID) {
        error_log("User logout: {$user->user_login} (ID: {$user->ID}) at " . current_time('mysql'));
    }
}
add_action('wp_logout', 'log_user_logout');

// ===== API RATE LIMITING =====
function add_api_rate_limiting() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $endpoint = $_SERVER['REQUEST_URI'];
    
    // Simple rate limiting for auth endpoints
    if (strpos($endpoint, '/wp-json/jwt-auth/') !== false) {
        $transient_key = 'api_rate_limit_' . md5($ip . $endpoint);
        $attempts = get_transient($transient_key);
        
        if ($attempts === false) {
            set_transient($transient_key, 1, 300); // 5 minutes
        } elseif ($attempts >= 10) { // Max 10 attempts per 5 minutes
            wp_die('Rate limit exceeded. Please try again later.', 'Rate Limit', array('response' => 429));
        } else {
            set_transient($transient_key, $attempts + 1, 300);
        }
    }
}
add_action('rest_api_init', 'add_api_rate_limiting');

// ===== CUSTOM AUTHENTICATION ENDPOINTS =====
// Add custom endpoint for user profile update
function register_custom_auth_endpoints() {
    register_rest_route('happymarket/v1', '/profile', array(
        'methods' => 'POST',
        'callback' => 'update_user_profile',
        'permission_callback' => 'is_user_logged_in',
        'args' => array(
            'first_name' => array(
                'required' => false,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'last_name' => array(
                'required' => false,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'display_name' => array(
                'required' => false,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
        ),
    ));
}
add_action('rest_api_init', 'register_custom_auth_endpoints');

function update_user_profile($request) {
    $user_id = get_current_user_id();
    $params = $request->get_params();
    
    $user_data = array('ID' => $user_id);
    
    if (isset($params['first_name'])) {
        $user_data['first_name'] = $params['first_name'];
    }
    if (isset($params['last_name'])) {
        $user_data['last_name'] = $params['last_name'];
    }
    if (isset($params['display_name'])) {
        $user_data['display_name'] = $params['display_name'];
    }
    
    $result = wp_update_user($user_data);
    
    if (is_wp_error($result)) {
        return new WP_Error('update_failed', 'Failed to update profile', array('status' => 400));
    }
    
    return array(
        'success' => true,
        'message' => 'Profile updated successfully',
        'user_id' => $user_id
    );
}

// ===== PASSWORD RESET ENDPOINT =====
function register_password_reset_endpoint() {
    register_rest_route('happymarket/v1', '/password-reset', array(
        'methods' => 'POST',
        'callback' => 'handle_password_reset',
        'permission_callback' => '__return_true',
        'args' => array(
            'email' => array(
                'required' => true,
                'type' => 'string',
                'format' => 'email',
                'sanitize_callback' => 'sanitize_email',
            ),
        ),
    ));
}
add_action('rest_api_init', 'register_password_reset_endpoint');

function handle_password_reset($request) {
    $email = $request->get_param('email');
    $user = get_user_by('email', $email);
    
    if (!$user) {
        return new WP_Error('user_not_found', 'User not found', array('status' => 404));
    }
    
    // Generate reset key
    $key = get_password_reset_key($user);
    
    if (is_wp_error($key)) {
        return new WP_Error('reset_failed', 'Failed to generate reset key', array('status' => 500));
    }
    
    // Send reset email (you can customize this)
    $reset_url = network_site_url("wp-login.php?action=rp&key=$key&login=" . rawurlencode($user->user_login), 'login');
    
    // Here you would send the email
    // wp_mail($email, 'Password Reset', "Reset your password: $reset_url");
    
    return array(
        'success' => true,
        'message' => 'Password reset email sent',
        'reset_url' => $reset_url // Remove this in production
    );
}

// ... existing code ...
?>
```

### 3. `.htaccess` (Optional - for additional security)

**Vị trí**: `/wp-content/themes/your-theme/.htaccess` hoặc root `.htaccess`

```apache
# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Rate limiting for API endpoints
<IfModule mod_evasive24.c>
    DOSHashTableSize    2048
    DOSPageCount        10
    DOSSiteCount        50
    DOSPageInterval     1
    DOSSiteInterval     1
    DOSBlockingPeriod   600
</IfModule>
```

## 🔧 Bước setup chi tiết

### Bước 1: Backup WordPress

```bash
# Backup database
mysqldump -u username -p database_name > backup.sql

# Backup files
tar -czf wordpress-backup.tar.gz /path/to/wordpress/
```

### Bước 2: Cài đặt JWT Authentication Plugin

1. **Truy cập WordPress Admin**
   ```
   https://admin.wikiw.vn/wp-admin/
   ```

2. **Cài đặt Plugin**
   - Vào `Plugins` > `Add New`
   - Tìm kiếm: "JWT Authentication for WP REST API"
   - Cài đặt và kích hoạt

3. **Plugin URL**: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/

### Bước 3: Cấu hình wp-config.php

1. **Truy cập file wp-config.php**
   - Sử dụng FTP, cPanel File Manager, hoặc SSH
   - File nằm ở root directory của WordPress

2. **Thêm JWT configuration**
   ```php
   // Thêm trước dòng "/* That's all, stop editing! */"
   define('JWT_AUTH_SECRET_KEY', 'your-super-secret-key-here');
   define('JWT_AUTH_CORS_ENABLE', true);
   ```

### Bước 4: Cấu hình functions.php

1. **Truy cập functions.php**
   - Vào `Appearance` > `Theme Editor`
   - Chọn `functions.php`
   - Hoặc edit trực tiếp file: `/wp-content/themes/your-theme/functions.php`

2. **Thêm code CORS và security**

### Bước 5: Enable User Registration

1. **Vào WordPress Admin**
   - `Settings` > `General`
   - Check "Anyone can register"
   - Set "New User Default Role" = "Subscriber"

### Bước 6: Test API Endpoints

```bash
# Test REST API
curl "https://admin.wikiw.vn/wp-json/wp/v2/"

# Test JWT Authentication
curl -X POST "https://admin.wikiw.vn/wp-json/jwt-auth/v1/token" \
  -H "Content-Type: application/json" \
  -d '{"username":"your-username","password":"your-password"}'

# Test User Registration
curl -X POST "https://admin.wikiw.vn/wp-json/wp/v2/users" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","name":"Test User"}'
```

## 🧪 Test Script

Tạo file `test-wordpress-api.html` để test:

```html
<!DOCTYPE html>
<html>
<head>
    <title>WordPress API Test</title>
</head>
<body>
    <h1>WordPress API Test</h1>
    <button onclick="testAPI()">Test API</button>
    <div id="result"></div>

    <script>
    const WORDPRESS_URL = 'https://admin.wikiw.vn';
    
    async function testAPI() {
        const resultDiv = document.getElementById('result');
        
        try {
            // Test 1: Basic REST API
            resultDiv.innerHTML += '<h3>Testing REST API...</h3>';
            const apiResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/`);
            const apiData = await apiResponse.json();
            resultDiv.innerHTML += `<p>✅ REST API: ${apiData.name}</p>`;
            
            // Test 2: JWT Authentication
            resultDiv.innerHTML += '<h3>Testing JWT Authentication...</h3>';
            const loginResponse = await fetch(`${WORDPRESS_URL}/wp-json/jwt-auth/v1/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: 'your-username', // Thay bằng username thật
                    password: 'your-password'  // Thay bằng password thật
                })
            });
            
            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                resultDiv.innerHTML += `<p>✅ JWT Login: ${loginData.user_display_name}</p>`;
                
                // Test 3: Protected endpoint
                const userResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${loginData.token}`
                    }
                });
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    resultDiv.innerHTML += `<p>✅ User Data: ${userData.name}</p>`;
                } else {
                    resultDiv.innerHTML += `<p>❌ User Data: ${userResponse.status}</p>`;
                }
            } else {
                resultDiv.innerHTML += `<p>❌ JWT Login: ${loginResponse.status}</p>`;
            }
            
        } catch (error) {
            resultDiv.innerHTML += `<p>❌ Error: ${error.message}</p>`;
        }
    }
    </script>
</body>
</html>
```

## 🔍 Troubleshooting

### Lỗi thường gặp:

1. **"REST API disabled"**
   ```php
   // Thêm vào wp-config.php
   define('WP_REST_API_ENABLED', true);
   ```

2. **"CORS error"**
   ```php
   // Kiểm tra functions.php có CORS headers
   // Kiểm tra server có block CORS không
   ```

3. **"JWT token invalid"**
   ```php
   // Kiểm tra JWT_AUTH_SECRET_KEY trong wp-config.php
   // Đảm bảo plugin được kích hoạt
   ```

4. **"User registration failed"**
   ```php
   // Kiểm tra Settings > General > Anyone can register
   // Kiểm tra user role permissions
   ```

## 📊 Monitoring

### Log files để check:

1. **WordPress Error Log**
   ```
   /wp-content/debug.log
   ```

2. **Server Error Log**
   ```
   /var/log/apache2/error.log
   /var/log/nginx/error.log
   ```

3. **Plugin Logs**
   ```
   /wp-content/plugins/jwt-authentication-for-wp-rest-api/
   ```

## 🚀 Production Checklist

- [ ] SSL certificate installed
- [ ] Strong JWT secret key
- [ ] CORS properly configured
- [ ] User registration enabled
- [ ] Security headers added
- [ ] Rate limiting enabled
- [ ] Error logging enabled
- [ ] Regular backups configured

## 📞 Support

Nếu gặp vấn đề:

1. Check WordPress version >= 5.0
2. Check PHP version >= 7.4
3. Check plugin conflicts
4. Check server configuration
5. Check network connectivity

---

**Chúc bạn setup thành công!** 🎉

Sau khi setup xong, HappyMarketDocs sẽ có thể:
- ✅ Đăng nhập users qua WordPress
- ✅ Đăng ký users mới
- ✅ Lấy thông tin user profile
- ✅ Quản lý authentication state
