# 🔗 WordPress Integration Guide

## 📋 Tổng quan

Hệ thống WordPress Integration cho phép bạn:
- ✅ Kết nối với WordPress site qua REST API
- ✅ Trích xuất wiki content từ WordPress
- ✅ Tự động tạo Hugo content files
- ✅ Quản lý qua Admin Panel trực quan
- ✅ Export dữ liệu ra nhiều định dạng
- ✅ Tự động commit và push changes

## 🚀 Cách sử dụng

### 1. Admin Panel (Khuyến nghị)

**Truy cập:** `http://localhost:1313/admin/wordpress-integration.html`

**Các bước:**
1. Nhập WordPress URL của bạn
2. Chọn endpoint (posts, pages, categories, tags, media)
3. Cấu hình filters (search, categories, per page)
4. Click "Lấy Dữ Liệu WordPress"
5. Xem kết quả và export theo nhu cầu

**Tính năng:**
- 🔍 Test connection trước khi lấy dữ liệu
- 👀 Preview wiki content chi tiết
- 📊 Thống kê dữ liệu (số từ, hình ảnh, liên kết)
- 📁 Export JSON, Markdown, hoặc Hugo content
- 🎨 Giao diện đẹp với glassmorphism design

### 2. Command Line Script

**Cài đặt:**
```bash
# Cài đặt dependencies
npm install

# Thiết lập environment variable
export WORDPRESS_URL="https://your-wordpress-site.com"
```

**Sử dụng cơ bản:**
```bash
# Import tất cả posts
npm run wordpress:import

# Test trước khi import (dry run)
npm run wordpress:test

# Import với custom parameters
node scripts/wordpress-to-hugo.js \
  --url https://your-wordpress-site.com \
  --categories 1,2,3 \
  --per-page 50 \
  --search "tutorial"
```

**Tùy chọn command line:**
```bash
--url <url>           # WordPress site URL (required)
--endpoint <type>     # API endpoint (default: posts)
--per-page <number>   # Items per page (default: 20)
--categories <ids>    # Comma-separated category IDs
--tags <ids>          # Comma-separated tag IDs
--search <query>      # Search query
--output <dir>        # Output directory (default: ./content/wordpress-import)
--dry-run             # Preview without creating files
--help                # Show help
```

### 3. API Endpoint

**Endpoint:** `/.netlify/functions/wordpress-api`

**Method:** POST

**Request Body:**
```json
{
  "wordpressUrl": "https://your-wordpress-site.com",
  "endpoint": "posts",
  "params": {
    "per_page": 10,
    "search": "tutorial",
    "categories": "1,2,3"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "title": "Bài viết mẫu",
      "slug": "bai-viet-mau",
      "wikiContent": "Nội dung đã được trích xuất...",
      "wikiSections": [
        {
          "type": "heading",
          "text": "Tiêu đề chính",
          "level": 1
        }
      ],
      "wordCount": 500,
      "hasImages": true,
      "hasLinks": false,
      "lastUpdated": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "source": "WordPress REST API"
}
```

## 🎯 Tính năng Wiki Content Extraction

### Trích xuất tự động:

1. **Headings** (H1-H4)
   - Markdown: `# Tiêu đề`
   - HTML: `<h1>Tiêu đề</h1>`

2. **List Items**
   - Markdown: `- Item 1`
   - HTML: `<li>Item 1</li>`

3. **Important Paragraphs**
   - Tự động nhận diện đoạn văn chứa từ khóa quan trọng:
     - "định nghĩa", "khái niệm", "nguyên lý"
     - "quy luật", "công thức", "phương pháp"

4. **Metadata**
   - Số từ, tác giả, ngày tạo/sửa
   - Categories, tags, featured media
   - Có hình ảnh/liên kết hay không

### Ví dụ kết quả trích xuất:

```json
{
  "wikiContent": "Đây là nội dung chính đã được làm sạch...",
  "wikiSections": [
    {
      "type": "heading",
      "text": "Khái niệm cơ bản",
      "level": 1
    },
    {
      "type": "important_paragraph",
      "text": "Định nghĩa về khái niệm này là...",
      "keywords": ["định nghĩa"]
    },
    {
      "type": "list_item",
      "text": "Điểm quan trọng đầu tiên"
    }
  ]
}
```

## 📁 Cấu trúc Output

### Hugo Content Files

**Location:** `./content/wordpress-import/`

**Format:**
```markdown
---
title: "Tiêu đề bài viết"
description: "Mô tả ngắn gọn"
date: 2024-01-01T00:00:00Z
modified: 2024-01-01T00:00:00Z
draft: false
tags: ["tag1", "tag2"]
categories: ["category1", "category2"]
author: 1
slug: "slug-bai-viet"
type: "wordpress-import"
source: "wordpress"
source_url: "https://your-site.com/wp-json/wp/v2/posts/123"
word_count: 500
has_images: true
has_links: false
last_updated: "2024-01-01T00:00:00.000Z"
---

# Tiêu đề bài viết

Nội dung wiki đã được trích xuất...

## Các Section Trích Xuất

### heading

Khái niệm cơ bản

### important_paragraph

Định nghĩa về khái niệm này là...

---
*Nội dung được trích xuất từ WordPress tại https://your-wordpress-site.com*
```

### Index File

**File:** `./content/wordpress-import/_index.md`

**Nội dung:**
- Tổng quan số lượng bài viết
- Thống kê (số từ, hình ảnh, liên kết)
- Danh sách tất cả bài viết với links

## 🔧 Cấu hình nâng cao

### Environment Variables

```bash
# .env file
WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_USERNAME=your-username
WORDPRESS_PASSWORD=your-app-password
WORDPRESS_OUTPUT_DIR=./content/wordpress-import
```

### Custom Filters

**Trong Admin Panel:**
- Search query: Tìm kiếm theo từ khóa
- Categories: Lọc theo category IDs
- Per page: Số lượng items mỗi lần fetch
- Endpoint: posts, pages, categories, tags, media

**Trong Script:**
```bash
# Import chỉ posts có category ID 1, 2, 3
node scripts/wordpress-to-hugo.js \
  --url https://example.com \
  --categories 1,2,3

# Import posts có tag ID 5, 6
node scripts/wordpress-to-hugo.js \
  --url https://example.com \
  --tags 5,6

# Import posts chứa từ "tutorial"
node scripts/wordpress-to-hugo.js \
  --url https://example.com \
  --search "tutorial"
```

## 🛠️ Troubleshooting

### Lỗi thường gặp:

1. **"WordPress URL is required"**
   - Giải pháp: Thiết lập `WORDPRESS_URL` environment variable hoặc dùng `--url`

2. **"HTTP 404: Not Found"**
   - Kiểm tra WordPress site có bật REST API không
   - Kiểm tra URL có đúng không (không bao gồm /wp-admin)

3. **"CORS Error"**
   - WordPress cần cấu hình CORS headers
   - Hoặc sử dụng Netlify Functions (đã được cấu hình sẵn)

4. **"Empty content"**
   - Kiểm tra posts có nội dung không
   - Thử với endpoint khác (pages thay vì posts)

### Debug Mode:

```bash
# Chạy với debug info
DEBUG=* node scripts/wordpress-to-hugo.js --url https://example.com

# Dry run để xem trước
node scripts/wordpress-to-hugo.js --url https://example.com --dry-run
```

### Test Connection:

```bash
# Test API endpoint
curl "https://your-wordpress-site.com/wp-json/wp/v2/posts?per_page=1"

# Test với authentication (nếu cần)
curl -u username:password "https://your-wordpress-site.com/wp-json/wp/v2/posts?per_page=1"
```

## 📊 Performance & Limits

### WordPress REST API Limits:
- **Default:** 10 items per request
- **Maximum:** 100 items per request
- **Rate limiting:** Tùy thuộc vào hosting provider

### Optimization Tips:
1. **Batch processing:** Sử dụng `--per-page` để tăng số lượng items
2. **Filtering:** Dùng categories/tags để giảm dữ liệu không cần thiết
3. **Pagination:** Script tự động xử lý multiple pages
4. **Caching:** Kết quả được cache trong memory

### Recommended Settings:
```bash
# Cho sites nhỏ (< 100 posts)
--per-page 20

# Cho sites vừa (100-1000 posts)  
--per-page 50

# Cho sites lớn (> 1000 posts)
--per-page 100 --categories 1,2,3  # Filter theo categories
```

## 🔐 Security

### Best Practices:
1. **Không hardcode credentials** trong code
2. **Sử dụng environment variables** cho sensitive data
3. **Test với dry-run** trước khi import thật
4. **Backup dữ liệu** trước khi import
5. **Review content** sau khi import

### WordPress Security:
1. **Enable REST API** nếu cần thiết
2. **Disable XML-RPC** nếu không dùng
3. **Use strong passwords** cho WordPress accounts
4. **Regular updates** cho WordPress core và plugins

## 📈 Monitoring & Analytics

### Git Tracking:
- Tất cả changes được commit tự động
- Commit messages có timestamp
- Dễ dàng rollback nếu cần

### Content Analytics:
- Word count cho mỗi bài viết
- Số lượng images và links
- Last updated timestamp
- Source tracking (WordPress URL)

### Performance Metrics:
- API response time
- Content processing time
- File creation time
- Git operations time

## 🚀 Advanced Usage

### Custom Processing:

```javascript
// scripts/custom-wordpress-processor.js
const { processWikiContent } = require('./wordpress-to-hugo');

// Custom processing logic
function customProcess(data) {
  return data.map(item => {
    // Thêm custom fields
    item.customField = 'custom value';
    
    // Custom content processing
    item.wikiContent = item.wikiContent.replace(/old/g, 'new');
    
    return item;
  });
}
```

### Scheduled Import:

```bash
# Crontab entry (Linux/Mac)
0 2 * * * cd /path/to/project && npm run wordpress:import

# Windows Task Scheduler
# Create task to run: npm run wordpress:import
```

### Integration với CI/CD:

```yaml
# .github/workflows/wordpress-sync.yml
name: WordPress Sync
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run wordpress:import
        env:
          WORDPRESS_URL: ${{ secrets.WORDPRESS_URL }}
```

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra [Troubleshooting](#troubleshooting) section
2. Test với [dry-run mode](#debug-mode)
3. Kiểm tra WordPress REST API hoạt động
4. Tạo issue trên GitHub repository

---

**Happy WordPress Integration!** 🎉
