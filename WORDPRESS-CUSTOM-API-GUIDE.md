# Hướng Dẫn Sử Dụng Custom WordPress REST API

## Tình Trạng Hiện Tại

✅ **Custom API hoạt động**: `https://wit.convoi.com.vn/wp-json/custom/v1/contents`  
❌ **Chưa có posts**: API trả về `{"contents":{"nodes":[]}}`

## Custom API Code

Bạn đã tạo custom REST API endpoint với code sau:

```php
// Đăng ký custom REST API
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/contents', array(
        'methods' => 'GET',
        'callback' => 'get_custom_contents',
    ));
});

function get_custom_contents(WP_REST_Request $request) {
    $args = array(
        'post_type'      => 'post',
        'posts_per_page' => -1,
        'post_status'    => 'publish'
    );

    $query = new WP_Query($args);
    $nodes = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();

            $nodes[] = array(
                'id'      => get_the_ID(),
                'title'   => get_the_title(),
                'content' => apply_filters('the_content', get_the_content()),
                'link'    => get_permalink()
            );
        }
        wp_reset_postdata();
    }

    return array(
        'contents' => array(
            'nodes' => $nodes
        )
    );
}
```

## Để Có Dữ Liệu Test

### Phương Pháp 1: Tạo Posts Trong WordPress Admin

1. **Truy cập WordPress Admin**
   ```
   https://wit.convoi.com.vn/wp-admin/
   ```

2. **Tạo Posts**
   - Vào `Posts` > `Add New`
   - Tạo một vài posts với nội dung
   - Đảm bảo status là "Published"

3. **Test API**
   ```bash
   npm run wordpress:test-custom
   ```

### Phương Pháp 2: Cải Tiến Custom API

Có thể cải tiến custom API để lấy thêm thông tin:

```php
function get_custom_contents(WP_REST_Request $request) {
    $args = array(
        'post_type'      => 'post',
        'posts_per_page' => -1,
        'post_status'    => 'publish'
    );

    $query = new WP_Query($args);
    $nodes = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();

            $nodes[] = array(
                'id'          => get_the_ID(),
                'title'       => get_the_title(),
                'content'     => apply_filters('the_content', get_the_content()),
                'excerpt'     => get_the_excerpt(),
                'date'        => get_the_date('c'),
                'slug'        => get_post_field('post_name', get_the_ID()),
                'link'        => get_permalink(),
                'author'      => get_the_author(),
                'categories'  => wp_get_post_categories(get_the_ID(), array('fields' => 'names')),
                'tags'        => wp_get_post_tags(get_the_ID(), array('fields' => 'names')),
                'featured_image' => get_the_post_thumbnail_url(get_the_ID(), 'full')
            );
        }
        wp_reset_postdata();
    }

    return array(
        'contents' => array(
            'nodes' => $nodes
        )
    );
}
```

## Test Hệ Thống

### 1. Test Custom API
```bash
# Test custom endpoint
npm run wordpress:test-custom

# Test trực tiếp
curl "https://wit.convoi.com.vn/wp-json/custom/v1/contents"
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
- **API Type**: Chọn "Custom REST API"
- **Endpoint**: Posts
- **Username/Password**: (tùy chọn, nếu cần authentication)

## Tính Năng Hỗ Trợ

✅ **Custom REST API** - Endpoint `/wp-json/custom/v1/contents`  
✅ **Automatic Fallback** - Tự động chuyển về standard REST API nếu cần  
✅ **Data Transformation** - Chuyển đổi data format để tương thích  
✅ **Admin Panel** - Interface thân thiện để test và import  
✅ **Export Options** - JSON, Markdown, Hugo content  
✅ **Wiki Content Extraction** - Trích xuất nội dung từ posts  

## Troubleshooting

### API Trả Về Empty Array
- Kiểm tra có posts published không
- Kiểm tra post_type trong query
- Kiểm tra post_status filter

### API Không Hoạt Động
- Kiểm tra code đã được thêm vào functions.php chưa
- Kiểm tra permalinks đã được save chưa
- Kiểm tra plugin conflicts

### Data Format Không Đúng
- Kiểm tra transformCustomAPIData function
- Kiểm tra response structure
- Kiểm tra field mapping

## Next Steps

1. **Tạo test posts** trong WordPress admin
2. **Test custom API** với dữ liệu thực
3. **Sử dụng admin panel** để import content
4. **Export content** sang Hugo format
5. **Tích hợp** vào hệ thống documentation

## Liên Hệ

Nếu gặp vấn đề:
1. Kiểm tra WordPress admin có posts published không
2. Kiểm tra custom API code đã được thêm đúng chưa
3. Kiểm tra permalinks settings
4. Test với curl command trực tiếp
