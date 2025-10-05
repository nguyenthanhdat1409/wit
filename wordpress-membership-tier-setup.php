<?php
/**
 * WordPress Membership Tier Setup
 * 
 * Thêm custom field membership_tier cho tất cả users
 * Sử dụng trong Code Snippets plugin hoặc functions.php
 */

// Thêm custom field membership_tier vào user profile
function add_membership_tier_field($user) {
    $membership_tier = get_user_meta($user->ID, 'membership_tier', true);
    if (empty($membership_tier)) {
        // Set default tier for existing users
        update_user_meta($user->ID, 'membership_tier', 'new_learner');
    }
    ?>
    <h3>🎓 Hạng Thành Viên</h3>
    <table class="form-table">
        <tr>
            <th><label for="membership_tier">Hạng thành viên</label></th>
            <td>
                <select name="membership_tier" id="membership_tier">
                    <option value="new_learner" <?php selected($membership_tier, 'new_learner'); ?>>🌱 Học viên mới</option>
                    <option value="active_learner" <?php selected($membership_tier, 'active_learner'); ?>>📖 Học viên tích cực</option>
                    <option value="dedicated_learner" <?php selected($membership_tier, 'dedicated_learner'); ?>>🎯 Học viên chuyên cần</option>
                    <option value="excellent_learner" <?php selected($membership_tier, 'excellent_learner'); ?>>🏆 Học viên xuất sắc</option>
                    <option value="mentor" <?php selected($membership_tier, 'mentor'); ?>>👨‍🏫 Mentor</option>
                    <option value="expert" <?php selected($membership_tier, 'expert'); ?>>🌟 Chuyên gia</option>
                    <option value="master" <?php selected($membership_tier, 'master'); ?>>💎 Master</option>
                </select>
                <p class="description">Chọn hạng thành viên cho user này.</p>
            </td>
        </tr>
    </table>
    <?php
}

// Lưu custom field khi update user
function save_membership_tier_field($user_id) {
    if (!current_user_can('edit_user', $user_id)) {
        return false;
    }
    
    if (isset($_POST['membership_tier'])) {
        update_user_meta($user_id, 'membership_tier', sanitize_text_field($_POST['membership_tier']));
    }
}

// Thêm field vào user profile
add_action('show_user_profile', 'add_membership_tier_field');
add_action('edit_user_profile', 'add_membership_tier_field');

// Lưu field khi update user
add_action('personal_options_update', 'save_membership_tier_field');
add_action('edit_user_profile_update', 'save_membership_tier_field');

// Thêm column membership_tier vào Users list
function add_membership_tier_column($columns) {
    $columns['membership_tier'] = 'Hạng thành viên';
    return $columns;
}

// Hiển thị giá trị membership_tier trong Users list
function show_membership_tier_column($value, $column_name, $user_id) {
    if ($column_name == 'membership_tier') {
        $tier = get_user_meta($user_id, 'membership_tier', true);
        if (empty($tier)) {
            $tier = 'new_learner';
            update_user_meta($user_id, 'membership_tier', $tier);
        }
        
        $tier_map = array(
            'new_learner' => '🌱 Học viên mới',
            'active_learner' => '📖 Học viên tích cực',
            'dedicated_learner' => '🎯 Học viên chuyên cần',
            'excellent_learner' => '🏆 Học viên xuất sắc',
            'mentor' => '👨‍🏫 Mentor',
            'expert' => '🌟 Chuyên gia',
            'master' => '💎 Master'
        );
        
        return isset($tier_map[$tier]) ? $tier_map[$tier] : '🌱 Học viên mới';
    }
    return $value;
}

// Thêm column vào Users list
add_filter('manage_users_columns', 'add_membership_tier_column');
add_filter('manage_users_custom_column', 'show_membership_tier_column', 10, 3);

// Set default membership_tier cho user mới
function set_default_membership_tier($user_id) {
    update_user_meta($user_id, 'membership_tier', 'new_learner');
}
add_action('user_register', 'set_default_membership_tier');

// Bulk action để cập nhật membership tier
function add_membership_tier_bulk_actions($bulk_actions) {
    $bulk_actions['set_new_learner'] = 'Set to 🌱 Học viên mới';
    $bulk_actions['set_active_learner'] = 'Set to 📖 Học viên tích cực';
    $bulk_actions['set_dedicated_learner'] = 'Set to 🎯 Học viên chuyên cần';
    $bulk_actions['set_excellent_learner'] = 'Set to 🏆 Học viên xuất sắc';
    $bulk_actions['set_mentor'] = 'Set to 👨‍🏫 Mentor';
    $bulk_actions['set_expert'] = 'Set to 🌟 Chuyên gia';
    $bulk_actions['set_master'] = 'Set to 💎 Master';
    return $bulk_actions;
}
add_filter('bulk_actions-users', 'add_membership_tier_bulk_actions');

// Xử lý bulk action
function handle_membership_tier_bulk_actions($redirect_to, $doaction, $user_ids) {
    if (strpos($doaction, 'set_') === 0) {
        $tier = str_replace('set_', '', $doaction);
        foreach ($user_ids as $user_id) {
            update_user_meta($user_id, 'membership_tier', $tier);
        }
        $redirect_to = add_query_arg('bulk_membership_tier_updated', count($user_ids), $redirect_to);
    }
    return $redirect_to;
}
add_filter('handle_bulk_actions-users', 'handle_membership_tier_bulk_actions', 10, 3);

// Hiển thị thông báo sau khi bulk update
function membership_tier_bulk_admin_notice() {
    if (!empty($_REQUEST['bulk_membership_tier_updated'])) {
        $updated_count = intval($_REQUEST['bulk_membership_tier_updated']);
        printf('<div id="message" class="updated notice is-dismissible"><p>' . 
               _n('Updated %s user membership tier.', 'Updated %s users membership tier.', $updated_count) . 
               '</p></div>', $updated_count);
    }
}
add_action('admin_notices', 'membership_tier_bulk_admin_notice');
?>
