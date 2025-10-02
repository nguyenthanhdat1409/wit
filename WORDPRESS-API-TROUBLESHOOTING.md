# WordPress API Troubleshooting Guide

## Tình Trạng Hiện Tại

WordPress site `https://wit.convoi.com.vn` hiện tại không thể truy cập qua REST API hoặc GraphQL API. Cả hai endpoint đều trả về lỗi 404.

## Nguyên Nhân Có Thể

### 1. REST API Bị Tắt
WordPress có thể đã tắt REST API thông qua:
- Plugin security
- Theme functions
- Server configuration
- .htaccess rules

### 2. Plugin GraphQL Chưa Cài Đặt
GraphQL endpoint `/graphql` không tồn tại vì plugin chưa được cài đặt.

### 3. Permalink Structure
URL structure có thể không đúng.

## Giải Pháp

### Bước 1: Kiểm Tra WordPress Admin

1. **Truy cập WordPress Admin**
   ```
   https://wit.convoi.com.vn/wp-admin/
   ```

2. **Kiểm Tra Permalinks**
   - Vào `Settings` > `Permalinks`
   - Chọn bất kỳ option nào (không phải "Plain")
   - Click "Save Changes"

3. **Kiểm Tra Plugins**
   - Vào `Plugins` > `Installed Plugins`
   - Tìm các plugin security có thể block API
   - Tạm thời deactivate các plugin security

### Bước 2: Cài Đặt WPGraphQL Plugin

1. **Cài Đặt Plugin**
   - Vào `Plugins` > `Add New`
   - Tìm kiếm "WPGraphQL"
   - Cài đặt và kích hoạt

2. **Kiểm Tra GraphQL**
   - Vào `GraphQL` > `GraphiQL IDE`
   - Hoặc truy cập: `https://wit.convoi.com.vn/wp-admin/admin.php?page=graphql-ide`

### Bước 3: Kiểm Tra Server Configuration

1. **Kiểm Tra .htaccess**
   ```apache
   # Thêm vào .htaccess nếu cần
   RewriteEngine On
   RewriteRule ^wp-json/(.*) /index.php?rest_route=/$1 [QSA,L]
   ```

2. **Kiểm Tra PHP Configuration**
   - Đảm bảo PHP >= 7.4
   - Kiểm tra memory_limit >= 256M

### Bước 4: Test API Endpoints

Sau khi cấu hình, test các endpoint:

```bash
# Test REST API
curl "https://wit.convoi.com.vn/wp-json/wp/v2/posts?per_page=1"

# Test GraphQL
curl -X POST "https://wit.convoi.com.vn/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ posts { nodes { id title } } }"}'
```

## Alternative Solutions

### 1. Sử Dụng XML-RPC
Nếu REST API không hoạt động, có thể sử dụng XML-RPC:

```bash
# Test XML-RPC
curl -X POST "https://wit.convoi.com.vn/xmlrpc.php" \
  -H "Content-Type: text/xml" \
  -d '<?xml version="1.0"?><methodCall><methodName>wp.getPosts</methodName><params><param><value><string>1</string></value></param><param><value><string>admin</string></value></param><param><value><string>password</string></value></param></params></methodCall>'
```

### 2. Sử Dụng WordPress CLI
Nếu có quyền truy cập server:

```bash
# Cài đặt WP-CLI
wp plugin install wp-graphql --activate
wp rewrite flush
```

### 3. Manual Content Export
Nếu API không khả dụng, có thể export content thủ công:
- Vào `Tools` > `Export`
- Chọn "All content" hoặc "Posts"
- Download file XML

## Test Scripts

Sau khi cấu hình, sử dụng các script test:

```bash
# Test GraphQL
npm run wordpress:test-graphql

# Test với authentication
npm run wordpress:test-auth https://wit.convoi.com.vn username password

# Test admin panel
npm run dev
# Truy cập: http://localhost:1313/admin/wordpress-integration.html
```

## Hỗ Trợ

Nếu vẫn gặp vấn đề:

1. **Kiểm tra WordPress version** (cần >= 5.0)
2. **Kiểm tra PHP version** (cần >= 7.4)
3. **Kiểm tra plugin conflicts**
4. **Xem error logs** trong WordPress Admin
5. **Liên hệ hosting provider** nếu cần

## Tính Năng Sẵn Sàng

Khi API hoạt động, bạn sẽ có:

✅ **GraphQL API** - Truy vấn linh hoạt  
✅ **REST API** - Fallback option  
✅ **Authentication** - Basic Auth support  
✅ **Wiki Content Extraction** - Trích xuất nội dung  
✅ **Export Options** - JSON, Markdown, Hugo  
✅ **Admin Panel** - Interface thân thiện  

## Next Steps

1. Cài đặt WPGraphQL plugin
2. Cấu hình permalinks
3. Test API endpoints
4. Sử dụng admin panel để import content
5. Export content sang Hugo format
