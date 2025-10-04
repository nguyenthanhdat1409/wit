# Hướng Dẫn Cài Đặt WordPress GraphQL Plugin

## Tình Trạng Hiện Tại

Hiện tại WordPress site `https://admin.wikiw.vn` chưa có plugin GraphQL được cài đặt. Để sử dụng GraphQL API, bạn cần cài đặt plugin WPGraphQL.

## Cách Cài Đặt Plugin GraphQL

### Phương Pháp 1: Cài Đặt Qua WordPress Admin (Khuyến Nghị)

1. **Truy cập WordPress Admin**
   - Vào: https://admin.wikiw.vn/wp-admin/
   - Đăng nhập với tài khoản admin

2. **Cài Đặt Plugin**
   - Vào menu `Plugins` > `Add New`
   - Tìm kiếm "WPGraphQL"
   - Cài đặt plugin "WPGraphQL" (tác giả: WPGraphQL)
   - Kích hoạt plugin

3. **Kiểm Tra Cài Đặt**
   - Vào `GraphQL` > `GraphiQL IDE` trong admin menu
   - Hoặc truy cập: https://admin.wikiw.vn/wp-admin/admin.php?page=graphql-ide

### Phương Pháp 2: Cài Đặt Thủ Công

1. **Tải Plugin**
   - Tải từ: https://wordpress.org/plugins/wp-graphql/
   - Hoặc từ GitHub: https://github.com/wp-graphql/wp-graphql

2. **Upload Plugin**
   - Upload file zip qua WordPress Admin
   - Hoặc upload qua FTP vào thư mục `/wp-content/plugins/`

3. **Kích Hoạt**
   - Vào `Plugins` > `Installed Plugins`
   - Kích hoạt "WPGraphQL"

## Test GraphQL API

Sau khi cài đặt, bạn có thể test GraphQL API:

### 1. Sử Dụng Admin Panel
```bash
npm run dev
# Truy cập: http://localhost:1313/admin/wordpress-integration.html
```

### 2. Sử Dụng Command Line
```bash
# Test GraphQL
npm run wordpress:test-graphql

# Test với authentication
npm run wordpress:test-auth https://admin.wikiw.vn username password
```

### 3. Test Trực Tiếp
```bash
# Test GraphQL endpoint
curl -X POST "https://admin.wikiw.vn/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ posts { nodes { id title } } }"}'
```

## GraphQL Queries Mẫu

### Lấy Posts
```graphql
query GetPosts {
  posts(first: 10) {
    nodes {
      id
      title
      content
      excerpt
      date
      slug
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
    }
  }
}
```

### Lấy Pages
```graphql
query GetPages {
  pages(first: 10) {
    nodes {
      id
      title
      content
      excerpt
      date
      slug
    }
  }
}
```

### Lấy Categories
```graphql
query GetCategories {
  categories(first: 20) {
    nodes {
      id
      name
      slug
      description
      count
    }
  }
}
```

## Fallback: REST API

Nếu GraphQL không khả dụng, hệ thống sẽ tự động fallback về REST API:

- Posts: `https://admin.wikiw.vn/wp-json/wp/v2/posts`
- Pages: `https://admin.wikiw.vn/wp-json/wp/v2/pages`
- Categories: `https://admin.wikiw.vn/wp-json/wp/v2/categories`
- Tags: `https://admin.wikiw.vn/wp-json/wp/v2/tags`

## Troubleshooting

### Lỗi 404 - GraphQL Endpoint Not Found
- Plugin chưa được cài đặt hoặc kích hoạt
- Kiểm tra trong WordPress Admin > Plugins

### Lỗi 403 - Forbidden
- Cần authentication (username/password)
- Sử dụng Application Password thay vì password thường

### Lỗi 500 - Internal Server Error
- Plugin có conflict với theme hoặc plugin khác
- Kiểm tra error logs trong WordPress

## Tính Năng Hỗ Trợ

Sau khi cài đặt GraphQL, bạn sẽ có:

✅ **GraphQL API** - Truy vấn linh hoạt và hiệu quả  
✅ **GraphiQL IDE** - Interface để test queries  
✅ **Authentication** - Hỗ trợ Basic Auth  
✅ **Fallback** - Tự động chuyển về REST API nếu cần  
✅ **Wiki Content Extraction** - Trích xuất nội dung wiki  
✅ **Export Options** - Xuất JSON, Markdown, Hugo content  

## Liên Hệ

Nếu gặp vấn đề trong quá trình cài đặt, vui lòng:
1. Kiểm tra WordPress version (cần >= 5.0)
2. Kiểm tra PHP version (cần >= 7.4)
3. Kiểm tra plugin conflicts
4. Xem error logs trong WordPress Admin
