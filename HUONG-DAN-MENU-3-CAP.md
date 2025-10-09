# 🌳 MENU 3 CẤP - CHA → CON → CHÁU

## 🎯 CÂU HỎI

> Nếu có 1 cấp con nữa thì sao?

## ✅ HUGO HỖ TRỢ MENU 3 CẤP

Hugo hoàn toàn hỗ trợ menu đa cấp! Bạn có thể tạo:
- **Cấp 1:** Menu cha
- **Cấp 2:** Menu con  
- **Cấp 3:** Menu cháu

---

## 📝 CẤU TRÚC CONFIG

### Ví dụ: Menu "Bài học" → "Tư vấn huấn luyện" → "Các khóa cụ thể"

```yaml
menu:
  main:
    # CẤP 1: Menu cha
    - identifier: bai-hoc
      name: Bài học
      url: /bai-hoc/
      weight: 15
      hasChildren: true
    
    # CẤP 2: Menu con
    - identifier: bai-hoc-tvhl
      name: 📚 Tư vấn huấn luyện
      url: /bai-hoc/
      parent: bai-hoc
      weight: 17
      hasChildren: true        # ← Có menu con nữa
    
    # CẤP 3: Menu cháu
    - identifier: tvhl-co-ban
      name: 🎯 Cơ bản
      url: /bai-hoc/tvhl/co-ban/
      parent: bai-hoc-tvhl     # ← Cha là menu con
      weight: 171
    
    - identifier: tvhl-nang-cao
      name: 🚀 Nâng cao
      url: /bai-hoc/tvhl/nang-cao/
      parent: bai-hoc-tvhl     # ← Cha là menu con
      weight: 172
    
    - identifier: tvhl-chuyen-sau
      name: 💎 Chuyên sâu
      url: /bai-hoc/tvhl/chuyen-sau/
      parent: bai-hoc-tvhl     # ← Cha là menu con
      weight: 173
```

---

## 🎨 KẾT QUẢ HIỂN THỊ

### Desktop (Hover):
```
Bài học ▼
  └─ 📚 Tư vấn huấn luyện ▼
       ├─ 🎯 Cơ bản
       ├─ 🚀 Nâng cao
       └─ 💎 Chuyên sâu
```

### Mobile (Click):
```
Bài học
  └─ 📚 Tư vấn huấn luyện
       ├─ 🎯 Cơ bản
       ├─ 🚀 Nâng cao
       └─ 💎 Chuyên sâu
```

---

## 🔧 CẦN SỬA TEMPLATE

Hiện tại template chỉ hỗ trợ 2 cấp. Cần sửa `baseof.html` để hỗ trợ 3 cấp:

### Desktop Navigation:
```html
{{ if .HasChildren }}
<div class="relative group" onmouseenter="showDropdown(this)" onmouseleave="hideDropdown(this)">
    <button class="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors flex items-center">
        {{ .Name }}
        <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
    </button>
    <div class="dropdown-content absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible transition-all duration-200 z-50">
        <div class="py-1">
            {{ range .Children }}
                {{ if .HasChildren }}
                <!-- Menu con có con nữa - Submenu -->
                <div class="relative group" onmouseenter="showSubDropdown(this)" onmouseleave="hideSubDropdown(this)">
                    <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-between">
                        {{ .Name }}
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <div class="sub-dropdown absolute left-full top-0 w-48 bg-white rounded-md shadow-lg opacity-0 invisible transition-all duration-200 z-50">
                        <div class="py-1">
                            {{ range .Children }}
                            <a href="{{ .URL | relURL }}" class="block px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600">
                                {{ .Name }}
                            </a>
                            {{ end }}
                        </div>
                    </div>
                </div>
                {{ else }}
                <!-- Menu con bình thường -->
                <a href="{{ .URL | relURL }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    {{ .Name }}
                </a>
                {{ end }}
            {{ end }}
        </div>
    </div>
</div>
{{ end }}
```

### Mobile Navigation:
```html
{{ if .HasChildren }}
<div class="mobile-dropdown">
    <button class="mobile-dropdown-button w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 flex items-center justify-between">
        {{ .Name }}
        <svg class="h-4 w-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
    </button>
    <div class="mobile-dropdown-content hidden pl-4">
        {{ range .Children }}
            {{ if .HasChildren }}
            <!-- Submenu cho mobile -->
            <div class="mobile-sub-dropdown">
                <button class="mobile-sub-dropdown-button w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-gray-50 flex items-center justify-between">
                    {{ .Name }}
                    <svg class="h-3 w-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div class="mobile-sub-dropdown-content hidden pl-4">
                    {{ range .Children }}
                    <a href="{{ .URL | relURL }}" class="block px-3 py-2 text-xs text-gray-500 hover:text-orange-500 hover:bg-gray-50">
                        {{ .Name }}
                    </a>
                    {{ end }}
                </div>
            </div>
            {{ else }}
            <a href="{{ .URL | relURL }}" class="block px-3 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-gray-50">
                {{ .Name }}
            </a>
            {{ end }}
        {{ end }}
    </div>
</div>
{{ end }}
```

---

## 💡 VÍ DỤ THỰC TẾ

### Menu "Khái niệm" → "Khái niệm nguồn" → "Các loại khái niệm"

```yaml
# CẤP 1
- identifier: khai-niem
  name: Khái niệm
  url: /khai-niem/
  weight: 30
  hasChildren: true

# CẤP 2
- identifier: khai-niem-nguon
  name: 📚 Khái niệm nguồn
  url: /khai-niem-nguon/
  parent: khai-niem
  weight: 31
  hasChildren: true        # ← Có menu con

# CẤP 3
- identifier: quy-luat
  name: ⚖️ Quy luật
  url: /khai-niem-nguon/quy-luat/
  parent: khai-niem-nguon
  weight: 311

- identifier: nguyen-ly
  name: 🔬 Nguyên lý
  url: /khai-niem-nguon/nguyen-ly/
  parent: khai-niem-nguon
  weight: 312

- identifier: cong-thuc
  name: 🧮 Công thức
  url: /khai-niem-nguon/cong-thuc/
  parent: khai-niem-nguon
  weight: 313
```

### Kết quả:
```
Khái niệm ▼
  └─ 📚 Khái niệm nguồn ▼
       ├─ ⚖️ Quy luật
       ├─ 🔬 Nguyên lý
       └─ 🧮 Công thức
```

---

## ⚖️ QUY TẮC WEIGHT CHO 3 CẤP

### Cách đặt weight:
```
Cấp 1: 30
Cấp 2: 31, 32, 33...
Cấp 3: 311, 312, 313... (thêm 1 chữ số)
```

### Ví dụ:
```yaml
# Cấp 1
- weight: 30

# Cấp 2
- weight: 31
- weight: 32

# Cấp 3 (con của 31)
- weight: 311
- weight: 312
- weight: 313

# Cấp 3 (con của 32)
- weight: 321
- weight: 322
```

---

## 🎨 CSS CẦN THÊM

### Cho submenu:
```css
.sub-dropdown {
    position: absolute;
    left: 100%;
    top: 0;
    width: 200px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    transform: translateX(-10px);
    transition: all 0.2s ease;
    z-index: 60;
}

.sub-dropdown.show {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
}

.mobile-sub-dropdown-content {
    padding-left: 1rem;
}

.mobile-sub-dropdown-content a {
    font-size: 0.75rem;
    color: #6b7280;
}
```

---

## 🧪 TEST

1. **Thêm config** vào `config.yaml`
2. **Sửa template** `baseof.html`
3. **Thêm CSS** cho submenu
4. **Test trên browser**

---

## 💡 LƯU Ý

### ✅ Ưu điểm:
- Tổ chức menu rõ ràng
- Dễ tìm kiếm nội dung
- Phù hợp với site có nhiều nội dung

### ⚠️ Nhược điểm:
- Phức tạp hơn trên mobile
- Cần nhiều click để đến nội dung
- Có thể gây khó khăn cho UX

### 🎯 Khuyến nghị:
- Chỉ dùng khi thực sự cần thiết
- Tối đa 3 cấp (cha → con → cháu)
- Test kỹ trên mobile

---

## 🚀 BẠN CÓ MUỐN THỰC HIỆN?

Nếu muốn tạo menu 3 cấp, tôi có thể:

1. ✅ **Sửa template** `baseof.html` để hỗ trợ 3 cấp
2. ✅ **Thêm CSS** cho submenu
3. ✅ **Tạo ví dụ** với menu hiện tại của bạn
4. ✅ **Test** trên browser

**Bạn muốn thử với menu nào?** (Ví dụ: "Khái niệm" → "Khái niệm nguồn" → "Quy luật/Nguyên lý/Công thức")

---

**Ngày tạo:** 07/10/2025  
**Chủ đề:** Menu 3 cấp trong Hugo  
**Độ khó:** Trung bình  
**Thời gian:** 15-20 phút
