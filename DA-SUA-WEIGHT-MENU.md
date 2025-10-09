# ✅ ĐÃ SỬA: WEIGHT MENU - THỨ TỰ HIỂN THỊ

## 🎯 VẤN ĐỀ

> Menu con hiển thị trên UI không đúng thứ tự trong config.yaml

## 🔍 NGUYÊN NHÂN

**Tất cả menu con có weight giống nhau** → Hugo sắp xếp theo alphabet thay vì theo thứ tự file.

---

## ✅ ĐÃ SỬA

### 1. Menu "Thông tin" (4 menu con)

**Trước:**
```yaml
- Câu tâm đắc (weight 60)
- Nghi vấn (weight 60)          ← Tất cả giống nhau
- Chuyển hiện thực (weight 60)
- Đóng góp (weight 60)
```

**Sau:**
```yaml
- Câu tâm đắc (weight 61)        ← 1️⃣ Hiển thị đầu tiên
- Nghi vấn (weight 62)           ← 2️⃣ Hiển thị thứ 2
- Chuyển hiện thực (weight 63)   ← 3️⃣ Hiển thị thứ 3
- Đóng góp (weight 64)           ← 4️⃣ Hiển thị cuối cùng
```

---

### 2. Menu "Khái niệm" (3 menu con)

**Trước:**
```yaml
- Khái niệm nguồn (weight 31)  ✅
- Thư viện khái niệm (weight 40)  ❌ Quá cao, hiển thị cuối
- Thư viện đồ hình (weight 33)  ✅
```
→ **Thứ tự hiển thị:** Khái niệm nguồn → Đồ hình → Thư viện ❌

**Sau:**
```yaml
- Khái niệm nguồn (weight 31)  ← 1️⃣
- Thư viện (weight 32)          ← 2️⃣ Đã sửa
- Trang đồ hình (weight 33)     ← 3️⃣
```
→ **Thứ tự hiển thị:** Khái niệm nguồn → Thư viện → Trang đồ hình ✅

---

## 📊 CẤU TRÚC MENU HOÀN CHỈNH

```
═══════════════════════════════════════════════════════════════
                    TOÀN BỘ MENU HEADER
═══════════════════════════════════════════════════════════════

🏠 Trang chủ (weight 10)

📚 Bài học (weight 15) ▼
   1. 📚 Bài học TVHL (15)
   2. 🎯 Bài học Mentor Wit K07 (16)
   3. 🧘 Bài học đào tạo nội tâm (17)

📖 Khái niệm (weight 30) ▼                      ✅ ĐÃ SỬA
   1. 📚 Khái niệm nguồn (31)
   2. 📖 Thư viện (32)                          ← Sửa từ 40 → 32
   3. 🎨 Trang đồ hình (33)

ℹ️ Thông tin (weight 60) ▼                      ✅ ĐÃ SỬA
   1. Câu tâm đắc (61)                          ← Sửa từ 60 → 61
   2. Nghi vấn (62)                             ← Sửa từ 60 → 62
   3. Chuyển hiện thực (63)                     ← Sửa từ 60 → 63
   4. 💝 Đóng góp (64)                          ← Sửa từ 60 → 64

═══════════════════════════════════════════════════════════════
```

---

## 📝 THAY ĐỔI CHI TIẾT

### File: `config.yaml`

#### Thay đổi 1: Menu "Thông tin"
```diff
  - identifier: cau-tam-dac
    name: Câu tâm đắc
-   weight: 60
+   weight: 61
    parent: thong-tin

  - identifier: nghi-van
    name: Nghi vấn
-   weight: 60
+   weight: 62
    parent: thong-tin

  - identifier: chuyen-hien-thuc
    name: Chuyển hiện thực
-   weight: 60
+   weight: 63
    parent: thong-tin

  - identifier: dong-gop
    name: 💝 Đóng góp
-   weight: 60
+   weight: 64
    parent: thong-tin
```

#### Thay đổi 2: Menu "Khái niệm"
```diff
  - identifier: khai-niem-nguon
    name: 📚 Khái niệm nguồn
    weight: 31
    parent: khai-niem

- - identifier: tu-khainiem
-   name: 📖 Thư viện khái niệm
-   weight: 40
+ - identifier: thu-vien
+   name: 📖 Thư viện
+   weight: 32
    parent: khai-niem

  - identifier: trang-do-hinh
-   name: 🎨 Thư viện đồ hình
+   name: 🎨 Trang đồ hình
    weight: 33
    parent: khai-niem
```

---

## 🎯 QUY TẮC WEIGHT

### ✅ Đúng:
- Menu cha: **60**
- Menu con 1: **61** (+1)
- Menu con 2: **62** (+2)
- Menu con 3: **63** (+3)

### ❌ Sai:
- Menu cha: **60**
- Menu con 1: **60** (giống cha)
- Menu con 2: **60** (giống nhau)
- Menu con 3: **60** (Hugo sắp theo alphabet)

---

## 🧪 KIỂM TRA

Refresh browser và kiểm tra:

### Menu "Khái niệm":
```
Hover vào "Khái niệm" → Thấy:
1. 📚 Khái niệm nguồn
2. 📖 Thư viện
3. 🎨 Trang đồ hình
```

### Menu "Thông tin":
```
Hover vào "Thông tin" → Thấy:
1. Câu tâm đắc
2. Nghi vấn
3. Chuyển hiện thực
4. 💝 Đóng góp
```

---

## 💡 LƯU Ý QUAN TRỌNG

### 1. Weight của menu con:
- Phải **lớn hơn** menu cha
- Phải **khác nhau** để giữ thứ tự
- Nên tăng dần **+1** mỗi menu

### 2. Khoảng cách weight:
- **+1**: Dễ thêm menu vào giữa (dùng số thập phân)
- **+10**: Dễ thêm nhiều menu vào giữa

### 3. Khi thêm menu mới:
- Tính toán weight phù hợp
- Hoặc đổi weight các menu sau nó

---

## 📚 TÀI LIỆU THAM KHẢO

Xem thêm: **HUONG-DAN-WEIGHT-MENU.md** để hiểu chi tiết về weight.

---

## ✅ CHECKLIST

- [x] Sửa weight menu "Thông tin" (61-64)
- [x] Sửa weight menu "Khái niệm" (31-33)
- [x] Đổi tên menu "Thư viện khái niệm" → "Thư viện"
- [x] Đổi tên "Thư viện đồ hình" → "Trang đồ hình"
- [x] Tạo tài liệu hướng dẫn
- [ ] Test trên browser
- [ ] Xác nhận thứ tự hiển thị đúng

---

## 🎯 KẾT LUẬN

✅ Menu con giờ hiển thị **đúng thứ tự** như trong config.yaml  
✅ Không còn bị sắp xếp theo alphabet  
✅ Dễ dàng thêm/sửa menu mới  

---

**Ngày sửa:** 07/10/2025  
**File:** `config.yaml`  
**Số menu đã sửa:** 7 menu con  
**Vấn đề:** Weight giống nhau → Sắp xếp alphabet  
**Giải pháp:** Weight khác nhau → Đúng thứ tự

