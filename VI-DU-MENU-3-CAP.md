# 🎯 VÍ DỤ THỰC TẾ: MENU 3 CẤP

## 🎨 VÍ DỤ VỚI MENU HIỆN TẠI

Giả sử bạn muốn tạo menu 3 cấp cho **"Khái niệm"** → **"Khái niệm nguồn"** → **"Các loại khái niệm"**

---

## 📝 CONFIG.YAML

### Thêm vào `config.yaml`:

```yaml
menu:
  main:
    # CẤP 1: Menu cha
    - identifier: khai-niem
      name: Khái niệm
      url: /khai-niem/
      weight: 30
      hasChildren: true
    
    # CẤP 2: Menu con
    - identifier: khai-niem-nguon
      name: 📚 Khái niệm nguồn
      url: /khai-niem-nguon/
      parent: khai-niem
      weight: 31
      hasChildren: true        # ← Có menu con nữa
    
    # CẤP 3: Menu cháu
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
    
    - identifier: nang-luc
      name: 💪 Năng lực
      url: /khai-niem-nguon/nang-luc/
      parent: khai-niem-nguon
      weight: 314
    
    # CẤP 2: Menu con khác (không có con)
    - identifier: thu-vien
      name: 📖 Thư viện
      url: /thu-vien/
      parent: khai-niem
      weight: 32
    
    - identifier: trang-do-hinh
      name: 🎨 Trang đồ hình
      url: /hinh/
      parent: khai-niem
      weight: 33
```

---

## 🎨 KẾT QUẢ HIỂN THỊ

### Desktop (Hover):
```
Khái niệm ▼
  ├─ 📚 Khái niệm nguồn ▼
  │    ├─ ⚖️ Quy luật
  │    ├─ 🔬 Nguyên lý
  │    ├─ 🧮 Công thức
  │    └─ 💪 Năng lực
  ├─ 📖 Thư viện
  └─ 🎨 Trang đồ hình
```

### Mobile (Click):
```
Khái niệm
  ├─ 📚 Khái niệm nguồn
  │    ├─ ⚖️ Quy luật
  │    ├─ 🔬 Nguyên lý
  │    ├─ 🧮 Công thức
  │    └─ 💪 Năng lực
  ├─ 📖 Thư viện
  └─ 🎨 Trang đồ hình
```

---

## 🔧 TEMPLATE CẦN SỬA

### 1. Desktop Navigation (baseof.html):

Thay thế phần menu "Khái niệm" bằng:

```html
{{ if .HasChildren }}
<div class="relative group" onmouseenter="showDropdown(this)" onmouseleave="hideDropdown(this)">
    <button class="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors flex items-center">
        {{ .Name }}
        <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
    </button>
    <div class="dropdown-content absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg opacity-0 invisible transition-all duration-200 z-50">
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
                    <div class="sub-dropdown absolute left-full top-0 w-56 bg-white rounded-md shadow-lg opacity-0 invisible transition-all duration-200 z-50">
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

### 2. Mobile Navigation:

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

## 🎨 CSS CẦN THÊM

### Thêm vào file CSS:

```css
/* Submenu styles */
.sub-dropdown {
    position: absolute;
    left: 100%;
    top: 0;
    width: 224px; /* w-56 */
    background: white;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

/* Mobile submenu */
.mobile-sub-dropdown-content {
    padding-left: 1rem;
}

.mobile-sub-dropdown-content a {
    font-size: 0.75rem;
    color: #6b7280;
}

/* Hover effects */
.group:hover .sub-dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
}
```

---

## 🧪 JAVASCRIPT CẦN THÊM

### Thêm vào cuối file `baseof.html`:

```javascript
// Submenu functions
function showSubDropdown(element) {
    const subDropdown = element.querySelector('.sub-dropdown');
    if (subDropdown) {
        subDropdown.style.opacity = '1';
        subDropdown.style.visibility = 'visible';
        subDropdown.style.transform = 'translateX(0)';
    }
}

function hideSubDropdown(element) {
    const subDropdown = element.querySelector('.sub-dropdown');
    if (subDropdown) {
        subDropdown.style.opacity = '0';
        subDropdown.style.visibility = 'hidden';
        subDropdown.style.transform = 'translateX(-10px)';
    }
}

// Mobile submenu
document.addEventListener('DOMContentLoaded', function() {
    const mobileSubDropdownButtons = document.querySelectorAll('.mobile-sub-dropdown-button');
    mobileSubDropdownButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const arrow = this.querySelector('svg');
            
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                arrow.style.transform = 'rotate(180deg)';
            } else {
                content.classList.add('hidden');
                arrow.style.transform = 'rotate(0deg)';
            }
        });
    });
});
```

---

## 📁 CẤU TRÚC CONTENT

### Tạo thư mục content:

```
content/
├── khai-niem-nguon/
│   ├── quy-luat/
│   │   └── _index.md
│   ├── nguyen-ly/
│   │   └── _index.md
│   ├── cong-thuc/
│   │   └── _index.md
│   └── nang-luc/
│       └── _index.md
```

### Ví dụ file `content/khai-niem-nguon/quy-luat/_index.md`:

```markdown
---
title: "Quy luật"
description: "Các quy luật cơ bản trong phát triển nội tâm"
date: 2025-10-07
draft: false
---

# ⚖️ Quy luật

Nội dung về các quy luật...
```

---

## 🎯 BƯỚC THỰC HIỆN

### 1. Cập nhật config.yaml
- Thêm `hasChildren: true` cho "Khái niệm nguồn"
- Thêm các menu cấp 3

### 2. Sửa template baseof.html
- Thêm logic xử lý submenu
- Thêm CSS cho submenu

### 3. Thêm JavaScript
- Xử lý hover cho desktop
- Xử lý click cho mobile

### 4. Tạo content
- Tạo thư mục và file cho các menu cấp 3

### 5. Test
- Test trên desktop và mobile
- Kiểm tra responsive

---

## 💡 LƯU Ý

### ✅ Ưu điểm:
- Tổ chức nội dung rõ ràng
- Dễ tìm kiếm
- Phù hợp với site có nhiều nội dung

### ⚠️ Nhược điểm:
- Phức tạp hơn
- Cần nhiều click trên mobile
- Có thể gây khó khăn cho UX

### 🎯 Khuyến nghị:
- Chỉ dùng khi thực sự cần
- Test kỹ trên mobile
- Cân nhắc UX

---

## 🚀 BẠN CÓ MUỐN THỰC HIỆN?

Nếu muốn, tôi có thể:

1. ✅ **Sửa template** để hỗ trợ 3 cấp
2. ✅ **Thêm CSS** cho submenu
3. ✅ **Tạo ví dụ** với menu "Khái niệm"
4. ✅ **Test** trên browser

**Bạn muốn thử không?** 🤔

---

**Ngày tạo:** 07/10/2025  
**Ví dụ:** Menu 3 cấp thực tế  
**Độ khó:** Trung bình  
**Thời gian:** 20-30 phút
