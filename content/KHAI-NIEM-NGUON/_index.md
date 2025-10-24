---
title: "Khái Niệm Nguồn"
date: 2024-10-04T09:00:00+07:00
draft: false
description: "Danh sách các khái niệm nguồn từ WordPress"
type: "page"
layout: "khainiem-lessons"
---

# 🎯 Khái Niệm Nguồn

<!-- Search Container -->
<div class="search-container">
  <div class="search-wrapper">
    <input 
      type="text" 
      id="searchInput" 
      class="search-input" 
      placeholder="Tìm kiếm khái niệm nguồn..."
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

/* Loading */
.loading {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
    color: #666;
}

/* Grid layout for posts */
.khainiem-posts {
    margin: 20px 0;
}

.khainiem-meta {
    text-align: center;
    color: #666;
    margin-bottom: 20px;
    font-size: 1rem;
}

.khainiem-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    padding: 20px 0;
}

/* Card styling */
.khainiem-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    border: 2px solid #f59e0b;
}

.khainiem-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.khainiem-title {
    color: #333;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 16px 0;
    line-height: 1.4;
}

.khainiem-excerpt {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 20px;
    flex-grow: 1;
}

/* Error styling */
.khainiem-error {
    background: #fee;
    border: 2px solid #f88;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    color: #c00;
}

/* Responsive Design */
@media (max-width: 768px) {
    .khainiem-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
    }
    
    .khainiem-card {
        padding: 20px;
    }
    
    .khainiem-title {
        font-size: 1.15rem;
    }
    
    .khainiem-excerpt {
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .khainiem-grid {
        grid-template-columns: 1fr;
        gap: 16px;
        padding: 16px 0;
    }
    
    .khainiem-card {
        padding: 18px;
    }
    
    .khainiem-title {
        font-size: 1.1rem;
    }
    
    .khainiem-excerpt {
        font-size: 0.85rem;
        margin-bottom: 16px;
    }
}

.khainiem-link {
    display: inline-flex;
    align-items: center;
    background: #f59e0b;
    color: #333 !important;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: auto;
    align-self: flex-start;
    flex-shrink: 0;
}

.khainiem-link:hover {
    background: #d97706;
    color: #000 !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>

<div id="khainiem-content">
    <div class="loading">
        <p>🔄 Đang tải dữ liệu từ WordPress...</p>
    </div>
</div>

<script>
// Global variables to store lessons data
let allKhaiNiemLessons = [];
let filteredKhaiNiemLessons = [];

document.addEventListener('DOMContentLoaded', function() {
    // Check if URL has lesson parameter
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id'); // Primary: WordPress ID
    const lessonSlug = urlParams.get('lesson'); // Secondary: slug for SEO
    
    if (lessonId || lessonSlug) {
        console.log('📖 Loading specific lesson:', { id: lessonId, slug: lessonSlug });
        loadSpecificKhaiNiemLesson(lessonId, lessonSlug);
    } else {
        console.log('📚 Loading lesson list');
        loadKhaiNiemData();
    }
});

// Decode ALL HTML entities (comprehensive)
function decodeAllHtmlEntitiesKhaiNiem(text) {
    if (!text) return '';
    
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    let decoded = textarea.value;
    
    const entities = {
        '&#8211;': '–', '&#8212;': '—', '&#8216;': '\u2018', '&#8217;': '\u2019',
        '&#8220;': '\u201C', '&#8221;': '\u201D', '&#8230;': '…',
        '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
        '&nbsp;': ' ', '&#038;': '&', '&#x2013;': '–', '&#x2014;': '—',
        '&hellip;': '…', '&mdash;': '—', '&ndash;': '–',
        '&lsquo;': '\u2018', '&rsquo;': '\u2019', '&ldquo;': '\u201C', '&rdquo;': '\u201D'
    };
    
    for (const [entity, char] of Object.entries(entities)) {
        decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }
    
    return decoded;
}

// Generate slug from title
function generateSlugKhaiNiem(title) {
    if (!title) return '';
    
    const decoded = decodeAllHtmlEntitiesKhaiNiem(title);
    return decoded
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

function loadKhaiNiemData() {
    console.log('🔄 Loading Khái Niệm Nguồn data...');
    const apiUrl = 'https://admin.wikiw.vn/wp-json/custom/v1/khainiem-contents';
    const contentDiv = document.getElementById('khainiem-content');
    
    console.log('📡 Fetching from:', apiUrl);
    
    // ✅ SỬ DỤNG CACHE MANAGER (Comment code cũ để backup)
    /* === CODE CŨ (KHÔNG DÙNG CACHE) ===
    fetch(apiUrl)
        .then(response => {
            console.log('📥 Response received:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Khái Niệm Nguồn data loaded:', data);
            displayKhaiNiemContent(data);
        })
        .catch(error => {
            console.error('❌ Error loading Khái Niệm Nguồn data:', error);
            displayKhaiNiemError(error);
        });
    === HẾT CODE CŨ === */
    
    // ✅ CODE MỚI (CÓ CACHE - 30 NGÀY)
    if (typeof window.CacheManager !== 'undefined') {
        console.log('📦 Using Cache Manager');
        
        window.CacheManager.fetchWithCache(apiUrl)
            .then(result => {
                const data = result.data;
                if (result.fromCache) {
                    console.log('⚡ Khái Niệm Nguồn loaded from CACHE (fast!)');
                } else {
                    console.log('🌐 Khái Niệm Nguồn loaded from SERVER (cached for 30 days)');
                }
                displayKhaiNiemContent(data);
            })
            .catch(error => {
                console.error('❌ Error loading Khái Niệm Nguồn data:', error);
                displayKhaiNiemError(error);
            });
    } else {
        // Fallback: không có cache manager
        console.log('⚠️ Cache Manager not available, using regular fetch');
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                displayKhaiNiemContent(data);
            })
            .catch(error => {
                displayKhaiNiemError(error);
            });
    }
}

// Initialize search functionality
function initializeKhaiNiemSearch() {
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const searchButton = document.getElementById('searchButton');
  const searchResultsInfo = document.getElementById('searchResultsInfo');
  
  if (!searchInput) return;
  
  // Search on input
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.trim();
    
    // Show/hide clear button
    clearSearchBtn.style.display = searchTerm ? 'flex' : 'none';
    
    // Perform search
    performKhaiNiemSearch(searchTerm);
  });
  
  // Clear search
  clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    performKhaiNiemSearch('');
    searchInput.focus();
  });
  
  // Search button click
  searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();
    performKhaiNiemSearch(searchTerm);
    searchInput.focus();
  });
  
  // Enter key to search
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      performKhaiNiemSearch(searchInput.value.trim());
    }
  });
  
  // Initial info
  updateKhaiNiemSearchInfo(allKhaiNiemLessons.length, allKhaiNiemLessons.length);
}

// Perform search
function performKhaiNiemSearch(searchTerm) {
  if (!searchTerm) {
    filteredKhaiNiemLessons = allKhaiNiemLessons;
    displayFilteredKhaiNiem(filteredKhaiNiemLessons);
    updateKhaiNiemSearchInfo(allKhaiNiemLessons.length, allKhaiNiemLessons.length);
    return;
  }
  
  const searchLower = searchTerm.toLowerCase();
  
  filteredKhaiNiemLessons = allKhaiNiemLessons.filter(lesson => {
    const title = (lesson.title || '').toLowerCase();
    const content = (lesson.content || '').replace(/<[^>]*>/g, '').toLowerCase();
    
    return title.includes(searchLower) || content.includes(searchLower);
  });
  
  displayFilteredKhaiNiem(filteredKhaiNiemLessons, searchTerm);
  updateKhaiNiemSearchInfo(filteredKhaiNiemLessons.length, allKhaiNiemLessons.length);
}

// Update search results info
function updateKhaiNiemSearchInfo(found, total) {
  const searchResultsInfo = document.getElementById('searchResultsInfo');
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.trim();
  
  if (!searchTerm) {
    searchResultsInfo.innerHTML = `📊 Hiển thị <strong>${total}</strong> khái niệm nguồn`;
  } else if (found === 0) {
    searchResultsInfo.innerHTML = `❌ Không tìm thấy kết quả cho "<strong>${searchTerm}</strong>"`;
  } else {
    searchResultsInfo.innerHTML = `✅ Tìm thấy <strong>${found}</strong> kết quả từ <strong>${total}</strong> khái niệm`;
  }
}

// Escape special characters for regex
function escapeRegexKhaiNiem(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function displayKhaiNiemContent(data) {
    const contentDiv = document.getElementById('khainiem-content');
    
    if (!data.data || !data.data.contents || !data.data.contents.nodes) {
        contentDiv.innerHTML = '<p>❌ Không có dữ liệu từ WordPress</p>';
        return;
    }
    
    let posts = data.data.contents.nodes;
    allKhaiNiemLessons = posts; // Store globally
    filteredKhaiNiemLessons = posts;
    console.log(`📊 Found ${posts.length} Khái Niệm Nguồn posts from WordPress`);
    
    // Sort by title
    posts.sort((a, b) => {
        const titleA = decodeAllHtmlEntitiesKhaiNiem(a.title || '').toLowerCase();
        const titleB = decodeAllHtmlEntitiesKhaiNiem(b.title || '').toLowerCase();
        return titleA.localeCompare(titleB, 'vi');
    });
    
    console.log('📚 Sorted lessons:', posts.map(p => decodeAllHtmlEntitiesKhaiNiem(p.title || '')));
    
    displayFilteredKhaiNiem(posts);
    initializeKhaiNiemSearch();
}

// Display filtered lessons with optional highlight
function displayFilteredKhaiNiem(posts, searchTerm = '') {
    const contentDiv = document.getElementById('khainiem-content');
    
    if (posts.length === 0) {
      contentDiv.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>Không tìm thấy kết quả</h3>
          <p>Hãy thử tìm kiếm với từ khóa khác</p>
        </div>
      `;
      return;
    }
    
    let html = `
        <div class="khainiem-posts">
            <div class="khainiem-grid">
    `;
    
    posts.forEach((post, index) => {
        const postId = post.id;
        const title = decodeAllHtmlEntitiesKhaiNiem(post.title || 'Không có tiêu đề');
        const slug = generateSlugKhaiNiem(title);
        const lessonUrl = `/khai-niem-nguon/?id=${postId}&lesson=${slug}`;
        
        // Highlight search term if provided
        let displayTitle = title;
        if (searchTerm) {
          const regex = new RegExp(`(${escapeRegexKhaiNiem(searchTerm)})`, 'gi');
          displayTitle = displayTitle.replace(regex, '<span class="highlight">$1</span>');
        }
        
        // Lấy text thuần từ content, bỏ HTML tags
        let content = 'Không có nội dung';
        if (post.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            content = textContent.trim().substring(0, 150) + (textContent.length > 150 ? '...' : '');
        }
        
        // Highlight search term in content if provided
        let displayContent = content;
        if (searchTerm) {
          const regex = new RegExp(`(${escapeRegexKhaiNiem(searchTerm)})`, 'gi');
          displayContent = displayContent.replace(regex, '<span class="highlight">$1</span>');
        }
        
        html += `
            <div class="khainiem-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <h3 class="khainiem-title" style="margin: 0; flex: 1;">${displayTitle}</h3>
                    <span class="khainiem-id" style="font-size: 0.7rem; color: #999; background: #f0f0f0; padding: 2px 6px; border-radius: 3px; margin-left: 8px; font-family: monospace; cursor: pointer;" title="WordPress ID: ${postId} (Click to copy)" onclick="copyKhaiNiemLessonId(${postId}, event)">
                        #${postId}
                    </span>
                </div>
                <div class="khainiem-excerpt">${displayContent}</div>
                <a href="${lessonUrl}" class="khainiem-link" style="display: inline-block; text-decoration: none; text-align: center;">
                    📖 Đọc thêm
                </a>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    contentDiv.innerHTML = html;
}

// Load specific lesson by ID or slug
function loadSpecificKhaiNiemLesson(lessonId, lessonSlug) {
    console.log('🔍 Looking for lesson:', { id: lessonId, slug: lessonSlug });
    const apiUrl = 'https://admin.wikiw.vn/wp-json/custom/v1/khainiem-contents';
    const contentDiv = document.getElementById('khainiem-content');
    
    contentDiv.innerHTML = '<div class="loading"><p>🔄 Đang tải bài học...</p></div>';
    
    // Bypass cache for specific lesson to ensure fresh data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data.data || !data.data.contents || !data.data.contents.nodes) {
                throw new Error('No data received');
            }
            
            const posts = data.data.contents.nodes;
            allKhaiNiemLessons = posts;
            
            let lesson = null;
            
            if (lessonId) {
                lesson = posts.find(post => post.id && post.id.toString() === lessonId.toString());
                console.log('🔍 Search by ID:', lessonId, '→', lesson ? 'Found' : 'Not found');
            }
            
            if (!lesson && lessonSlug) {
                lesson = posts.find(post => {
                    const title = post.title || '';
                    const cleanTitle = decodeAllHtmlEntitiesKhaiNiem(title);
                    const postSlug = generateSlugKhaiNiem(cleanTitle);
                    return postSlug === lessonSlug;
                });
                console.log('🔍 Search by slug:', lessonSlug, '→', lesson ? 'Found' : 'Not found');
            }
            
            if (lesson) {
                displaySpecificKhaiNiemLesson(lesson);
            } else {
                displayKhaiNiemLessonNotFound(lessonId || lessonSlug);
            }
        })
        .catch(error => {
            console.error('❌ Error loading lesson:', error);
            displayKhaiNiemError(error);
        });
}

// Display specific lesson in iframe
function displaySpecificKhaiNiemLesson(lesson) {
    const contentDiv = document.getElementById('khainiem-content');
    const title = decodeAllHtmlEntitiesKhaiNiem(lesson.title || '');
    const url = lesson.link;
    const postId = lesson.id;
    
    document.title = `${title} - Khái Niệm Nguồn - Wikiw`;
    
    contentDiv.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <a href="/khai-niem-nguon/" class="khainiem-link" style="display: inline-block; text-decoration: none;">
                ← Quay lại danh sách
            </a>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
                <h2 style="margin: 0; color: #333; flex: 1;">${title}</h2>
                <span style="font-size: 0.75rem; color: #999; background: #f0f0f0; padding: 4px 10px; border-radius: 4px; margin-left: 1rem; font-family: monospace; cursor: pointer; white-space: nowrap;" title="WordPress ID: ${postId} (Click to copy)" onclick="copyKhaiNiemLessonId(${postId}, event)">
                    ID: #${postId}
                </span>
            </div>
        </div>
        <div style="position: relative; width: 100%; height: 80vh; min-height: 600px;">
            <iframe 
                src="${url}" 
                frameborder="0" 
                class="khainiem-iframe" 
                style="width: 100%; height: 100%; border: 1px solid #ddd; border-radius: 8px;"
                onload="hideWordPressHeader(this)">
            </iframe>
        </div>
    `;
}

// Display lesson not found
function displayKhaiNiemLessonNotFound(slug) {
    const contentDiv = document.getElementById('khainiem-content');
    contentDiv.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <h2>❌ Không tìm thấy bài học</h2>
            <p>Bài học với slug "<strong>${slug}</strong>" không tồn tại.</p>
            <a href="/khai-niem-nguon/" class="khainiem-link" style="display: inline-block; text-decoration: none; margin-top: 1rem;">
                ← Quay lại danh sách
            </a>
        </div>
    `;
}

function openKhaiNiemLesson(url, title) {
    // Create modal for iframe
    const modal = document.createElement('div');
    modal.id = 'khainiem-iframe-modal';
    modal.className = 'khainiem-iframe-overlay';
    modal.innerHTML = `
        <div class="khainiem-iframe-content">
            <div class="khainiem-iframe-header">
                <h3>${title}</h3>
                <button class="khainiem-iframe-close" onclick="closeKhaiNiemIframe()">&times;</button>
            </div>
            <div class="khainiem-iframe-body">
                <iframe src="${url}" frameborder="0" class="khainiem-iframe" onload="hideWordPressHeader(this)"></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function hideWordPressHeader(iframe) {
    console.log('🔍 Attempting to hide WordPress header...');
    
    // Tạo overlay để che header WordPress
    const iframeContainer = iframe.parentNode;
    iframeContainer.style.position = 'relative';
    
    // Tạo overlay che header
    const headerOverlay = document.createElement('div');
    headerOverlay.className = 'wordpress-header-overlay';
    
    // Kiểm tra nếu là mobile để tăng chiều cao overlay
    const isMobile = window.innerWidth <= 480;
    const overlayHeight = isMobile ? '10px' : '0px';
    
    headerOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: ${overlayHeight};
        background: white;
        z-index: 1000;
        pointer-events: none;
    `;
    
    iframeContainer.appendChild(headerOverlay);
    
    // Điều chỉnh iframe để bỏ phần header
    iframe.style.transform = 'translateY(0px)';
    iframe.style.height = '100%';
    
    console.log('✅ WordPress header overlay created');
    
    // Thử inject CSS vào iframe (có thể bị CORS block)
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        const style = iframeDoc.createElement('style');
        style.textContent = `
            /* Ẩn header WordPress */
            .gt-header,
            .gt-mobile-header,
            .gt-default,
            .gt-header-main,
            .gt-style-1,
            .gt-light,
            .gt-flex-container-full,
            .gt-header-main-inner,
            .gt-item-group,
            .gt-item,
            .gt-off-canvas-icon,
            .gt-logo,
            .gt-linked-item,
            .gt-user-box,
            .gt-search,
            .gt-random-content,
            header[class*="gt-"],
            .site-header,
            .wp-site-blocks > header,
            .wp-block-template-part,
            .wp-block-group:first-child,
            .entry-header,
            .page-header,
            header[role="banner"],
            .site-branding,
            .main-navigation,
            .site-navigation,
            .menu-toggle,
            .site-title,
            .site-description,
            .custom-logo-link,
            .wp-block-navigation,
            .wp-block-site-title,
            .wp-block-site-tagline,
            .wp-block-query-title,
            .wp-block-post-title,
            .wp-block-group__inner-container > header:first-child,
            .wp-block-group:first-child header,
            .wp-block-cover:first-child,
            .wp-block-cover__inner-container > header:first-child {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                overflow: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* Ẩn mobile menu WordPress */
            .mobile-menu,
            .menu-toggle,
            .hamburger,
            .mobile-navigation,
            .wp-block-navigation__responsive-container,
            .wp-block-navigation__responsive-container-open {
                display: none !important;
            }
            
            /* Reset body và html trong iframe */
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                overflow-x: hidden !important;
            }
            /* Ẩn admin bar nếu nó vẫn hiển thị */
            #wpadminbar {
                display: none !important;
            }
            /* Reset các container chính của nội dung WordPress */
            .gt-main, .gt-page-wrapper, .gt-article {
                margin-top: 0px !important;
                padding-top: 0px !important;
            }
            /* Điều chỉnh tiêu đề bài học */
            .gt-post-header {
                margin-top: 0px !important;
                padding-top: 20px !important;
            }
            .gt-post-header h1, h1.entry-title, .wp-block-post-title {
                margin-top: 0px !important;
                padding-top: 0px !important;
                line-height: 1.2 !important;
                font-size: 2.25rem !important;
            }
            /* Đảm bảo nội dung chính không bị che */
            .gt-content-body {
                margin-top: 20px !important;
            }
            
            /* Ẩn các element có thể là header WordPress */
            .site-header,
            .header,
            .main-header,
            .page-header,
            .entry-header,
            .post-header,
            .article-header {
                display: none !important;
            }
            
            /* Ẩn navigation WordPress */
            nav,
            .navigation,
            .main-navigation,
            .site-navigation,
            .primary-navigation,
            .secondary-navigation {
                display: none !important;
            }
            
            /* Thêm margin-top cho post header để đẩy nội dung xuống */
            .gt-post-header {
                margin-top: 20px !important;
            }
            
            /* Responsive margin-top cho post header */
            @media (max-width: 768px) {
                .gt-post-header {
                    margin-top: 15px !important;
                }
            }
            
            @media (max-width: 480px) {
                .gt-post-header {
                    margin-top: 29% !important;
                }
            }
        `;
        
        iframeDoc.head.appendChild(style);
        iframeDoc.body.classList.add('khainiem-iframe-content');
        
        console.log('✅ CSS injected successfully into iframe');
        
    } catch (error) {
        console.log('⚠️ CORS restriction - using overlay method only');
    }
}

function closeKhaiNiemIframe() {
    const modal = document.getElementById('khainiem-iframe-modal');
    if (modal) {
        modal.remove();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('khainiem-iframe-modal');
    if (modal && event.target === modal) {
        closeKhaiNiemIframe();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeKhaiNiemIframe();
    }
});

// Copy lesson ID to clipboard
function copyKhaiNiemLessonId(id, event) {
    event.preventDefault();
    event.stopPropagation();
    
    const textToCopy = id.toString();
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showCopyNotification(event.target, 'Đã copy!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(textToCopy, event.target);
        });
    } else {
        fallbackCopyTextToClipboard(textToCopy, event.target);
    }
}

function fallbackCopyTextToClipboard(text, targetElement) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyNotification(targetElement, 'Đã copy!');
        } else {
            showCopyNotification(targetElement, 'Copy thất bại');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showCopyNotification(targetElement, 'Copy thất bại');
    }
    
    document.body.removeChild(textArea);
}

function showCopyNotification(element, message) {
    const originalText = element.textContent;
    element.textContent = message;
    element.style.backgroundColor = '#4CAF50';
    element.style.color = 'white';
    
    setTimeout(() => {
        element.textContent = originalText;
        element.style.backgroundColor = '';
        element.style.color = '';
    }, 1000);
}

function displayKhaiNiemError(error) {
    const contentDiv = document.getElementById('khainiem-content');
    
    contentDiv.innerHTML = `
        <div class="khainiem-error">
            <p>❌ Lỗi khi tải dữ liệu Khái Niệm Nguồn</p>
            <p><strong>Chi tiết:</strong> ${error.message}</p>
            <p><strong>URL:</strong> https://admin.wikiw.vn/wp-json/custom/v1/khainiem-contents</p>
        </div>
    `;
}
</script>