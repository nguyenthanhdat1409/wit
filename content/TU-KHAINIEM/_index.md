---
title: "Từ vựng - Khái niệm"
description: ""
date: 2024-01-01
draft: false
weight: 1
---

<style>
/* Ẩn title của trang */
h1 {
  display: none !important;
}

/* Tăng font-size toàn trang lên 22px */
body {
  font-size: 23px !important;
}

/* Điều chỉnh các element con */
p, td, th, div, span, a {
  font-size: 23px !important;
}

/* Điều chỉnh button */
button {
  font-size: 19px !important;
}

/* Điều chỉnh small text */
small {
  font-size: 17px !important;
}

/* Search box styles */
.search-container {
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.search-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 15px 50px 15px 20px;
  font-size: 18px !important;
  border: 2px solid #fff;
  border-radius: 50px;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  border-color: #ffd700;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
  transform: translateY(-2px);
}

.search-input::placeholder {
  color: #999;
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #667eea;
  pointer-events: none;
}

.clear-search {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 16px;
  display: none;
  transition: all 0.3s ease;
}

.clear-search:hover {
  background: #cc0000;
  transform: translateY(-50%) scale(1.1);
}

.search-results-info {
  text-align: center;
  margin-top: 15px;
  color: white;
  font-size: 16px !important;
  font-weight: 500;
}

.highlight {
  background-color: #ffeb3b;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: bold;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .search-container {
    padding: 15px;
    margin: 15px 0;
  }
  
  .search-input {
    font-size: 16px !important;
    padding: 12px 45px 12px 15px;
  }
  
  .search-icon {
    font-size: 18px;
    right: 15px;
  }
  
  .clear-search {
    right: 45px;
    width: 24px;
    height: 24px;
    font-size: 14px;
  }
  
  .search-results-info {
    font-size: 14px !important;
  }
}

@media (max-width: 480px) {
  .search-container {
    padding: 12px;
    border-radius: 8px;
  }
  
  .search-input {
    font-size: 14px !important;
    padding: 10px 40px 10px 12px;
  }
  
  .search-icon {
    font-size: 16px;
    right: 12px;
  }
  
  .clear-search {
    right: 40px;
    width: 22px;
    height: 22px;
    font-size: 12px;
  }
}
</style>

<!-- Search Container -->
<div class="search-container">
  <div class="search-wrapper">
    <input 
      type="text" 
      id="searchInput" 
      class="search-input" 
      placeholder="🔍 Tìm kiếm từ vựng - khái niệm..."
      autocomplete="off"
    />
    <button id="clearSearch" class="clear-search" title="Xóa tìm kiếm">✕</button>
    <span class="search-icon">🔍</span>
  </div>
  <div id="searchResultsInfo" class="search-results-info"></div>
</div>

<div id="wordpress-content">
  <div class="loading" style="text-align: center; padding: 20px;">
    <p>🔄 Đang tải dữ liệu từ WordPress...</p>
  </div>
</div>

<script>
// Global variables
let allPosts = [];
let filteredPosts = [];

document.addEventListener("DOMContentLoaded", function () {
  const wordpressUrl = 'https://admin.wikiw.vn';
  const apiUrl = `${wordpressUrl}/wp-json/custom/v1/contents`;
  
  console.log('🚀 Loading WordPress data from:', apiUrl);
  
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ WordPress data loaded:', data);
      if (data.data && data.data.contents && data.data.contents.nodes) {
        allPosts = data.data.contents.nodes;
        filteredPosts = allPosts;
      }
      displayWordPressContent(data);
      initializeSearch();
    })
    .catch(error => {
      console.error('❌ Error loading WordPress data:', error);
      displayError(error);
    });
});

// Initialize search functionality
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const searchResultsInfo = document.getElementById('searchResultsInfo');
  
  if (!searchInput) return;
  
  // Search on input
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.trim();
    
    // Show/hide clear button
    clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
    
    // Perform search
    performSearch(searchTerm);
  });
  
  // Clear search
  clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    performSearch('');
    searchInput.focus();
  });
  
  // Enter key to search
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(searchInput.value.trim());
    }
  });
  
  // Initial info
  updateSearchInfo(allPosts.length, allPosts.length);
}

// Perform search
function performSearch(searchTerm) {
  if (!searchTerm) {
    filteredPosts = allPosts;
    displayFilteredResults(filteredPosts);
    updateSearchInfo(allPosts.length, allPosts.length);
    return;
  }
  
  const searchLower = searchTerm.toLowerCase();
  
  filteredPosts = allPosts.filter(post => {
    const title = (post.title || '').toLowerCase();
    const content = (post.content || '').replace(/<[^>]*>/g, '').toLowerCase();
    
    return title.includes(searchLower) || content.includes(searchLower);
  });
  
  displayFilteredResults(filteredPosts, searchTerm);
  updateSearchInfo(filteredPosts.length, allPosts.length);
}

// Update search results info
function updateSearchInfo(found, total) {
  const searchResultsInfo = document.getElementById('searchResultsInfo');
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.trim();
  
  if (!searchTerm) {
    searchResultsInfo.innerHTML = `📊 Hiển thị <strong>${total}</strong> từ vựng - khái niệm`;
  } else if (found === 0) {
    searchResultsInfo.innerHTML = `❌ Không tìm thấy kết quả cho "<strong>${searchTerm}</strong>"`;
  } else {
    searchResultsInfo.innerHTML = `✅ Tìm thấy <strong>${found}</strong> kết quả từ <strong>${total}</strong> từ vựng`;
  }
}

function displayWordPressContent(data) {
  const container = document.getElementById('wordpress-content');
  
  if (!data.data || !data.data.contents || !data.data.contents.nodes) {
    container.innerHTML = '<p>❌ Không có dữ liệu từ WordPress</p>';
    return;
  }
  
  const posts = data.data.contents.nodes;
  console.log(`📊 Found ${posts.length} posts from WordPress`);
  
  displayFilteredResults(posts);
}

// Display filtered results with optional highlight
function displayFilteredResults(posts, searchTerm = '') {
  const container = document.getElementById('wordpress-content');
  
  if (posts.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>Không tìm thấy kết quả</h3>
        <p>Hãy thử tìm kiếm với từ khóa khác</p>
      </div>
    `;
    return;
  }
  
  let html = `
    <div class="wordpress-posts">
      <table class="kv-table" aria-label="Bảng từ vựng - khái niệm từ WordPress">
        <thead>
          <tr>
            <th class="kv-label">Từ vựng</th>
            <th>Khái niệm</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  posts.forEach((post, index) => {
    let title = post.title || 'Không có tiêu đề';
    const content = post.content || 'Đang trong quá trình bổ sung nội dung...';
    const link = post.link || '#';
    const postId = post.id || index;
    
    // Làm sạch HTML content và lấy preview
    let cleanContent = content.replace(/<[^>]*>/g, '').trim();
    cleanContent = cleanContent.replace(/^Khái niệm\s*:?\s*/i, '').replace(/^Khái Niệm\s*:?\s*/i, '');
    
    let preview = cleanContent.length > 200 ? cleanContent.substring(0, 200) + '...' : cleanContent;
    
    // Highlight search term
    if (searchTerm) {
      const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
      title = title.replace(regex, '<span class="highlight">$1</span>');
      preview = preview.replace(regex, '<span class="highlight">$1</span>');
    }
    
    html += `
      <tr>
        <td class="kv-label">
          <a class="title" href="${link}" target="_blank" rel="noopener noreferrer">
            ${title}
          </a>
          <br>
          <small style="color: #666;">ID: ${postId}</small>
        </td>
        <td class="kv-content">
          <div class="content-preview">
            ${preview || 'Đang trong quá trình bổ sung nội dung...'}
          </div>
          <div class="content-full" style="display: none;">
            ${content.replace(/^Khái niệm\s*:?\s*/i, '').replace(/^Khái Niệm\s*:?\s*/i, '')}
          </div>
          <button onclick="toggleContent(${index})" class="toggle-btn" style="margin-top: 8px; padding: 4px 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Xem chi tiết
          </button>
        </td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  container.innerHTML = html;
}

// Escape special characters for regex
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function displayError(error) {
  const container = document.getElementById('wordpress-content');
  container.innerHTML = `
    <div class="error">
      <h3>❌ Lỗi tải dữ liệu</h3>
      <p>Không thể tải dữ liệu</p>
      <p><strong>Lỗi:</strong> ${error.message}</p>
      <p><strong>URL:</strong> https://admin.wikiw.vn/wp-json/custom/v1/contents</p>
      <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
        🔄 Thử lại
      </button>
    </div>
  `;
}

function toggleContent(index) {
  const preview = document.querySelectorAll('.content-preview')[index];
  const full = document.querySelectorAll('.content-full')[index];
  const button = document.querySelectorAll('.toggle-btn')[index];
  
  if (full.style.display === 'none') {
    preview.style.display = 'none';
    full.style.display = 'block';
    button.textContent = 'Thu gọn';
  } else {
    preview.style.display = 'block';
    full.style.display = 'none';
    button.textContent = 'Xem chi tiết';
  }
}
</script>

<style>
.wordpress-posts {
  margin: 20px 0;
}

.meta-info {
  color: #666;
  font-style: italic;
  margin-bottom: 20px;
}

.kv-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.kv-table th,
.kv-table td {
  border: 1px solid #ddd;
  padding: 12px;
  vertical-align: top;
}

.kv-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.kv-label {
  width: 30%;
  min-width: 200px;
}

.kv-content {
  width: 70%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .kv-table {
    font-size: 14px;
  }
  
  .kv-table th,
  .kv-table td {
    padding: 8px;
  }
  
  .kv-label {
    width: 100%;
    min-width: auto;
    display: block;
  }
  
  .kv-content {
    width: 100%;
    display: block;
  }
  
  .kv-table tr {
    display: block;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
  }
  
  .kv-table th {
    display: none;
  }
  
  .kv-label::before {
    content: "📚 Từ vựng: ";
    font-weight: bold;
    color: #007bff;
  }
  
  .kv-content::before {
    content: "📖 Nội dung: ";
    font-weight: bold;
    color: #28a745;
    display: block;
    margin-bottom: 8px;
  }
}

@media (max-width: 480px) {
  .kv-table {
    font-size: 12px;
  }
  
  .kv-table th,
  .kv-table td {
    padding: 6px;
  }
  
  .wordpress-posts h2 {
    font-size: 18px;
  }
  
  .meta-info {
    font-size: 12px;
  }
}

.title {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.title:hover {
  text-decoration: underline;
}

.content-preview {
  color: #666;
  line-height: 1.5;
}

.content-full {
  color: #333;
  line-height: 1.6;
}

.toggle-btn:hover {
  background: #0056b3 !important;
}

/* Responsive button */
@media (max-width: 768px) {
  .toggle-btn {
    width: 100%;
    padding: 8px 12px !important;
    font-size: 14px;
    margin-top: 10px !important;
  }
}

@media (max-width: 480px) {
  .toggle-btn {
    font-size: 12px;
    padding: 6px 10px !important;
  }
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
}

.loading {
  color: #666;
  font-style: italic;
}
</style>


<!-- 
CODE CŨ - COMMENT LẠI PHẦN CÒN LẠI
<div id="table-container">

| Từ vựng | Khái niệm |
|------------------|-----------------|
| [3 Câu hỏi quan trọng trong đời người](3-cau-hoi-quan-trong-trong-doi-nguoi/) | Ai là người quan trọng nhất? Thời điểm nào... |
| [4 động lực sinh tồn](4-dong-luc-sinh-ton/) | |
| [5 Sự so sánh](5-su-so-sanh/) | |
| [5 Tầng bậc nhận thức nội tâm](5-tang-bac-nhan-thuc-noi-tam/) | |
| [6 Chữ vàng trong hành động](6-chu-vang-trong-hanh-dong/)  | |
| [6 Quan niệm chuẩn về sức khoẻ](6-quan-niem-chuan-ve-suc-khoe/) | | 
| [7 Bố thí quan trọng đời người](7-bo-thi-quan-trong-doi-nguoi/)  |  |
| [8 Tố chất nhân tài](8-to-chat-nhan-tai/) | | 
| [9 Dạng người cần nhận dạng trong 1](9-dang-nguoi-can-nhan-dang-trong-1/) | | 
| [Ác đức](ac-duc/) | Ác Đức tương ứng khối điện từ âm, chứa trong vỏ bọc tánh người, được tạo ra khi làm cho người khác đau khổ... |
| [An vui](an-vui/) | An vui là trạng thái nhận thức nội tâm xuất phát từ sự chân thật nơi chính mình, xuất phát từ Nghe - Thấy - Nói... |
| [Bài học](bai-hoc/) | Bài học là những gì mới mà chúng ta chưa từng học... |
| [Bài Học - Tâm Đắc - Ngộ Ra](bai-hoc-tam-dac-ngo-ra/) | |
| [Bao Dung](bao-dung/) | Đang trong quá trình bổ sung... |
| [Bảy sự giàu toàn diện](bay-su-giau-toan-dien/) | Giàu Trí Tuệ, Giàu Tâm Thái, Giàu Nhân Cách, Giàu Phẩm Chất, Giàu Năng Lực, Giàu Thể Chất, Giàu Vật Chất... |
| [Bệnh](benh/) | Đang trong quá trình bổ sung... |
| [Biểu Hiện Vật Chất](bieu-hien-vat-chat/) | Đang trong quá trình bổ sung... |
| [Bố Thí](bo-thi/) | Đang trong quá trình bổ sung... |
| [Cao nhân](cao-nhan/) | Đang trong quá trình bổ sung... |
| [Cách âm vô minh](cach-am-vo-minh/) | Cách ấm vô minh là một thuật ngữ chỉ việc sau khi con người vào tử cung của người phụ nữ, do tác động của điện từ âm khiến cho tàng thức bị bôi đen... |
| [Cảnh giới cuộc sống](canh-gioi-cuoc-song/) | Đang trong quá trình bổ sung... |
| [Chân dung Master Mentor Wit](chan-sung-master-mentor-wit/) | Đang trong quá trình bổ sung... |
| [Chia sẻ](chia-se/) | Đang trong quá trình bổ sung... |
| [Chuyên gia](chuyen-gia/) | Đang trong quá trình bổ sung... |
| [Cần mẫn](can-man/) | Đang trong quá trình bổ sung... |
| [Chuyển hoá](chuyen-hoa/) | Đang trong quá trình bổ sung... |
| [Cố định tham tưởng](co-dinh-tham-tuong/) | Đang trong quá trình bổ sung... |
| [Con người](con-nguoi/) | Con người - Thông tin hóa: là một thực thể tự nhiên mang đặc tính xã hội, vận hành thống nhất với các quy luật tự nhiên - xã hội... |
| [Cộng đồng chuyên gia](cong-dong-chuyen-gia/) | Đang trong quá trình bổ sung... |
| [Công đức](cong-duc/) | Đang trong quá trình bổ sung... |
| [Cống hiến](cong-hien/) | Đang trong quá trình bổ sung... |
| [Công thức](cong-thuc/) | Đang trong quá trình bổ sung... |
| [Công thức đào tạo nhân tài](cong-thuc-dao-tao-nhan-tai/) | Đang trong quá trình bổ sung... |
| [Công việc](cong-viec/) | Đang trong quá trình bổ sung... |
| [Cuộc sống ước mơ](cuoc-song-uoc-mo/) | Đang trong quá trình bổ sung... |
| [Đặc điểm của tài sản lớn](dac-diem-cua-tai-san-lon/) | Đang trong quá trình bổ sung... |
| [Đại ngộ](dai-ngo/) | Đại ngộ (cái ngộ lớn): "là 1 thuật ngữ chỉ về những cái ngộ ảnh hưởng đến khía cạnh lớn, tác động đến cuộc đời con người." |
| [Đam mê](dam-me/) | Đang trong quá trình bổ sung... |
| [Dẫn dắt](dan-dat/) | Đang trong quá trình bổ sung... |
| [Dẻo Dai](deo-dai/) | |
| [Dân số](dan-so/) | |
| [Di sản](di-san/) | |
| [Dính hình](dinh-hinh/) | |
| [Doanh số](doanh-so/) | |
| [Dũng cảm nhận lỗi](dung-cam-nhan-loi/) | |
| [Dũng cảm thay đổi](dung-cam-thay-doi/) | |
| [Dụng tâm lành](dung-tam-lanh/) | |
| [Duyên lành](duyen-lanh/) | |
| [Đặt ý](dat-y/) | Đặt ý là muốn khởi một ý niệm trở thành, khởi một ý niệm sở hữu sau đó thì buông. Bởi vì không tìm thì nó sẽ có. Còn tìm thì nó sẽ biến mất... |
| [Định tâm](dinh-tam/) | |
| [Định thân](dinh-than/) | |
| [Đơn giản](don-gian/) | |
| [Đốn ngộ](don-ngo/) | Đốn ngộ Là một thuật ngữ chỉ về tiến độ của việc ngộ, khi rút ngắn thời gian để ngộ được điều gì đó thay vì phải dành thời gian dài mới hiểu được... |
| [Đồng hành](dong-hanh/) | |
| [Đồng hình ảnh](dong-hanh/) | |
| [Đồng khái niệm](dong-khai-niem/) | |
| [Đồng ngôn](dong-ngon/) | |
| [Đồng tần số năng lượng](dong-tan-so-nang-luong/) | |
| [Đồng thuận](dong-thuan/) | |
| [Điểm - Tuyến - Diện](diem-tuyen-dien/) | |
| [Gắn bó bạn thân](gan-bo-ban-than/) | |
| [Ghi nhận - Biết ơn](ghi-nhan-biet-on/) | |
| [Gia đình hoà hợp](ghi-dinh-hoa-hop/) | |
| [Gia tốc](gia-toc/) | |
| [Giác ngộ](giac-ngo/) | Gánh vác là sẵn sàng đảm nhận 1 khía cạnh công việc Gánh vác trách nhiệm là tố chất quan trọng của nhân tài. Khi một dự án gặp khó khăn, nhân tài sẽ không né tránh... |
| [Giáo dục](giao-duc/) | |
| [Giáo dục nhận thức](giao-duc-nhan-thuc/) | |
| [Giáo dục tận gốc](giao-duc-tan-goc/) | |
| [Giàu toàn diện](giau-toan-dien/) | Thông tin hóa có được trạng thái đủ đầy, cân bằng, chất lượng cao và vững bền ở cả đời sống vật chất và phi vật chất trên tất cả 4 khía cạnh của cuộc sống... |
| [Giàu vật chất](giau-vat-chat/) | |
| [Giúp người](giup-nguoi/) | |
| [Hạnh phúc](hanh-phuc/) | |
| [Hệ quy chiếu](he-quy-chieu/) | |
| [Hiện thực](hien-thuc/) | Thông tin trong con người chúng ta là những gì chúng ta biết, những gì chúng ta tin, những gì chúng ta hiểu. Những gì chúng ta biết, những gì chúng ta tin, những gì chúng ta hiểu đại diện cho thông tin trong con người chúng ta... |
| [Hình ảnh tâm trí](hinh-anh-tam-tri/) | |
| [Hữu sư trí](huu-su-tri/) | Hữu Sư Trí là khái niệm có thầy dạy. Có nghĩa là trí tuệ được tạo ra từ việc mình Nghe Thấy Nói Biết, nó huân tập vào đời này từ khi mình sinh ra đến bây giờ... |
| [Hy sinh](hy-sinh/) | |
| [Kết nối bản thẩn](ket-noi-ban-than/) | Thông tin hóa: kết nối bản thân là cảm nhận, cảm thụ được sự hiện hữu các quá trình chuyển hóa vi tế trong bản thân. Năng lượng hóa: quan sát được trạng thái rung động của sự chân thật nơi chính mình... |
| [Khả năng chức năng](kha-nang-chuc-nang/) | |
| [Khả năng thích ứng](kha-nang-thich-ung/) | |
| [Khái niệm nguồn](khai-niem-nguon/) | Là khái niệm bao gồm cái Biết, cái Tin, cái Hiểu... |
| [Khái niệm nguồn có lợi](khai-niem-nguon-co-loi/) | |
| [Khiêm tốn](khiem-ton/) | Người khiêm tốn là người luôn có tâm niệm hay cảm nhận nội tâm THÀNH TỰU CỦA BẢN THÂN là do người khác mang lại. Người khiêm tốn là người luôn thấy ở người khác có điểm hơn mình... |
| [Khoái lạc](khoai-lac/) | Khoái lạc là trạng thái cảm xúc nội tâm khi thoả mãn nhất thời Tham và Tưởng về Tài, Sắc, Danh, Thực và Thuỳ... |
| [Khoan dung](khoai-dung/) | Người khoan dung, là khi lỗi của người khác có 10 phần, qua ánh mắt nhìn của họ cảm nhận còn khoảng cỡ 4-5 phần lỗi. 4-5 phần lỗi này đi vô trong người họ giảm còn lại 1-2 phần... |
| [Khôn ngoan](khon-ngoan/) | |
| [Không gian](khong-gian/) | |
| [Khích hoạt tổng nghiệp](khich-hoat-tong-nghiep/) | |
| [Kiên trì](kien-tri/) | |
| [Làm chủ](lam-chu/) | Làm chủ là chủ động và chịu trách nhiệm... |
| [Làm chủ nội tâm](lam-chu-noi-tam/) | Làm chủ nội tâm là chủ động lựa chọn và chịu trách nhiệm với lựa chọn bên trong nội tâm để làm chủ hoàn cảnh bên ngoài... |
| [Lắng nghe bản thân](lang-nghe-ban-than/) | Thông tin hóa: lắng nghe bản thân là hành động nhận thức các trạng thái, các quá trình chuyển hoá thô và vi tế diễn ra bên trong bản thân. Năng lượng hóa: lắng nghe bản thân là trạng thái nhận thức rằng bản thân cần nâng tầm hiểu biết... |
| [Lãnh đạo](lang-dao/) | |
| [Lãnh đạo toàn năng](lang-dao-toan-nang/) | |
| [Liêm chính](liem-chinh/) | |
| [Liêm chính nội tâm](liem-chinh-noi-tam/) | Thông tin: liêm chính nội tâm với bản thân là khái niệm chỉ sự thống nhất của trạng thái nhận thức, trạng thái cảm xúc bên trong nội tâm với hành vi ngôn ngữ, phi ngôn ngữ trong giao tiếp và tương tác đối với bản thân... |
| [Liệu định](lieu-dinh/) | |
| [Lợi nhuận](loi-nhuan/) | |
| [Lục lợi đại thuận](luc-loi-dai-thuan/) | |
| [Minh sư](minh-su/) | Nhận dạng: Là người có Ước mơ bao trùm Ước mơ của chúng ta. Là người có Trí tuệ, Tâm thái, Phẩm chất, Nhân cách, Năng lực hay Cảnh giới Cuộc sống khác biệt, cách biệt mà chúng ta muốn hướng đến... |
| [Mối quan hệ](moi-quan-he/) | Mối quan hệ là sự tương tác giữa hai hoặc nhiều đối tượng trong một bối cảnh cụ thể. Một mối quan hệ có thể bao gồm nhiều mối liên kết nhỏ hơn, đan xen với nhau... |
| [Môi trường tốt](moi-truong-tot/) | |
| [Mong muốn](mong-muon/) | Mong muốn là hình ảnh được lặp đi, lặp lại thường xuyên trong tâm trí. Mong muốn là trạng thái khao khát về một điều gì mà chúng ta không có trong hiện tại... |
| [Mong muốn thật sự](mong-muon-that-su/) | Mong muốn thật sự: là hình ảnh được lặp đi lặp lại trong tâm trí. Mong muốn thật sự là niềm tin bên trong. Niềm tin bên trong luôn chiến thắng mong muốn ý thức bên ngoài... |
| [Mức độ phát triển](muc-do-phat-trien/) | |
| [Năng lực](nang-luc/) | Năng lực của một người là mức độ trưởng thành của người đó về cả 3 mặt: Quan niệm, quan hệ xã hội và chuyên môn. Sự trưởng thành của 3 mặt này có quan hệ mật thiết với nhau tạo thành vòng tuần hoàn năng lực... |
| [Năng lực chuyên môn](nang-luc-chuyen-mon/) | Năng lực Chuyên môn: Là thấu hiểu tất cả các khái niệm của ngành, tư duy của ngành (tư duy đích đến, tư duy kết quả, tư duy tầm nhìn). Là năng lực biến những gì phức tạp trong ngành trở nên đơn giản... |
| [Năng lực quan niệm](nang-luc-quan-niem/) | Năng lực Quan niệm: Người có quan niệm chuẩn là người thực sự có công cụ tạo lập giá trị. Quan niệm sống bắt nguồn từ khái niệm nguồn và hệ quy chiếu, bao gồm 3 khái niệm nguồn, 7 khái niệm về: trí tuệ, tâm thái, phẩm chất, nhân cách, năng lực, thể chất, vật chất... |
| [Năng lực xã hội](nang-luc-xa-hoi/) | Năng lực Quan hệ xã hội: Là khả năng tương tác, kết nối với các đối tượng trong 4 động lực sinh tồn (Bản thân, gia đình, tổ chức và xã hội). Quan niệm (hiểu một cách dân gian nhất) chính là cách nghĩ và thái độ của người đó... |
| [Năng lực của trí tuệ](nang-luc-cua-tri-tue/) | NĂNG LƯỢNG CỦA TRÍ TUỆ: 1. An vui 2. Bao dung 3. Trân trọng - biết ơn... |
| [Nghề ước mơ](nghe-uoc-mo/) | |
| [Nghiệp bệnh](nghiep-benh/) | Nghiệp bệnh là khái niệm xuất phát từ triết lý Phật giáo,... |
| [Ngộ](ngo/) | NGỘ Là trạng thái giao thoa giữa nghi vấn hay những trăn trở lâu ngày, tới một giây phút khi chúng ta hiểu thì vừa bừng sáng một trạng thái, tích tắc nội tâm chuyển từ nghi qua ngộ... |
| [Ngộ ra](ngo-ra/) | Ngộ ra: Là những gì chúng ta trăn trở mà chưa có lời giải, ngày hôm nay có lời giải... |
| [Ngôn thí](ngon-thi/) | Ngộ ra: Là những gì chúng ta trăn trở mà chưa có lời giải, ngày hôm nay có lời giải... |
| [Ngũ hành](ngu-hanh/) | Ngũ hành là 5 yếu tố: Kim – Mộc – Thủy – Hỏa – Thổ... |
| [Người bình thường](nguoi-binh-thuong/) | |
| [Người có nhân cách chân thật](nguoi-co-nhan-cach-chan-that/) | |
| [Người có niềm tin tích cực](nguoi-co-niem-tin-tich-cuc/) | Người có niềm tin tích cực là người có trạng thái cảm nhận nội tâm rằng bản thân đã đủ đầy nguồn lực để sở hữu điều mà tâm trí muốn hướng đến... |
| [Người có niềm tin tiêu cực](nguoi-co-niem-tin-tieu-cuc/) | Người có niềm tin tiêu cực là người có trạng thái cảm nhận nội tâm rằng bản thân chưa đủ đầy nguồn lực để sở hữu điều mà tâm trí muốn hướng đến... |
| [Người có trí tuệ](nguoi-co-tri-tue/) | Người có trí tuệ: là người có trạng thái nhận thức nội tâm vượt trên vấn nạn phát sinh... |
| [Người có Trí Tuệ Tầng Bậc 1](nguoi-co-tri-tue-tang-bac-1/) | |
| [Người có Trí Tuệ Tầng Bậc 2](nguoi-co-tri-tue-tang-bac-2/) | |
| [Người có Trí Tuệ Tầng Bậc 3](nguoi-co-tri-tue-tang-bac-3/) | |
| [Người có Trí Tuệ Tầng Bậc 4](nguoi-co-tri-tue-tang-bac-4/) | |
| [Người có Trí Tuệ Tầng Bậc 5](nguoi-co-tri-tue-tang-bac-5/) | |
| [Người giàu năng lực](nguoi-giau-nang-luc/) | Người giàu năng lực (hay còn gọi là người trưởng thành hơn người): là người có quan niệm, quan hệ xã hội và chuyên môn vượt xa với độ tuổi của họ, đồng thời tiệm cận đến độ tuổi của người thành công mà bối cảnh xã hội công nhận... |
| [Người giàu nhân cách](nguoi-giau-nhan-cach/) | Người giàu nhân cách hay còn gọi là người có nhân cách kiện toàn: là người tập hợp đủ đầy những trạng thái cảm xúc, trạng thái nhận thức bên trong nội tâm biểu hiện thông qua sự vui vẻ, hy vọng, niềm tin, trí tuệ, trân trọng – biết ơn, yêu thương, bao dung, khiêm tốn, chân thật đối với bản thân và đối với mối quan hệ xã hội của người đó... |
| [Người giàu phẩm chất](nguoi-giau-pham-chat/) | NGƯỜI GIÀU PHẨM CHẤT hay còn gọi là người có phẩm chất ưu tú. Là người đạt trạng thái đủ đầy 5 yếu tố nhân, lễ, nghĩa, trí, tín trên cả bốn động lực sinh tồn là bản thân, gia đình, tổ chức và xã hội... |
| [Người giàu tâm thái](nguoi-giau-tam-thai/) | Người giàu tâm thái là người luôn giữ được xuyên suốt trạng thái trân trọng - biết ơn ở tình, bao dung ở tánh, an vui ở tâm. Nội tâm con người chúng ta gồm có: tâm - tánh - tình... |
| [Người giàu thể chất](nguoi-giau-the-chat/) | |
| [Người giàu trí tuệ](nguoi-giau-tri-tue/) | Người giàu trí tuệ: là người giữ được xuyên suốt trạng thái nhận thức nội tâm đứng trên vấn nạn phát sinh ở mỗi khía cạnh của cuộc đời (4 khía cạnh : Nội tâm, Sức khỏe, Mối quan hệ, Tài chính)... |
| [Người giàu vật chất](nguoi-giau-vat-chat/) | Người giàu vật chất là người sở hữu tài sản lớn và nguồn thu nhập ổn định, đảm bảo an toàn tài chính đồng thời duy trì sự cân bằng và phát triển trong Nội tâm, Sức khỏe, Mối quan hệ gia đình và xã hội... |
| [Người tài](nguoi-tai/) | NGƯỜI TÀI: Người tài là người tài giỏi, có tài năng ở lĩnh vực nào đó... |
| [Người làm chủ tâm thái](nguoi-lam-chu-tam-thai/) | Người làm chủ tâm thái là người chủ động lựa chọn và chịu trách nhiệm với lựa chọn bên trong nội tâm để làm chủ hoàn cảnh bên ngoài... |
| [Người thầy chuyển hiện thực](nguoi-thay-chuyen-hien-thuc/) | |
| [Người trưởng thành](nguoi-truong-thanh/) | |
| [Người vĩ đại](nguoi-vi-dai/) | |
| [Nguyên lý](nguyen-ly/) | Nguyên lý - Thông tin hóa: nguyên lý là những luận điểm xuất phát, những tư tưởng chủ đạo của một học thuyết hay lý luận mà tính chân lý của chúng là hiển nhiên, không thể hay không cần phải chứng minh nhưng không mâu thuẫn với thực tiễn và nhận thức về lĩnh vực mà học thuyết hay lý luận đó phản ánh... |
| [Nguyên lý ánh sáng](nguyen-ly-anh-sang/) | |
| [Nguyên lý chuyển hoá](nguyen-ly-chuyen-hoa/) | |
| [Nguyên Lý Nhị Nguyên](nguyen-ly-nhi-nguyen/) | Nhị Nguyên là một khái niệm chỉ về trong cùng một sự vật, sự việc đều có hai mặt đối lập như ánh sáng và bóng tối, tích cực và tiêu cực, ưu điểm và khuyết điểm, có và không, được và mất, tốt và xấu... |
| [Nhà đào tạo toàn năng](nha-dao-tao-toan-nang/) | |
| [Nhà lãnh đạo siêu phàm](nha-lanh-dao-sieu-pham/) | |
| [Nhà lãnh đạo toàn năng](nha-lanh-dao-toan-nang/) | |
| [Nhà quản trị toàn năng](nha-quan-tri-toan-nang/) | |
| [Nhân cách](nhan-cach/) | Nhân cách: của một người là tập hợp những trạng thái cảm xúc, trạng thái nhận thức bên trong nội tâm biểu hiện thông qua hình ảnh tâm trí và giá trị của người đó đối với bản thân và đối với mối quan hệ xã hội... |
| [Nhân cách niềm tin](nhan-cach-niem-tin/) | |
| [Bai Hoc Test](bai-hoc-test/) | Đây là bài học test được tạo qua API. Nội dung này sẽ được lưu trong file _index.md và có thể truy cập qua URL. |
| [Test1](test1/) | Đây là nội dung test cho từ vựng - khái niệm test1. Nội dung này sẽ được lưu trong file _index.md và có thể truy cập qua URL. |
| [test nha 22](test-nha-22/) | Chào bạn... |
| [Test Markdown](test-markdown/) | Đây là test markdown formatting... |
| [test 9](test-9/) | 1. a 2. b **ac**... |


</div> 


<style>
#table-container table {
  width: 100%;
  border-collapse: collapse;
}

#table-container th,
#table-container td {
  border: 1px solid #ddd;
  padding: 8px;
  vertical-align: top;
}

#table-container th:first-child,
#table-container td:first-child {
  width: 220px;           /* set cứng cho cột bên trái */
  white-space: nowrap;    /* không cho xuống hàng */
  text-overflow: ellipsis;/* nếu quá dài thì hiện ... */
  overflow: hidden;
}

#table-container th:last-child,
#table-container td:last-child {
  width: auto;            /* tự động chiếm phần còn lại */
}



.pagination {
  margin-top: 12px;
  text-align: right;
}

.pagination button {
  background: #007bffa8;
  color: white;
  border: none;
  padding: 6px 12px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.pagination button:hover {
  background: #0056b3;
}

.pagination span {
  margin: 0 8px;
  font-weight: bold;
  color: #333;
}
</style>

<script>
document.addEventListener("DOMContentLoaded", function () {
  // Lấy bảng gốc
  const table = document.querySelector("table");
  const rows = Array.from(table.querySelectorAll("tr")).slice(1); // bỏ header
  const perPage = 10; // số dòng / trang
  let currentPage = 1;

  function renderTable(page) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const slice = rows.slice(start, end);

    let html = "<table><tr>" + table.querySelector("tr").innerHTML + "</tr>";
    slice.forEach(r => html += "<tr>" + r.innerHTML + "</tr>");
    html += "</table>";

    const totalPages = Math.ceil(rows.length / perPage);
    html += `<div class="pagination">
           <button onclick="jumpToPage(1)" title="Tua lên trang 1">⏮ Đầu</button>
           <button onclick="changePage(-1)">« Trước</button>
           <span>Trang ${page} / ${totalPages}</span>
           <button onclick="changePage(1)">Sau »</button>
           <button onclick="jumpToPage(${totalPages})" title="Tua đến cuối trang">⏭ Cuối</button>
         </div>`;
         

   

    document.getElementById("table-container").innerHTML = html;
  }

  window.changePage = function (delta) {
    const total = Math.ceil(rows.length / perPage);
    currentPage = Math.min(Math.max(1, currentPage + delta), total);
    renderTable(currentPage);
  };

  window.jumpToPage = function (page) {
    const total = Math.ceil(rows.length / perPage);
    currentPage = Math.min(Math.max(1, page), total);
    renderTable(currentPage);
  };

  // Ẩn bảng gốc và render phân trang
  table.style.display = "none";
  renderTable(currentPage);
});
</script>
-->