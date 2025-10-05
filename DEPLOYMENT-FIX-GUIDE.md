# Hướng Dẫn Fix Lỗi Netlify CLI và Deploy

## 🚨 Vấn đề gặp phải

Lỗi: `Error: Cannot find module 'C:\Users\...\netlify-cli\bin\run.js'`

Đây là lỗi phổ biến trên Windows khi Netlify CLI bị cài đặt không đúng cách hoặc bị corrupt.

## ✅ Giải pháp đã áp dụng

### 1. Script Deploy Thay Thế

Đã tạo các script thay thế cho Netlify CLI:

#### **deploy-manual.ps1** (PowerShell)
```powershell
.\deploy-manual.ps1
```

#### **deploy-manual.bat** (Command Prompt)
```cmd
deploy-manual.bat
```

### 2. Script Git Commit & Push

#### **commit-and-push.ps1** (PowerShell)
```powershell
.\commit-and-push.ps1
```

#### **commit-and-push.bat** (Command Prompt)
```cmd
commit-and-push.bat
```

## 🎯 Các phương pháp Deploy

### Phương pháp 1: Manual Upload (Khuyến nghị)

1. **Chạy script build:**
   ```powershell
   .\deploy-manual.ps1
   ```

2. **Upload thủ công:**
   - Truy cập: https://app.netlify.com/drop
   - Kéo thả thư mục `public` vào drop zone
   - Netlify sẽ tự động deploy

### Phương pháp 2: Git-based Deployment

1. **Commit và push code:**
   ```powershell
   .\commit-and-push.ps1
   ```

2. **Auto-deployment:**
   - Nếu đã kết nối Git repository với Netlify
   - Deploy sẽ tự động trigger khi push code

### Phương pháp 3: Hugo Build + Manual

1. **Build Hugo site:**
   ```bash
   hugo --gc --minify
   ```

2. **Upload thủ công:**
   - Zip thư mục `public`
   - Upload lên Netlify dashboard

## 📊 Kết quả Build

- **Pages**: 772 trang
- **Files**: 785 files
- **Size**: 6.83 MB
- **Build time**: ~350ms

## 🔧 Troubleshooting

### Nếu gặp lỗi quyền truy cập:
```powershell
# Chạy PowerShell as Administrator
# Hoặc sử dụng Command Prompt thay thế
```

### Nếu Hugo build fail:
```bash
# Kiểm tra Hugo version
hugo version

# Cài đặt lại Hugo nếu cần
# Windows: choco install hugo-extended
```

### Nếu Git push fail:
```bash
# Kiểm tra git config
git config --list

# Kiểm tra remote
git remote -v
```

## 🚀 Workflow Deploy Mới

### Cho Development:
1. Edit content trong `content/`
2. Chạy `.\deploy-manual.ps1` để test build
3. Kiểm tra local tại `http://localhost:1313`

### Cho Production:
1. Commit changes: `.\commit-and-push.ps1`
2. Hoặc manual upload: `.\deploy-manual.ps1`
3. Check deployment status trên Netlify dashboard

## 📝 Lưu ý

- **Netlify CLI không cần thiết** cho deployment
- **Hugo build** là bước quan trọng nhất
- **Git-based deployment** tự động hơn manual upload
- **Scripts đã test** và hoạt động tốt trên Windows

## 🎉 Kết luận

Vấn đề Netlify CLI đã được giải quyết bằng cách:
- ✅ Tạo script thay thế cho deployment
- ✅ Sử dụng Hugo build trực tiếp
- ✅ Cung cấp multiple deployment options
- ✅ Maintain workflow development và production

**Không cần cài đặt lại Netlify CLI!** 🎊
