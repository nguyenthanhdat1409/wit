<?php
/**
 * WordPress Phone Field Setup
 * 
 * Thêm custom field phone cho tất cả users
 * Sử dụng trong Code Snippets plugin hoặc functions.php
 */

// Thêm custom field phone vào user profile
function add_phone_field($user) {
    $phone = get_user_meta($user->ID, 'phone', true);
    ?>
    <h3>📞 Thông Tin Liên Hệ</h3>
    <table class="form-table">
        <tr>
            <th><label for="phone">Số điện thoại</label></th>
            <td>
                <input type="tel" name="phone" id="phone" value="<?php echo esc_attr($phone); ?>" 
                       class="regular-text" pattern="[0-9]{10,11}" 
                       placeholder="Nhập số điện thoại (10-11 chữ số)" />
                <p class="description">Ví dụ: 0123456789 hoặc 0987654321</p>
            </td>
        </tr>
    </table>
    <?php
}

// Lưu custom field khi update user
function save_phone_field($user_id) {
    if (!current_user_can('edit_user', $user_id)) {
        return false;
    }
    
    if (isset($_POST['phone'])) {
        $phone = sanitize_text_field($_POST['phone']);
        
        // Validate phone number
        if (!empty($phone) && !preg_match('/^[0-9]{10,11}$/', $phone)) {
            add_action('user_profile_update_errors', function($errors) {
                $errors->add('phone_error', 'Số điện thoại phải có 10-11 chữ số');
            });
            return false;
        }
        
        update_user_meta($user_id, 'phone', $phone);
    }
}

// Thêm field vào user profile
add_action('show_user_profile', 'add_phone_field');
add_action('edit_user_profile', 'add_phone_field');

// Lưu field khi update user
add_action('personal_options_update', 'save_phone_field');
add_action('edit_user_profile_update', 'save_phone_field');

// Thêm column phone vào Users list
function add_phone_column($columns) {
    $columns['phone'] = 'Số điện thoại';
    return $columns;
}

// Hiển thị giá trị phone trong Users list
function show_phone_column($value, $column_name, $user_id) {
    if ($column_name == 'phone') {
        $phone = get_user_meta($user_id, 'phone', true);
        return $phone ? esc_html($phone) : '—';
    }
    return $value;
}

// Thêm column vào Users list
add_filter('manage_users_columns', 'add_phone_column');
add_filter('manage_users_custom_column', 'show_phone_column', 10, 3);

// Thêm phone field vào REST API response
function add_phone_to_rest_api($response, $user, $request) {
    $response->data['phone'] = get_user_meta($user->ID, 'phone', true);
    return $response;
}
add_filter('rest_prepare_user', 'add_phone_to_rest_api', 10, 3);

// Cho phép cập nhật phone qua REST API
function allow_phone_meta_update($allowed, $meta_key, $object_id, $user_id) {
    if ($meta_key === 'phone') {
        return true;
    }
    return $allowed;
}
add_filter('update_user_metadata', 'allow_phone_meta_update', 10, 4);

// Xử lý registration với phone field
function handle_user_registration_with_phone($user_id, $userdata) {
    // Phone sẽ được lưu thông qua meta field khi user được tạo
    // Điều này được xử lý trong REST API registration
}
add_action('user_register', 'handle_user_registration_with_phone', 10, 2);

// Thêm phone validation cho REST API
function validate_phone_in_rest_api($value, $request, $param) {
    if ($param === 'phone' && !empty($value)) {
        if (!preg_match('/^[0-9]{10,11}$/', $value)) {
            return new WP_Error('invalid_phone', 'Số điện thoại phải có 10-11 chữ số');
        }
    }
    return $value;
}
add_filter('rest_sanitize_request_arg', 'validate_phone_in_rest_api', 10, 3);

// Thêm phone field vào registration form (nếu cần)
function add_phone_to_registration_form() {
    ?>
    <p>
        <label for="phone">Số điện thoại</label>
        <input type="tel" name="phone" id="phone" class="input" 
               pattern="[0-9]{10,11}" placeholder="Nhập số điện thoại (10-11 chữ số)" />
    </p>
    <?php
}

// Lưu phone khi user đăng ký qua form thông thường
function save_phone_on_registration($user_id) {
    if (isset($_POST['phone'])) {
        $phone = sanitize_text_field($_POST['phone']);
        if (!empty($phone) && preg_match('/^[0-9]{10,11}$/', $phone)) {
            update_user_meta($user_id, 'phone', $phone);
        }
    }
}
add_action('user_register', 'save_phone_on_registration');

// Set default phone cho user mới (nếu cần)
function set_default_phone_for_new_user($user_id) {
    $phone = get_user_meta($user_id, 'phone', true);
    if (empty($phone)) {
        update_user_meta($user_id, 'phone', '');
    }
}
add_action('user_register', 'set_default_phone_for_new_user');
