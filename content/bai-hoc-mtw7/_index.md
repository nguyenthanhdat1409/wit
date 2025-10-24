---
title: "Bài học MTW7"
date: 2024-10-04T09:00:00+07:00
draft: false
description: ""
type: "page"
layout: "mtw7-lessons"
---

# 🎯 Bài học Mentor WiT K07

<!-- Search Container -->
<div class="search-container">
  <div class="search-wrapper">
    <input 
      type="text" 
      id="searchInput" 
      class="search-input" 
      placeholder="Tìm kiếm bài học MTW7..."
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

.mtw7-link {
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

.mtw7-link:hover {
    background: #d97706;
    color: #000 !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Loading */
.loading {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
    color: #666;
}

/* Grid layout for posts */
.mtw7-posts {
    margin: 20px 0;
}

.mtw7-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    padding: 20px 0;
}

/* Card styling */
.mtw7-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    border: 2px solid #f59e0b;
}

.mtw7-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.mtw7-title {
    color: #333;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 16px 0;
    line-height: 1.4;
}

.mtw7-excerpt {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 20px;
    flex-grow: 1;
}

/* Error styling */
.mtw7-error {
    background: #fee;
    border: 2px solid #f88;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    color: #c00;
}

/* Responsive Design */
@media (max-width: 768px) {
    .mtw7-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
    }
    
    .mtw7-card {
        padding: 20px;
    }
    
    .mtw7-title {
        font-size: 1.15rem;
    }
    
    .mtw7-excerpt {
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .mtw7-grid {
        grid-template-columns: 1fr;
        gap: 16px;
        padding: 16px 0;
    }
    
    .mtw7-card {
        padding: 18px;
    }
    
    .mtw7-title {
        font-size: 1.1rem;
    }
    
    .mtw7-excerpt {
        font-size: 0.85rem;
        margin-bottom: 16px;
    }
}
</style>

<div id="mtw7-content">
    <div class="loading">
        <p>🔄 Đang tải dữ liệu từ WordPress...</p>
    </div>
</div>

<script>
// Global variables to store lessons data
let allMTW7Lessons = [];
let filteredMTW7Lessons = [];

document.addEventListener('DOMContentLoaded', function() {
    // Check if URL has lesson parameter
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id'); // Primary: WordPress ID
    const lessonSlug = urlParams.get('lesson'); // Secondary: slug for SEO
    
    if (lessonId || lessonSlug) {
        console.log('📖 Loading specific lesson:', { id: lessonId, slug: lessonSlug });
        loadSpecificMTW7Lesson(lessonId, lessonSlug);
    } else {
        console.log('📚 Loading lesson list');
        loadMTW7Data();
    }
});

// Decode ALL HTML entities (comprehensive)
function decodeAllHtmlEntitiesMTW7(text) {
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
function generateSlugMTW7(title) {
    const decodedTitle = decodeAllHtmlEntitiesMTW7(title);
    return decodedTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function loadMTW7Data() {
    console.log('🔄 Loading MTW7 data...');
    const apiUrl = 'https://admin.wikiw.vn/wp-json/custom/v1/mtw7-contents';
    const contentDiv = document.getElementById('mtw7-content');
    
    console.log('📡 Fetching from:', apiUrl);
    
    fetch(apiUrl)
        .then(response => {
            console.log('📥 Response received:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ MTW7 data loaded:', data);
            displayMTW7Content(data);
        })
        .catch(error => {
            console.error('❌ Error loading MTW7 data:', error);
            displayMTW7Error(error);
        });
}

// Initialize search functionality
function initializeMTW7Search() {
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
    performMTW7Search(searchTerm);
  });
  
  // Clear search
  clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    performMTW7Search('');
    searchInput.focus();
  });
  
  // Search button click
  searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();
    performMTW7Search(searchTerm);
    searchInput.focus();
  });
  
  // Enter key to search
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      performMTW7Search(searchInput.value.trim());
    }
  });
  
  // Initial info
  updateMTW7SearchInfo(allMTW7Lessons.length, allMTW7Lessons.length);
}

// Perform search
function performMTW7Search(searchTerm) {
  if (!searchTerm) {
    filteredMTW7Lessons = allMTW7Lessons;
    displayFilteredMTW7(filteredMTW7Lessons);
    updateMTW7SearchInfo(allMTW7Lessons.length, allMTW7Lessons.length);
    return;
  }
  
  const searchLower = searchTerm.toLowerCase();
  
  filteredMTW7Lessons = allMTW7Lessons.filter(lesson => {
    const title = (lesson.title || '').toLowerCase();
    const content = (lesson.content || '').replace(/<[^>]*>/g, '').toLowerCase();
    
    return title.includes(searchLower) || content.includes(searchLower);
  });
  
  displayFilteredMTW7(filteredMTW7Lessons, searchTerm);
  updateMTW7SearchInfo(filteredMTW7Lessons.length, allMTW7Lessons.length);
}

// Update search results info
function updateMTW7SearchInfo(found, total) {
  const searchResultsInfo = document.getElementById('searchResultsInfo');
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.trim();
  
  if (!searchTerm) {
    searchResultsInfo.innerHTML = `📊 Hiển thị <strong>${total}</strong> bài học MTW7`;
  } else if (found === 0) {
    searchResultsInfo.innerHTML = `❌ Không tìm thấy kết quả cho "<strong>${searchTerm}</strong>"`;
  } else {
    searchResultsInfo.innerHTML = `✅ Tìm thấy <strong>${found}</strong> kết quả từ <strong>${total}</strong> bài học`;
  }
}

// Escape special characters for regex
function escapeRegexMTW7(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function displayMTW7Content(data) {
    const contentDiv = document.getElementById('mtw7-content');
    
    if (!data.data || !data.data.contents || !data.data.contents.nodes) {
        contentDiv.innerHTML = '<p>❌ Không có dữ liệu từ WordPress</p>';
        return;
    }
    
    let posts = data.data.contents.nodes;
    
    // Store data globally
    allMTW7Lessons = posts;
    filteredMTW7Lessons = posts;
    
    console.log(`📊 Found ${posts.length} MTW7 posts from WordPress`);
    
    // Sort posts by lesson number (Buổi XX)
    posts = posts.sort((a, b) => {
        const getLessonNumber = (title) => {
            const match = title.match(/Buổi\s*(\d+)/i);
            return match ? parseInt(match[1]) : 999;
        };
        
        const numA = getLessonNumber(a.title || '');
        const numB = getLessonNumber(b.title || '');
        
        return numA - numB;
    });
    
    console.log('📚 Sorted lessons:', posts.map(p => p.title));
    
    displayFilteredMTW7(posts);
    initializeMTW7Search();
}

// Display filtered lessons with optional highlight
function displayFilteredMTW7(posts, searchTerm = '') {
    const contentDiv = document.getElementById('mtw7-content');
    
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
        <div class="mtw7-posts">
            <div class="mtw7-grid">
    `;
    
    posts.forEach((post, index) => {
        let title = post.title || 'Không có tiêu đề';
        title = decodeAllHtmlEntitiesMTW7(title.replace(/TVHL\.?\s*/g, ''));
        
        const link = post.link || '#';
        const postId = post.id || index;
        
        // Highlight search term if provided
        let displayTitle = title;
        if (searchTerm) {
          const regex = new RegExp(`(${escapeRegexMTW7(searchTerm)})`, 'gi');
          displayTitle = displayTitle.replace(regex, '<span class="highlight">$1</span>');
        }
        
        // Generate slug for SEO-friendly URL
        const slug = generateSlugMTW7(title);
        const lessonUrl = `/bai-hoc-mtw7/?id=${postId}&lesson=${slug}`;
        
        // Lấy text thuần từ content
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
          const regex = new RegExp(`(${escapeRegexMTW7(searchTerm)})`, 'gi');
          displayContent = displayContent.replace(regex, '<span class="highlight">$1</span>');
        }
        
        html += `
            <div class="mtw7-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <h3 class="mtw7-title" style="margin: 0; flex: 1;">${displayTitle}</h3>
                    <span class="mtw7-id" style="font-size: 0.7rem; color: #999; background: #f0f0f0; padding: 2px 6px; border-radius: 3px; margin-left: 8px; font-family: monospace; cursor: pointer;" title="WordPress ID: ${postId} (Click to copy)" onclick="copyMTW7LessonId(${postId}, event)">
                        #${postId}
                    </span>
                </div>
                <div class="mtw7-excerpt">${displayContent}</div>
                <a href="${lessonUrl}" class="mtw7-link" style="display: inline-block; text-decoration: none; text-align: center;">
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

function openMTW7Lesson(url, title) {
    // Create modal for iframe
    const modal = document.createElement('div');
    modal.id = 'mtw7-iframe-modal';
    modal.className = 'mtw7-iframe-overlay';
    modal.innerHTML = `
        <div class="mtw7-iframe-content">
            <div class="mtw7-iframe-header">
                <h3>${title}</h3>
                <button class="mtw7-iframe-close" onclick="closeMTW7Iframe()">&times;</button>
            </div>
            <div class="mtw7-iframe-body">
                <iframe src="${url}" frameborder="0" class="mtw7-iframe" onload="hideWordPressHeader(this)"></iframe>
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
    
    // Điều chỉnh iframe để bỏ phần header (thử với 0px nếu WordPress đã được làm sạch)
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
        iframeDoc.body.classList.add('mtw7-iframe-content');
        
        console.log('✅ CSS injected successfully into iframe');
        
    } catch (error) {
        console.log('⚠️ CORS restriction - using overlay method only');
    }
}

function closeMTW7Iframe() {
    const modal = document.getElementById('mtw7-iframe-modal');
    if (modal) {
        modal.remove();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('mtw7-iframe-modal');
    if (modal && event.target === modal) {
        closeMTW7Iframe();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMTW7Iframe();
    }
});

// Load specific lesson by ID or slug
function loadSpecificMTW7Lesson(lessonId, lessonSlug) {
    console.log('🔍 Looking for lesson:', { id: lessonId, slug: lessonSlug });
    const apiUrl = 'https://admin.wikiw.vn/wp-json/custom/v1/mtw7-contents';
    const contentDiv = document.getElementById('mtw7-content');
    
    contentDiv.innerHTML = '<div class="loading"><p>🔄 Đang tải bài học...</p></div>';
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data.data || !data.data.contents || !data.data.contents.nodes) {
                throw new Error('No data received');
            }
            
            const posts = data.data.contents.nodes;
            allMTW7Lessons = posts;
            
            let lesson = null;
            
            if (lessonId) {
                lesson = posts.find(post => post.id && post.id.toString() === lessonId.toString());
                console.log('🔍 Search by ID:', lessonId, '→', lesson ? 'Found' : 'Not found');
            }
            
            if (!lesson && lessonSlug) {
                lesson = posts.find(post => {
                    const title = post.title || '';
                    const cleanTitle = decodeAllHtmlEntitiesMTW7(title.replace(/TVHL\.?\s*/g, ''));
                    const postSlug = generateSlugMTW7(cleanTitle);
                    return postSlug === lessonSlug;
                });
                console.log('🔍 Search by slug:', lessonSlug, '→', lesson ? 'Found' : 'Not found');
            }
            
            if (lesson) {
                displaySpecificMTW7Lesson(lesson);
            } else {
                displayMTW7LessonNotFound(lessonId || lessonSlug);
            }
        })
        .catch(error => {
            console.error('❌ Error loading lesson:', error);
            displayMTW7Error(error);
        });
}

// Display specific lesson in iframe
function displaySpecificMTW7Lesson(lesson) {
    const contentDiv = document.getElementById('mtw7-content');
    const title = decodeAllHtmlEntitiesMTW7(lesson.title.replace(/TVHL\.?\s*/g, ''));
    const url = lesson.link;
    const postId = lesson.id;
    
    document.title = `${title} - Bài học MTW7 - Wikiw`;
    
    contentDiv.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <a href="/bai-hoc-mtw7/" class="mtw7-link" style="display: inline-block; text-decoration: none;">
                ← Quay lại danh sách
            </a>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
                <h2 style="margin: 0; color: #333; flex: 1;">${title}</h2>
                <span style="font-size: 0.75rem; color: #999; background: #f0f0f0; padding: 4px 10px; border-radius: 4px; margin-left: 1rem; font-family: monospace; cursor: pointer; white-space: nowrap;" title="WordPress ID: ${postId} (Click to copy)" onclick="copyMTW7LessonId(${postId}, event)">
                    ID: #${postId}
                </span>
            </div>
        </div>
        <div style="position: relative; width: 100%; height: 80vh; min-height: 600px;">
            <iframe 
                src="${url}" 
                frameborder="0" 
                class="mtw7-iframe" 
                style="width: 100%; height: 100%; border: 1px solid #ddd; border-radius: 8px;"
                onload="hideWordPressHeader(this)">
            </iframe>
        </div>
    `;
}

// Display lesson not found
function displayMTW7LessonNotFound(slug) {
    const contentDiv = document.getElementById('mtw7-content');
    contentDiv.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <h2>❌ Không tìm thấy bài học</h2>
            <p>Bài học với slug "<strong>${slug}</strong>" không tồn tại.</p>
            <a href="/bai-hoc-mtw7/" class="mtw7-link" style="display: inline-block; text-decoration: none; margin-top: 1rem;">
                ← Quay lại danh sách
            </a>
        </div>
    `;
}

// Copy lesson ID to clipboard
function copyMTW7LessonId(id, event) {
    event.preventDefault();
    event.stopPropagation();
    
    const text = id.toString();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showCopyNotificationMTW7(event.target, 'Đã copy ID!'))
            .catch(() => fallbackCopyTextToClipboardMTW7(text, event.target));
    } else {
        fallbackCopyTextToClipboardMTW7(text, event.target);
    }
}

// Fallback copy method
function fallbackCopyTextToClipboardMTW7(text, targetElement) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotificationMTW7(targetElement, 'Đã copy ID!');
    } catch (err) {
        showCopyNotificationMTW7(targetElement, 'Copy failed');
    }
    
    document.body.removeChild(textArea);
}

// Show copy notification
function showCopyNotificationMTW7(element, message) {
    const originalText = element.textContent;
    element.textContent = message;
    element.style.backgroundColor = '#4CAF50';
    element.style.color = 'white';
    
    setTimeout(() => {
        element.textContent = originalText;
        element.style.backgroundColor = '#f0f0f0';
        element.style.color = '#999';
    }, 1500);
}

function displayMTW7Error(error) {
    const contentDiv = document.getElementById('mtw7-content');
    
    contentDiv.innerHTML = `
        <div class="mtw7-error">
            <p>❌ Lỗi khi tải dữ liệu MTW7</p>
            <p><strong>Chi tiết:</strong> ${error.message}</p>
            <p><strong>URL:</strong> https://admin.wikiw.vn/wp-json/custom/v1/mtw7-contents</p>
        </div>
    `;
}
</script>
