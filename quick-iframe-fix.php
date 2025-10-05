<?php
// Quick fix for iframe - Add this to WordPress functions.php or Code Snippets

// Remove X-Frame-Options header completely
function remove_x_frame_options() {
    header_remove('X-Frame-Options');
}
add_action('template_redirect', 'remove_x_frame_options', 1);

// Add meta tag to allow iframe
function add_iframe_meta() {
    echo '<meta http-equiv="X-Frame-Options" content="ALLOWALL">';
}
add_action('wp_head', 'add_iframe_meta', 1);

// Alternative: Use .htaccess method
// Add this to .htaccess file:
/*
<IfModule mod_headers.c>
    Header always unset X-Frame-Options
    Header always set X-Frame-Options "ALLOWALL"
</IfModule>
*/
?>
