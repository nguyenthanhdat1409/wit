# 🎓 Hướng Dẫn Quản Lý Hạng Thành Viên

## 📋 Tổng Quan
Hệ thống hạng thành viên được thiết kế để tạo động lực và phân biệt các cấp độ người dùng trong nền tảng giáo dục.

## 🌟 Các Hạng Thành Viên

### 1. 🌱 Học viên mới (New Learner)
- **Mặc định**: Tất cả tài khoản mới đăng ký
- **Màu sắc**: Xanh lá cây
- **Mô tả**: Người dùng mới bắt đầu hành trình học tập

### 2. 📖 Học viên tích cực (Active Learner)
- **Màu sắc**: Xanh dương
- **Mô tả**: Tham gia thường xuyên và tương tác với nội dung

### 3. 🎯 Học viên chuyên cần (Dedicated Learner)
- **Màu sắc**: Tím
- **Mô tả**: Hoàn thành nhiều bài học và có cam kết cao

### 4. 🏆 Học viên xuất sắc (Excellent Learner)
- **Màu sắc**: Vàng cam
- **Mô tả**: Đạt thành tích cao và có kết quả học tập tốt

### 5. 👨‍🏫 Mentor
- **Màu sắc**: Đỏ
- **Mô tả**: Có khả năng hướng dẫn và hỗ trợ người khác

### 6. 🌟 Chuyên gia (Expert)
- **Màu sắc**: Cam
- **Mô tả**: Chuyên sâu về lĩnh vực và có kiến thức sâu rộng

### 7. 💎 Master
- **Màu sắc**: Xanh tím
- **Mô tả**: Bậc thầy trong lĩnh vực, có thể đào tạo người khác

## 🔧 Cách Cập Nhật Hạng Thành Viên

### Bước 1: Truy cập WordPress Admin
1. Đăng nhập vào WordPress Admin Panel
2. Vào **Users** → **All Users**
3. Tìm và click vào user cần cập nhật

### Bước 2: Cập Nhật Meta Field
1. Scroll xuống phần **Custom Fields** hoặc **User Meta**
2. Tìm field `membership_tier`
3. Cập nhật giá trị theo bảng sau:

| Hạng | Giá trị Meta |
|------|-------------|
| 🌱 Học viên mới | `new_learner` |
| 📖 Học viên tích cực | `active_learner` |
| 🎯 Học viên chuyên cần | `dedicated_learner` |
| 🏆 Học viên xuất sắc | `excellent_learner` |
| 👨‍🏫 Mentor | `mentor` |
| 🌟 Chuyên gia | `expert` |
| 💎 Master | `master` |

### Bước 3: Lưu Thay Đổi
1. Click **Update User**
2. Thay đổi sẽ được áp dụng ngay lập tức

## 💡 Gợi Ý Sử Dụng

### Tiêu Chí Nâng Hạng
- **Học viên tích cực**: Tham gia ít nhất 5 bài học
- **Học viên chuyên cần**: Hoàn thành 20+ bài học
- **Học viên xuất sắc**: Đạt điểm cao trong các bài kiểm tra
- **Mentor**: Được đề cử bởi admin hoặc có đóng góp tích cực
- **Chuyên gia**: Có chứng chỉ hoặc kinh nghiệm chuyên môn
- **Master**: Được công nhận bởi cộng đồng và admin

### Lợi Ích Theo Hạng
- **Học viên mới**: Truy cập cơ bản
- **Học viên tích cực**: Thêm tài liệu nâng cao
- **Học viên chuyên cần**: Tham gia nhóm học tập
- **Học viên xuất sắc**: Ưu tiên hỗ trợ
- **Mentor**: Quyền hướng dẫn người khác
- **Chuyên gia**: Tạo nội dung và khóa học
- **Master**: Quyền admin và quản lý

## 🔄 Tự Động Hóa (Tùy Chọn)

### Plugin WordPress
Có thể tạo plugin WordPress để:
- Tự động nâng hạng dựa trên hoạt động
- Gửi thông báo khi thay đổi hạng
- Tích hợp với hệ thống điểm số

### Webhook Integration
- Kết nối với hệ thống LMS
- Đồng bộ hóa với cơ sở dữ liệu học tập
- Tự động cập nhật dựa trên tiến độ

## 📊 Theo Dõi và Báo Cáo

### Thống Kê Hạng Thành Viên
- Số lượng user theo từng hạng
- Tỷ lệ nâng hạng
- Thời gian trung bình để nâng hạng

### Dashboard Admin
- Biểu đồ phân bố hạng thành viên
- Danh sách user cần xem xét nâng hạng
- Lịch sử thay đổi hạng

## 🎯 Mục Tiêu
Hệ thống hạng thành viên giúp:
- Tạo động lực học tập
- Phân biệt cấp độ người dùng
- Cung cấp trải nghiệm cá nhân hóa
- Xây dựng cộng đồng học tập tích cực
