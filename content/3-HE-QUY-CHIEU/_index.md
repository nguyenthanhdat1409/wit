---
title: "3 Hệ quy chiếu"
date: 2024-10-04T09:00:00+07:00
draft: false
description: "Danh sách các bài học về 3 Hệ quy chiếu từ WordPress"
type: "page"
layout: "3hequychieu-lessons"
---

# 🎯 3 Hệ quy chiếu

<!-- Search Container -->
<div class="search-container">
  <div class="search-wrapper">
    <input 
      type="text" 
      id="searchInput" 
      class="search-input" 
      placeholder="Tìm kiếm 3 hệ quy chiếu..."
      autocomplete="off"
    />
    <button id="clearSearch" class="clear-search" title="Xóa tìm kiếm">✕</button>
    <button id="searchButton" class="search-button" title="Tìm kiếm">🔍</button>
  </div>
  <div id="searchResultsInfo" class="search-results-info"></div>
</div>

<style>
/* Search box styles */
.search-container {
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-size: 16px !important;
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

.search-button {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover {
  background: #5a6fd8;
  transform: translateY(-50%) scale(1.1);
}

.clear-search {
  position: absolute;
  right: 70px;
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
  align-items: center;
  justify-content: center;
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

/* Responsive styles for search */
@media (max-width: 768px) {
  .search-container {
    padding: 15px;
    margin: 15px 0;
  }
  
  .search-input {
    font-size: 16px !important;
    padding: 12px 45px 12px 15px;
  }
  
  .search-button {
    width: 36px;
    height: 36px;
    font-size: 16px;
    right: 15px;
  }
  
  .clear-search {
    right: 60px;
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
  
  .search-button {
    width: 32px;
    height: 32px;
    font-size: 14px;
    right: 12px;
  }
  
  .clear-search {
    right: 50px;
    width: 22px;
    height: 22px;
    font-size: 12px;
  }
}

.image-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 8px;
  max-width: 100%;
}

.image-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  border: 1px solid #fff;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
  text-align: center;
}

.image-card img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #fff;
  padding: 10px;
  display: block;
  margin: 0 auto;
}

.image-card p {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0;
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.image-card .buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
  flex-direction: row;
}

.image-card .buttons a {
  background: #007bff;
  color: #fff;
  padding: 5px;
  border-radius: 6px;
  font-size: 14px;
  text-decoration: none;
  flex: 1;
  max-width: 120px;
  text-align: center;
  font-weight: 500;
}

.image-card .buttons a:last-child {
  background: #28a745;
}

/* Tablet - 2 cột */
@media (min-width: 768px) {
  .image-grid {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .image-card {
    flex: 1 1 calc(50% - 6px);
    max-width: calc(50% - 6px);
  }
}

/* Desktop - 3 cột */
@media (min-width: 1024px) {
  .image-card {
    flex: 1 1 calc(33.333% - 8px);
    max-width: calc(33.333% - 8px);
  }
}

/* Large Desktop - 4 cột */
@media (min-width: 1200px) {
  .image-card {
    flex: 1 1 calc(25% - 9px);
    max-width: calc(25% - 9px);
  }
}

/* Extra small mobile */
@media (max-width: 480px) {
  .image-grid {
    padding: 0 4px;
    gap: 12px;
  }
  
  .image-card {
    padding: 10px;
  }
  
  .image-card img {
    height: 180px;
    padding: 8px;
  }
  
  .image-card p {
    font-size: 15px;
    margin: 10px 0;
  }
  
  .image-card .buttons {
    gap: 10px;
    margin-top: 10px;
  }
  
  .image-card .buttons a {
    padding: 8px 16px;
    font-size: 13px;
    max-width: 100px;
  }
}
</style>

<div class="image-grid" id="imageGrid">
  <!-- Dữ liệu sẽ được load từ API WordPress -->
</div>

<script>
// Global variables
let all3HeQuyChieuItems = [];
let filtered3HeQuyChieuItems = [];

// API endpoint
const API_URL = 'https://admin.wikiw.vn/wp-json/custom/v1/3hequychieu-contents';

// Initialize search functionality
function initialize3HeQuyChieuSearch() {
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const searchButton = document.getElementById('searchButton');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.trim();
    clearSearchBtn.style.display = searchTerm ? 'flex' : 'none';
    perform3HeQuyChieuSearch(searchTerm);
  });
  
  clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    perform3HeQuyChieuSearch('');
    searchInput.focus();
  });
  
  searchButton.addEventListener('click', function() {
    perform3HeQuyChieuSearch(searchInput.value.trim());
    searchInput.focus();
  });
  
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      perform3HeQuyChieuSearch(searchInput.value.trim());
    }
  });
  
  update3HeQuyChieuSearchInfo(all3HeQuyChieuItems.length, all3HeQuyChieuItems.length);
}

// Perform search
function perform3HeQuyChieuSearch(searchTerm) {
  if (!searchTerm) {
    filtered3HeQuyChieuItems = all3HeQuyChieuItems;
    renderFiltered3HeQuyChieuCards(filtered3HeQuyChieuItems);
    update3HeQuyChieuSearchInfo(all3HeQuyChieuItems.length, all3HeQuyChieuItems.length);
    return;
  }
  
  const searchLower = searchTerm.toLowerCase();
  
  filtered3HeQuyChieuItems = all3HeQuyChieuItems.filter(item => {
    const title = (item.title || '').toLowerCase();
    const content = (item.content || '').replace(/<[^>]*>/g, '').toLowerCase();
    return title.includes(searchLower) || content.includes(searchLower);
  });
  
  renderFiltered3HeQuyChieuCards(filtered3HeQuyChieuItems, searchTerm);
  update3HeQuyChieuSearchInfo(filtered3HeQuyChieuItems.length, all3HeQuyChieuItems.length);
}

// Update search info
function update3HeQuyChieuSearchInfo(found, total) {
  const searchResultsInfo = document.getElementById('searchResultsInfo');
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput ? searchInput.value.trim() : '';
  
  if (!searchTerm) {
    searchResultsInfo.innerHTML = `📊 Hiển thị <strong>${total}</strong> hệ quy chiếu`;
  } else if (found === 0) {
    searchResultsInfo.innerHTML = `❌ Không tìm thấy kết quả cho "<strong>${searchTerm}</strong>"`;
  } else {
    searchResultsInfo.innerHTML = `✅ Tìm thấy <strong>${found}</strong> kết quả từ <strong>${total}</strong> hệ quy chiếu`;
  }
}

// Escape regex
function escapeRegex3HeQuyChieu(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Function để fetch dữ liệu từ API
async function loadDoHinhData() {
  try {
    console.log('Đang gọi API:', API_URL);
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Raw API response:', data);
    
    // Extract items and store globally
    let items = [];
    if (Array.isArray(data)) {
      items = data;
    } else if (data && data.data && data.data.contents && data.data.contents.nodes) {
      items = data.data.contents.nodes;
    } else if (data && data.data && Array.isArray(data.data)) {
      items = data.data;
    } else if (data && data.items && Array.isArray(data.items)) {
      items = data.items;
    }
    
    all3HeQuyChieuItems = items;
    filtered3HeQuyChieuItems = items;
    
    renderDoHinhCards(data);
    initialize3HeQuyChieuSearch();
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu đồ hình:', error);
    showErrorMessage();
  }
}

// Function để extract links từ HTML content
function extractLinksFromContent(content) {
  if (!content) return { imageLink: '', conceptLink: '', lessonLink: '' };
  
  // Tạo DOM element để parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  
  // Tìm các link trong content
  const links = doc.querySelectorAll('a[href]');
  let imageLink = '';
  let conceptLink = '';
  let lessonLink = '';
  
  // Tìm link đồ hình (thường chứa .png, .jpg, .jpeg)
  for (let link of links) {
    const href = link.getAttribute('href');
    if (href && (href.includes('.png') || href.includes('.jpg') || href.includes('.jpeg'))) {
      imageLink = href;
      break;
    }
  }
  
  // Tìm link khái niệm và bài học
  const paragraphs = doc.querySelectorAll('p');
  for (let p of paragraphs) {
    const text = p.textContent || '';
    const link = p.querySelector('a[href]');
    
    if (text.includes('Khái niệm:') && link) {
      conceptLink = link.getAttribute('href');
    } else if (text.includes('Bài học:') && link) {
      lessonLink = link.getAttribute('href');
    }
  }
  
  return { imageLink, conceptLink, lessonLink };
}

// Function để render các card đồ hình
function renderDoHinhCards(data) {
  let items = [];
  if (Array.isArray(data)) {
    items = data;
  } else if (data && data.data && data.data.contents && data.data.contents.nodes) {
    items = data.data.contents.nodes;
  } else if (data && data.data && Array.isArray(data.data)) {
    items = data.data;
  } else if (data && data.items && Array.isArray(data.items)) {
    items = data.items;
  }
  
  renderFiltered3HeQuyChieuCards(items);
}

// Render filtered cards with optional highlight
function renderFiltered3HeQuyChieuCards(items, searchTerm = '') {
  const imageGrid = document.getElementById('imageGrid');
  
  if (!items || items.length === 0) {
    imageGrid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>Không tìm thấy kết quả</h3>
        <p>Hãy thử tìm kiếm với từ khóa khác</p>
      </div>
    `;
    return;
  }

  imageGrid.innerHTML = items.map(item => {
    let tenDoHinh = item.title || 'Đồ hình';
    
    // Highlight search term if provided
    if (searchTerm) {
      const regex = new RegExp(`(${escapeRegex3HeQuyChieu(searchTerm)})`, 'gi');
      tenDoHinh = tenDoHinh.replace(regex, '<span class="highlight">$1</span>');
    }
    
    const { imageLink, conceptLink, lessonLink } = extractLinksFromContent(item.content);
    const linkDoHinh = imageLink || item.link_do_hinh || item.image_url || item.featured_image || '';
    const khaiNiemPath = conceptLink || item.khai_niem || item.concept_path || '/';
    const baiHocPath = lessonLink || item.bai_hoc || item.lesson_path || '/';

    return `
      <div class="image-card">
        <img src="${linkDoHinh}" alt="${item.title || 'Đồ hình'}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
        <p>${tenDoHinh}</p>
        <div class="buttons">
          <a href="${khaiNiemPath}" target="_blank">Khái Niệm</a>
          <a href="${baiHocPath}" target="_blank">Bài Học</a>
        </div>
      </div>
    `;
  }).join('');
}

// Function hiển thị thông báo lỗi
function showErrorMessage() {
  const imageGrid = document.getElementById('imageGrid');
  imageGrid.innerHTML = `
    <div style="text-align: center; color: #e74c3c; padding: 20px;">
      <p>Không thể tải dữ liệu đồ hình. Vui lòng thử lại sau.</p>
      <button onclick="loadDoHinhData()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 15px;">
        Thử lại
      </button>
    </div>
  `;
}

// Load dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
  loadDoHinhData();
});
</script>