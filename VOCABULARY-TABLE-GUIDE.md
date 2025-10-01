# Hướng Dẫn Tạo Bảng Từ Vựng - Khái Niệm

## Tóm Tắt

Đã comment lại bảng cũ và đề xuất 2 cách để tạo bảng mới với yêu cầu:
- **Cột trái**: Tên từ vựng (có link)
- **Cột phải**: 10 ký tự đầu của khái niệm + "..." (nếu có nội dung)

---

## Cách 1: Hugo Shortcode (Tự động) - KHUYẾN NGHỊ

### Ưu điểm:
- ✅ Tự động cập nhật khi có từ vựng mới
- ✅ Không cần chỉnh sửa thủ công
- ✅ Có phân trang tự động
- ✅ Responsive design

### Cách sử dụng:
1. File `layouts/shortcodes/vocabulary-table.html` đã được tạo
2. Trong file `content/TU-KHAINIEM/_index.md`, sử dụng:
   ```markdown
   {{< vocabulary-table >}}
   ```

### Cách hoạt động:
- Hugo sẽ tự động đọc tất cả file trong `content/TU-KHAINIEM/`
- Tự động tạo link và cắt 10 ký tự đầu của nội dung
- Tự động sắp xếp theo tên từ vựng

---

## Cách 2: Bảng Tĩnh (Thủ công)

### Ưu điểm:
- ✅ Kiểm soát hoàn toàn nội dung
- ✅ Có thể tùy chỉnh từng dòng

### Nhược điểm:
- ❌ Phải cập nhật thủ công khi có từ vựng mới
- ❌ Dễ bị lỗi khi chỉnh sửa

### Format mới:
```html
<div id="table-container">
  <table>
    <thead>
      <tr>
        <th>Từ vựng</th>
        <th>Khái niệm</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/tu-khainiem/slug/">Tên từ vựng</a></td>
        <td>10 ký tự đầu...</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Script Tự Động Tạo Bảng

### File: `generate-vocabulary-table.js`
- Tự động đọc tất cả từ vựng trong `content/TU-KHAINIEM/`
- Tạo bảng HTML và Markdown
- Cắt 10 ký tự đầu + "..." cho khái niệm

### Cách chạy:
```bash
node generate-vocabulary-table.js
```
hoặc
```bash
generate-table.bat
```

### Output:
- `vocabulary-table.html` - Bảng HTML
- `vocabulary-table.md` - Bảng Markdown

---

## Cách Chuyển Đổi

### Để sử dụng Cách 1 (Hugo Shortcode):
1. Uncomment dòng: `{{< vocabulary-table >}}`
2. Comment lại Cách 2

### Để sử dụng Cách 2 (Bảng tĩnh):
1. Comment dòng: `{{< vocabulary-table >}}`
2. Uncomment phần Cách 2
3. Chạy script `generate-vocabulary-table.js` để tạo nội dung

---

## Lưu Ý

- **Cách 1** được khuyến nghị vì tự động và dễ bảo trì
- **Cách 2** phù hợp nếu cần kiểm soát hoàn toàn nội dung
- Script `generate-vocabulary-table.js` có thể chạy bất kỳ lúc nào để cập nhật bảng
