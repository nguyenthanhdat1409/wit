<?php
/**
 * WordPress Iframe Fix for Hugo Integration
 * 
 * Thêm vào Code Snippets plugin hoặc functions.php
 * Để cho phép iframe hiển thị nội dung WordPress
 */

// Cho phép iframe từ domain wikiw.vn
function allow_iframe_from_wikiw() {
    // Chỉ áp dụng cho các trang bài học cụ thể
    if (is_single() || is_page()) {
        // Kiểm tra nếu request đến từ wikiw.vn
        $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
        $is_from_wikiw = strpos($referer, 'wikiw.vn') !== false;
        
        // Hoặc kiểm tra user agent nếu cần
        $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
        $is_iframe_request = strpos($user_agent, 'Mozilla') !== false;
        
        if ($is_from_wikiw || $is_iframe_request) {
            // Xóa X-Frame-Options header
            header_remove('X-Frame-Options');
            
            // Thêm Content-Security-Policy cho phép iframe từ wikiw.vn
            header("Content-Security-Policy: frame-ancestors 'self' https://wikiw.vn https://*.wikiw.vn");
            
            // Thêm header cho phép iframe
            header("X-Frame-Options: ALLOW-FROM https://wikiw.vn");
        }
    }
}

// Hook vào wp_head để thêm headers
add_action('wp_head', 'allow_iframe_from_wikiw', 1);

// Hook vào template_redirect để thêm headers sớm hơn
add_action('template_redirect', 'allow_iframe_from_wikiw', 1);

// Thêm filter để loại bỏ X-Frame-Options hoàn toàn cho các trang bài học
function remove_x_frame_options($headers) {
    // Chỉ áp dụng cho các trang bài học
    if (is_single() || is_page()) {
        unset($headers['X-Frame-Options']);
        $headers['X-Frame-Options'] = 'ALLOWALL';
    }
    return $headers;
}

// Áp dụng cho REST API responses
add_filter('rest_post_dispatch', function($response, $server, $request) {
    $response->header('X-Frame-Options', 'ALLOWALL');
    $response->header('Content-Security-Policy', "frame-ancestors 'self' https://wikiw.vn https://*.wikiw.vn");
    return $response;
}, 10, 3);

// Thêm meta tag để cho phép iframe
function add_iframe_meta_tag() {
    if (is_single() || is_page()) {
        echo '<meta http-equiv="X-Frame-Options" content="ALLOWALL">' . "\n";
        echo '<meta http-equiv="Content-Security-Policy" content="frame-ancestors \'self\' https://wikiw.vn https://*.wikiw.vn">' . "\n";
    }
}
add_action('wp_head', 'add_iframe_meta_tag', 1);

// Alternative: Sử dụng JavaScript để bypass iframe restriction
function add_iframe_bypass_script() {
    if (is_single() || is_page()) {
        ?>
        <script>
        // Bypass iframe restrictions
        if (window.parent !== window) {
            // Đang trong iframe, thêm CSS để ẩn header
            document.addEventListener('DOMContentLoaded', function() {
                // Ẩn header WordPress
                const headerSelectors = [
                    '.gt-header',
                    '.gt-mobile-header', 
                    '.gt-default',
                    '.gt-header-main',
                    '.site-header',
                    'header[role="banner"]',
                    '.wp-block-navigation',
                    '.main-navigation'
                ];
                
                headerSelectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        el.style.display = 'none !important';
                        el.style.visibility = 'hidden !important';
                        el.style.height = '0 !important';
                        el.style.overflow = 'hidden !important';
                    });
                });
                
                // Điều chỉnh body margin
                document.body.style.marginTop = '0px';
                document.body.style.paddingTop = '0px';
                
                // Điều chỉnh main content
                const mainContent = document.querySelector('.gt-main, .gt-page-wrapper, .gt-article, main, .content');
                if (mainContent) {
                    mainContent.style.marginTop = '0px';
                    mainContent.style.paddingTop = '20px';
                }
            });
        }
        </script>
        <?php
    }
}
add_action('wp_head', 'add_iframe_bypass_script', 999);
?>
