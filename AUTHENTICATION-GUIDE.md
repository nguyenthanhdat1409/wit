# 🔐 Hướng dẫn sử dụng Authentication System

## 📋 Tổng quan

Hệ thống authentication cho HappyMarketDocs đã được thiết kế và triển khai hoàn chỉnh với:

- ✅ **2 buttons đăng ký/đăng nhập** trong header menu (desktop & mobile)
- ✅ **Modal forms** với validation đầy đủ
- ✅ **WordPress REST API integration** qua Netlify Functions
- ✅ **Session management** với localStorage
- ✅ **Responsive design** cho mọi thiết bị
- ✅ **Error handling** và user feedback

## 🎯 Kiến trúc hệ thống

```
HappyMarketDocs Frontend
    ↓ (API calls)
Netlify Functions (/auth)
    ↓ (WordPress API)
WordPress Backend (admin.wikiw.vn)
```

## 🚀 Cách sử dụng

### 1. **Truy cập website**
- Mở trình duyệt và truy cập website HappyMarketDocs
- Bạn sẽ thấy 2 buttons "Đăng nhập" và "Đăng ký" ở góc phải header

### 2. **Đăng ký tài khoản mới**
1. Click button "Đăng ký"
2. Điền thông tin:
   - **Họ và tên**: Tên hiển thị của bạn
   - **Email**: Email đăng ký (sẽ dùng làm username)
   - **Mật khẩu**: Tối thiểu 6 ký tự
   - **Xác nhận mật khẩu**: Nhập lại mật khẩu
   - **Đồng ý điều khoản**: Check box bắt buộc
3. Click "Đăng ký"
4. Hệ thống sẽ tự động đăng nhập sau khi đăng ký thành công

### 3. **Đăng nhập**
1. Click button "Đăng nhập"
2. Điền thông tin:
   - **Email**: Email đã đăng ký
   - **Mật khẩu**: Mật khẩu của bạn
   - **Ghi nhớ đăng nhập**: Check nếu muốn lưu session
3. Click "Đăng nhập"

### 4. **Sau khi đăng nhập**
- Buttons đăng ký/đăng nhập sẽ biến mất
- Hiển thị avatar và tên user
- Có button "Đăng xuất" để thoát

## 🛠️ Thiết lập WordPress Backend

### Bước 1: Cài đặt JWT Authentication Plugin

1. **Truy cập WordPress Admin**
   ```
   https://admin.wikiw.vn/wp-admin/
   ```

2. **Cài đặt Plugin**
   - Vào `Plugins` > `Add New`
   - Tìm kiếm "JWT Authentication for WP REST API"
   - Cài đặt và kích hoạt

3. **Cấu hình wp-config.php**
   ```php
   // Thêm vào wp-config.php
   define('JWT_AUTH_SECRET_KEY', 'your-secret-key-here');
   define('JWT_AUTH_CORS_ENABLE', true);
   ```

### Bước 2: Cấu hình User Registration

1. **Vào Settings > General**
2. **Check "Anyone can register"**
3. **Set "New User Default Role" = "Subscriber"**

### Bước 3: Cấu hình Permalinks

1. **Vào Settings > Permalinks**
2. **Chọn "Post name"**
3. **Click "Save Changes"**

## 🧪 Testing

### 1. **Test cơ bản**
- Mở file `test-auth.html` trong trình duyệt
- Click các buttons test để kiểm tra từng component

### 2. **Test thực tế**
1. Mở website HappyMarketDocs
2. Thử đăng ký tài khoản mới
3. Đăng xuất và đăng nhập lại
4. Kiểm tra session persistence

## 📁 Files đã tạo/sửa đổi

### 1. **Frontend Files**
- `themes/happymarket-theme/layouts/_default/baseof.html` - Thêm auth buttons và modals
- `themes/happymarket-theme/static/js/auth.js` - JavaScript xử lý authentication

### 2. **Backend Files**
- `netlify/functions/auth.js` - Netlify Function xử lý API calls
- `WORDPRESS-AUTH-SETUP.md` - Hướng dẫn setup WordPress
- `test-auth.html` - File test authentication

### 3. **Documentation**
- `AUTHENTICATION-GUIDE.md` - Hướng dẫn này

## 🔧 Cấu hình

### 1. **WordPress URL**
Trong file `auth.js`, cấu hình WordPress URL:
```javascript
const AUTH_CONFIG = {
    wordpressUrl: 'https://admin.wikiw.vn',
    // ...
};
```

### 2. **Netlify Function URL**
```javascript
netlifyFunctionUrl: '/.netlify/functions/auth',
```

### 3. **Storage Keys**
```javascript
storageKeys: {
    user: 'happymarket_user',
    token: 'happymarket_token',
    remember: 'happymarket_remember'
}
```

## 🛡️ Security Features

### 1. **Password Validation**
- Tối thiểu 6 ký tự
- Xác nhận mật khẩu
- Validation real-time

### 2. **Token Management**
- JWT tokens cho authentication
- Token validation
- Secure token storage

### 3. **CORS Protection**
- Netlify Functions xử lý CORS
- Secure API endpoints
- Input validation

### 4. **Session Management**
- localStorage cho persistent sessions
- Remember me functionality
- Auto-logout on token expiry

## 🎨 UI/UX Features

### 1. **Responsive Design**
- Desktop: Buttons ở header
- Mobile: Buttons trong mobile menu
- Modal forms responsive

### 2. **User Feedback**
- Loading states
- Success messages
- Error messages
- Form validation

### 3. **Accessibility**
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels

## 🔄 Workflow

### 1. **Registration Flow**
```
User clicks "Đăng ký" 
→ Modal opens
→ User fills form
→ Validation
→ API call to Netlify Function
→ Netlify Function calls WordPress
→ User created
→ Auto login
→ UI updates
```

### 2. **Login Flow**
```
User clicks "Đăng nhập"
→ Modal opens
→ User enters credentials
→ API call to Netlify Function
→ Netlify Function calls WordPress
→ Token received
→ User data stored
→ UI updates
```

### 3. **Logout Flow**
```
User clicks "Đăng xuất"
→ Clear localStorage
→ Clear global state
→ UI updates
→ Show auth buttons
```

## 🐛 Troubleshooting

### 1. **Lỗi thường gặp**

**"Đăng nhập thất bại"**
- Kiểm tra WordPress API hoạt động
- Kiểm tra credentials
- Kiểm tra JWT plugin

**"Đăng ký thất bại"**
- Kiểm tra user registration enabled
- Kiểm tra email format
- Kiểm tra password requirements

**"CORS error"**
- Netlify Functions xử lý CORS
- Kiểm tra WordPress CORS settings

### 2. **Debug Steps**

1. **Mở Developer Tools**
2. **Check Console** cho JavaScript errors
3. **Check Network tab** cho API calls
4. **Test với test-auth.html**

### 3. **Common Solutions**

**WordPress API không hoạt động:**
- Cài đặt JWT Authentication plugin
- Cấu hình permalinks
- Kiểm tra .htaccess

**Netlify Function lỗi:**
- Kiểm tra function deployment
- Check function logs
- Verify environment variables

## 📊 Monitoring

### 1. **User Analytics**
- Track login/register attempts
- Monitor success rates
- User behavior analysis

### 2. **Performance**
- API response times
- Function execution times
- Error rates

### 3. **Security**
- Failed login attempts
- Suspicious activity
- Token usage patterns

## 🚀 Deployment

### 1. **Local Development**
```bash
# Start development server
npm run dev

# Test authentication
open http://localhost:1313
```

### 2. **Production Deployment**
```bash
# Build and deploy
npm run build
netlify deploy --prod
```

### 3. **Environment Variables**
```bash
# Netlify environment variables
WORDPRESS_URL=https://admin.wikiw.vn
JWT_SECRET=your-secret-key
```

## 🔮 Future Enhancements

### 1. **Planned Features**
- [ ] Social login (Google, Facebook)
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Two-factor authentication
- [ ] Role-based access control

### 2. **Improvements**
- [ ] Better error messages
- [ ] Enhanced security
- [ ] Performance optimization
- [ ] Mobile app integration

## 📞 Support

### 1. **Documentation**
- `WORDPRESS-AUTH-SETUP.md` - WordPress setup
- `test-auth.html` - Testing guide
- `AUTHENTICATION-GUIDE.md` - This guide

### 2. **Testing**
- Use `test-auth.html` for debugging
- Check browser console for errors
- Monitor network requests

### 3. **Common Issues**
- WordPress API not responding
- JWT plugin not working
- CORS errors
- Token validation failures

---

## 🎉 Kết luận

Hệ thống authentication đã được triển khai hoàn chỉnh với:

✅ **Frontend**: Buttons, modals, validation, responsive design  
✅ **Backend**: Netlify Functions, WordPress integration  
✅ **Security**: JWT tokens, CORS protection, input validation  
✅ **UX**: Loading states, error handling, success messages  
✅ **Testing**: Comprehensive test suite  
✅ **Documentation**: Complete setup and usage guides  

**Hệ thống sẵn sàng sử dụng!** 🚀

Nếu gặp vấn đề, hãy:
1. Kiểm tra WordPress setup
2. Test với `test-auth.html`
3. Check browser console
4. Verify Netlify Functions deployment
