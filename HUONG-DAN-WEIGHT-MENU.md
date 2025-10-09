# ⚖️ WEIGHT TRONG MENU - THỨ TỰ HIỂN THỊ

## ❓ VẤN ĐỀ

> Menu con trong "Thông tin" hiển thị sai thứ tự trên UI

## 🔍 NGUYÊN NHÂN

**Trước đây:**
```yaml
- identifier: cau-tam-dac
  weight: 60          # ← Tất cả đều weight 60
- identifier: nghi-van
  weight: 60          # ← Giống nhau
- identifier: chuyen-hien-thuc
  weight: 60          # ← Hugo sắp xếp theo alphabet
- identifier: dong-gop
  weight: 60          # ← Không theo thứ tự bạn muốn
```

⚠️ **Khi weight giống nhau, Hugo tự động sắp xếp theo alphabet:**
- Câu tâm đắc (C)
- Chuyển hiện thực (C)
- Đóng góp (Đ)
- Nghi vấn (N)

## ✅ GIẢI PHÁP

**Bây giờ:**
```yaml
- identifier: cau-tam-dac
  name: Câu tâm đắc
  weight: 61                    # ← 1. Hiển thị đầu tiên
  parent: thong-tin

- identifier: nghi-van
  name: Nghi vấn
  weight: 62                    # ← 2. Hiển thị thứ 2
  parent: thong-tin

- identifier: chuyen-hien-thuc
  name: Chuyển hiện thực
  weight: 63                    # ← 3. Hiển thị thứ 3
  parent: thong-tin

- identifier: dong-gop
  name: 💝 Đóng góp
  weight: 64                    # ← 4. Hiển thị cuối cùng
  parent: thong-tin
```

✅ **Giờ menu sẽ hiển thị đúng thứ tự:**
```
Thông tin ▼
  1. Câu tâm đắc           (weight 61)
  2. Nghi vấn              (weight 62)
  3. Chuyển hiện thực      (weight 63)
  4. 💝 Đóng góp           (weight 64)
```

---

## 📚 QUY TẮC WEIGHT TRONG HUGO

### 1. Weight là gì?
- **Weight** = trọng số, quyết định thứ tự hiển thị
- **Số nhỏ hơn** = hiển thị **trước**
- **Số lớn hơn** = hiển thị **sau**

### 2. Cách hoạt động:
```
weight: 10  →  Hiển thị đầu tiên
weight: 20  →  Hiển thị thứ 2
weight: 30  →  Hiển thị thứ 3
weight: 100 →  Hiển thị cuối cùng
```

### 3. Khi weight giống nhau:
- Hugo sắp xếp theo **alphabet** (A-Z)
- Không theo thứ tự trong file config

### 4. Best practice:
- Dùng khoảng cách **10** hoặc **1** giữa các weight
- Dễ thêm menu mới vào giữa sau này

---

## 💡 VÍ DỤ

### ✅ Đúng - Weight khác nhau:
```yaml
- name: Menu A
  weight: 10      # → Hiển thị đầu
- name: Menu B
  weight: 20      # → Hiển thị giữa
- name: Menu C
  weight: 30      # → Hiển thị cuối
```
**Kết quả:** A → B → C ✅

### ❌ Sai - Weight giống nhau:
```yaml
- name: Menu C
  weight: 10
- name: Menu A
  weight: 10      # ← Giống nhau
- name: Menu B
  weight: 10      # ← Hugo sắp theo alphabet
```
**Kết quả:** A → B → C (không theo thứ tự file) ❌

---

## 🎯 ÁP DỤNG CHO PROJECT

### Menu "Thông tin":
```yaml
Thông tin (weight 60) ▼
  ├─ Câu tâm đắc (61)        # +1
  ├─ Nghi vấn (62)           # +2
  ├─ Chuyển hiện thực (63)   # +3
  └─ Đóng góp (64)           # +4
```

### Menu "Khái niệm":
```yaml
Khái niệm (weight 30) ▼
  ├─ Khái niệm nguồn (31)    # +1
  ├─ Thư viện (32)           # +2
  └─ Trang đồ hình (33)      # +3
```

### Menu "Bài học":
```yaml
Bài học (weight 15) ▼
  ├─ Bài học TVHL (15)           # Giống cha
  ├─ Bài học Mentor Wit K07 (16) # +1
  └─ Bài học đào tạo nội tâm (17) # +2
```

---

## 🔧 CÁCH THÊM MENU VÀO GIỮA

Nếu muốn thêm menu mới **giữa** "Nghi vấn" và "Chuyển hiện thực":

### Cách 1: Dùng số thập phân
```yaml
- identifier: nghi-van
  weight: 62

- identifier: menu-moi        # ← Menu mới
  weight: 62.5                # ← Giữa 62 và 63
  parent: thong-tin

- identifier: chuyen-hien-thuc
  weight: 63
```

### Cách 2: Đổi weight các menu sau
```yaml
- identifier: nghi-van
  weight: 62

- identifier: menu-moi        # ← Menu mới
  weight: 63                  # ← Vị trí mới
  parent: thong-tin

- identifier: chuyen-hien-thuc
  weight: 64                  # ← Tăng lên
  parent: thong-tin

- identifier: dong-gop
  weight: 65                  # ← Tăng lên
  parent: thong-tin
```

---

## 📋 CHECKLIST WEIGHT

Khi tạo menu mới, nhớ:

- [ ] Menu cha có weight riêng
- [ ] Menu con có weight lớn hơn menu cha
- [ ] Các menu con có weight khác nhau
- [ ] Weight tăng dần theo thứ tự muốn hiển thị
- [ ] Dùng khoảng cách hợp lý (10 hoặc 1)

---

## 🎯 KẾT LUẬN

✅ **Weight quyết định thứ tự hiển thị**  
✅ **Số nhỏ → Hiển thị trước**  
✅ **Weight giống nhau → Sắp theo alphabet**  
✅ **Menu "Thông tin" giờ hiển thị đúng thứ tự**  

---

## 📊 BẢNG WEIGHT TOÀN BỘ MENU

```
Trang chủ (10)

Bài học (15) ▼
  ├─ Bài học TVHL (15)
  ├─ Bài học Mentor Wit K07 (16)
  └─ Bài học đào tạo nội tâm (17)

Khái niệm (30) ▼
  ├─ Khái niệm nguồn (31)
  ├─ Thư viện (32)
  └─ Trang đồ hình (33)

Từ vựng - Khái niệm (40)

Thông tin (60) ▼
  ├─ Câu tâm đắc (61)
  ├─ Nghi vấn (62)
  ├─ Chuyển hiện thực (63)
  └─ Đóng góp (64)
```

---

**Ngày tạo:** 07/10/2025  
**File sửa:** `config.yaml`  
**Vấn đề:** Menu con hiển thị sai thứ tự  
**Giải pháp:** Đặt weight khác nhau cho từng menu

