# 🔧 Hướng Dẫn Setup Membership Tier trong WordPress

## 🚨 Vấn đề hiện tại
Field `membership_tier` chưa có sẵn trong WordPress Admin. Cần tạo custom field này.

## 🛠️ Giải pháp: Sử dụng Code Snippets Plugin

### Bước 1: Cài đặt Code Snippets Plugin
1. Vào **Plugins** → **Add New**
2. Tìm kiếm "Code Snippets"
3. Cài đặt và kích hoạt plugin **Code Snippets**

### Bước 2: Thêm Code
1. Vào **Snippets** → **Add New**
2. **Title**: `Membership Tier System`
3. **Code**: Copy toàn bộ nội dung từ file `wordpress-membership-tier-setup.php`
4. **Run snippet**: Chọn **Everywhere**
5. Click **Save Changes and Activate**

### Bước 3: Kiểm tra kết quả
1. Vào **Users** → **All Users**
2. Bạn sẽ thấy:
   - ✅ Column mới "Hạng thành viên" 
   - ✅ Tất cả users đã có hạng mặc định "🌱 Học viên mới"

## 🎯 Cách sử dụng sau khi setup

### Cập nhật hạng cho 1 user:
1. Vào **Users** → **All Users**
2. Click vào user cần cập nhật
3. Scroll xuống, tìm phần **🎓 Hạng Thành Viên**
4. Chọn hạng từ dropdown
5. Click **Update User**

### Cập nhật hạng cho nhiều users (Bulk Action):
1. Vào **Users** → **All Users**
2. Tick chọn các users cần cập nhật
3. Chọn action từ dropdown **Bulk actions**:
   - Set to 🌱 Học viên mới
   - Set to 📖 Học viên tích cực
   - Set to 🎯 Học viên chuyên cần
   - Set to 🏆 Học viên xuất sắc
   - Set to 👨‍🏫 Mentor
   - Set to 🌟 Chuyên gia
   - Set to 💎 Master
4. Click **Apply**

## 🔍 Kiểm tra trong Hugo Site

Sau khi setup, khi user đăng nhập và click vào profile:
- ✅ Sẽ hiển thị hạng thành viên đúng
- ✅ Màu sắc và icon phù hợp
- ✅ Có thể cập nhật real-time

## 🚀 Tính năng tự động

Code đã bao gồm:
- ✅ **Auto-set default tier** cho user mới đăng ký
- ✅ **Auto-set default tier** cho user cũ chưa có tier
- ✅ **Bulk actions** để cập nhật nhiều users cùng lúc
- ✅ **Column hiển thị** trong Users list
- ✅ **Dropdown đẹp** trong user profile

## 🎨 Giao diện sau khi setup

### Users List:
```
Username | Name | Email | Role | Posts | Hạng thành viên
admin    | —    | ...   | Admin| 286   | 🌱 Học viên mới
dat      | —    | ...   | Sub  | 0     | 🌱 Học viên mới
```

### User Profile:
```
🎓 Hạng Thành Viên
┌─────────────────────────────────┐
│ Hạng thành viên: [Dropdown ▼]  │
│ 🌱 Học viên mới                 │
│ 📖 Học viên tích cực            │
│ 🎯 Học viên chuyên cần          │
│ 🏆 Học viên xuất sắc            │
│ 👨‍🏫 Mentor                     │
│ 🌟 Chuyên gia                   │
│ 💎 Master                       │
└─────────────────────────────────┘
```

## ⚠️ Lưu ý quan trọng

1. **Backup trước khi cài**: Luôn backup database trước khi thêm code mới
2. **Test trên staging**: Nếu có môi trường test, hãy test trước
3. **Kiểm tra conflict**: Nếu có plugin khác quản lý user meta, có thể conflict

## 🔧 Troubleshooting

### Nếu không thấy field:
1. Kiểm tra Code Snippets đã active chưa
2. Kiểm tra code có lỗi syntax không
3. Clear cache nếu có plugin cache

### Nếu không hiển thị trong Hugo:
1. Kiểm tra user đã có `membership_tier` meta chưa
2. Kiểm tra API response có chứa meta data không
3. Kiểm tra JavaScript có parse đúng không

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra WordPress error logs
2. Kiểm tra browser console
3. Kiểm tra network tab khi load user profile
