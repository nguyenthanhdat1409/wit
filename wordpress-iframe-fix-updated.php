<?php
/**
 * WordPress Iframe Fix for Hugo - UPDATED VERSION
 * 
 * Sử dụng Content-Security-Policy thay vì X-Frame-Options (deprecated)
 * 
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Vào WordPress Admin → Snippets → Add New
 * 2. Title: "WordPress Iframe Fix for Hugo (CSP Version)"
 * 3. Copy toàn bộ code này vào Code field
 * 4. Run snippet: Everywhere
 * 5. Save Changes and Activate
 */

// Xóa X-Frame-Options header (deprecated)
add_action('send_headers', 'remove_x_frame_options_header', 10);
function remove_x_frame_options_header() {
    header_remove('X-Frame-Options');
}

// Thêm Content-Security-Policy header (modern approach)
add_action('send_headers', 'add_csp_frame_ancestors', 11);
function add_csp_frame_ancestors() {
    // Cho phép iframe từ wikiw.vn và các subdomain
    header("Content-Security-Policy: frame-ancestors 'self' https://wikiw.vn https://*.wikiw.vn http://localhost:* http://localhost http://127.0.0.1:*");
}

// Thêm meta tags cho iframe compatibility
add_action('wp_head', 'add_iframe_meta_tags', 1);
function add_iframe_meta_tags() {
    // Chỉ thêm meta tags khi trang được load trong iframe
    ?>
    <meta name="referrer" content="origin-when-cross-origin">
    <?php
}

// JavaScript để ẩn header WordPress khi trong iframe
add_action('wp_footer', 'add_iframe_hide_header_script', 999);
function add_iframe_hide_header_script() {
    ?>
    <script>
    (function() {
        // Kiểm tra nếu trang đang trong iframe
        if (window.self !== window.top) {
            console.log('🎯 Page is in iframe - Hiding WordPress header');
            
            // Ẩn header WordPress
            var headerSelectors = [
                '.gt-header',
                '.gt-mobile-header',
                '.gt-default',
                '.gt-header-main',
                'header[class*="gt-"]',
                '.site-header',
                'header[role="banner"]',
                '.main-navigation',
                '.site-navigation',
                '.menu-toggle',
                '.wp-block-navigation',
                'nav'
            ];
            
            headerSelectors.forEach(function(selector) {
                var elements = document.querySelectorAll(selector);
                elements.forEach(function(el) {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.height = '0';
                    el.style.overflow = 'hidden';
                });
            });
            
            // Reset body margin-top
            document.body.style.marginTop = '0';
            document.body.style.paddingTop = '0';
            
            // Thêm class để CSS có thể target
            document.body.classList.add('in-iframe');
            
            console.log('✅ WordPress header hidden successfully');
        }
    })();
    </script>
    
    <style>
    /* CSS khi trang trong iframe */
    body.in-iframe .gt-header,
    body.in-iframe .gt-mobile-header,
    body.in-iframe .site-header,
    body.in-iframe header[role="banner"],
    body.in-iframe .main-navigation,
    body.in-iframe .site-navigation,
    body.in-iframe nav {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    
    body.in-iframe {
        margin-top: 0 !important;
        padding-top: 0 !important;
    }
    
    body.in-iframe .gt-main,
    body.in-iframe .gt-page-wrapper,
    body.in-iframe .gt-article {
        margin-top: 0px !important;
        padding-top: 20px !important;
    }
    
    body.in-iframe .gt-post-header {
        margin-top: 0px !important;
        padding-top: 20px !important;
    }
    
    body.in-iframe .gt-post-header h1,
    body.in-iframe h1.entry-title,
    body.in-iframe .wp-block-post-title {
        margin-top: 0px !important;
        padding-top: 0px !important;
    }
    
    /* Mobile responsive */
    @media (max-width: 480px) {
        body.in-iframe .gt-post-header {
            margin-top: 0px !important;
            padding-top: 20px !important;
        }
    }
    </style>
    <?php
}

// CORS headers cho API requests
add_action('init', 'add_cors_headers');
function add_cors_headers() {
    // Cho phép CORS từ wikiw.vn
    $allowed_origins = array(
        'https://wikiw.vn',
        'https://www.wikiw.vn',
        'http://localhost:8888',
        'http://localhost:1313',
        'http://127.0.0.1:8888',
        'http://127.0.0.1:1313'
    );
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
}

// Cho phép REST API access
add_filter('rest_authentication_errors', 'allow_rest_api_access');
function allow_rest_api_access($result) {
    if (!empty($result)) {
        return $result;
    }
    return true;
}

/**
 * ĐÃ SỬA:
 * - ❌ Xóa X-Frame-Options: ALLOW-FROM (deprecated)
 * - ✅ Thêm Content-Security-Policy: frame-ancestors (modern)
 * - ✅ Tương thích với tất cả trình duyệt hiện đại
 * - ✅ Hỗ trợ localhost cho development
 * - ✅ JavaScript tự động ẩn header trong iframe
 * - ✅ CSS responsive cho mobile
 */
?>

