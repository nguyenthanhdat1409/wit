# Hướng Dẫn Sử Dụng WordPress GraphQL với Dữ Liệu Thực Tế

## Tình Trạng Hiện Tại

✅ **GraphQL Endpoint hoạt động**: `https://wit.convoi.com.vn/graphql`  
✅ **Có dữ liệu thực tế**: 10 posts với nội dung phong phú  
❌ **Cần authentication**: API trả về empty array khi không có auth  

## Dữ Liệu Thực Tế Có Sẵn

Bạn đã có 10 posts với nội dung phong phú:

1. **5 Sự so sánh** - ID: cG9zdDo1OTc1
2. **4 Động Lực Sinh Tồn** - ID: cG9zdDo1OTcy  
3. **3 Câu Hỏi Quan Trọng Trong Đời Người** - ID: cG9zdDo1OTUy
4. **NGUYÊN LÝ ÁNH SÁNG** - ID: cG9zdDo1OTA2
5. **TIÊU ĐỀ TEST MẪU** - ID: cG9zdDo1ODgx
6. **SỸ THÂN** - ID: cG9zdDo1NjYw
7. **PHI VẬT CHẤT** - ID: cG9zdDo1NjU3
8. **VẬT CHẤT** - ID: cG9zdDo1NjU1
9. **7 SỰ GIÀU TOÀN DIỆN** - ID: cG9zdDo1NjUz
10. **NGUYÊN LÝ NHỊ NGUYÊN** - ID: cG9zdDo1NjQx

## GraphQL Query Hoạt Động

Query này đã được test và hoạt động:

```graphql
{
  contents {
    nodes {
      id
      title
      content
      link
    }
  }
}
```

## Cách Sử Dụng

### 1. Test GraphQL API

```bash
# Test với dữ liệu thực tế
npm run wordpress:test-real

# Test trực tiếp
node test-real-graphql.js
```

### 2. Sử Dụng Admin Panel

```bash
# Khởi động dev server
npm run dev

# Truy cập admin panel
http://localhost:1313/admin/wordpress-integration.html
```

### 3. Cấu Hình Admin Panel

- **WordPress URL**: `https://wit.convoi.com.vn`
- **API Type**: Chọn "GraphQL (Recommended)"
- **Endpoint**: Posts
- **Username/Password**: (có thể cần để lấy dữ liệu)

### 4. Test Connection

1. Click "Test Connection" để kiểm tra
2. Nếu thành công, click "Lấy Dữ Liệu WordPress"
3. Xem kết quả trong panel bên phải

## Authentication

Nếu GraphQL trả về empty array, có thể cần authentication:

### Phương Pháp 1: Application Password

1. **Tạo Application Password**:
   - Vào WordPress Admin: `https://wit.convoi.com.vn/wp-admin/`
   - Users > Profile > Application Passwords
   - Tạo password mới

2. **Sử dụng trong Admin Panel**:
   - Username: `admin` (hoặc username của bạn)
   - Password: Application password (không phải password thường)

### Phương Pháp 2: Basic Auth

```bash
# Test với authentication
curl -X POST "https://wit.convoi.com.vn/graphql" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'username:password' | base64)" \
  -d '{"query":"{ contents { nodes { id title } } }"}'
```

## Data Format

GraphQL trả về data với format:

```json
{
  "data": {
    "contents": {
      "nodes": [
        {
          "id": "cG9zdDo1OTc1",
          "title": "5 Sự so sánh",
          "content": "<div class=\"wp-block-columns\">...</div>",
          "link": "https://wit.convoi.com.vn/content/5-su-so-sanh/"
        }
      ]
    }
  }
}
```

## Tính Năng Hỗ Trợ

✅ **GraphQL API** - Endpoint `/graphql` với dữ liệu thực tế  
✅ **Data Transformation** - Chuyển đổi GraphQL ID format  
✅ **Wiki Content Extraction** - Trích xuất nội dung từ HTML  
✅ **Export Options** - JSON, Markdown, Hugo content  
✅ **Admin Panel** - Interface thân thiện  
✅ **Authentication** - Hỗ trợ Basic Auth  

## Troubleshooting

### API Trả Về Empty Array
- Cần authentication (username/password)
- Kiểm tra Application Password
- Kiểm tra user permissions

### GraphQL Errors
- Kiểm tra query syntax
- Kiểm tra schema permissions
- Kiểm tra plugin configuration

### Data Format Issues
- ID format: `cG9zdDo1OTc1` (base64 encoded)
- Content: HTML format với WordPress blocks
- Link: Full URL format

## Next Steps

1. **Test với authentication** để lấy dữ liệu
2. **Sử dụng admin panel** để import content
3. **Export content** sang Hugo format
4. **Tích hợp** vào hệ thống documentation

## Liên Hệ

Nếu gặp vấn đề:
1. Kiểm tra authentication credentials
2. Kiểm tra GraphQL plugin permissions
3. Test với curl command trực tiếp
4. Xem error logs trong WordPress admin
