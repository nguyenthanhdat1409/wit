---
title: "Tài liệu sưu tầm"
description: ""
date: 2025-10-20
draft: false
weight: 20
type: "page"
layout: "tailieu-lessons"
---

<!-- Search Container -->
<div class="search-container">
  <div class="search-wrapper">
    <input 
      type="text" 
      id="searchInput" 
      class="search-input" 
      placeholder="Tìm kiếm tài liệu sưu tầm..."
      autocomplete="off"
    />
    <button id="clearSearch" class="clear-search" title="Xóa tìm kiếm">✕</button>
    <button id="searchButton" class="search-button" title="Tìm kiếm">🔍</button>
  </div>
  <div id="searchResultsInfo" class="search-results-info"></div>
</div>

<div id="tailieu-content">
    <div class="loading">
        <p>🔄 Đang tải dữ liệu từ WordPress...</p>
    </div>
</div>

<script>
// Global variables to store lessons data
let allTaiLieuLessons = [];
let filteredTaiLieuLessons = [];

document.addEventListener('DOMContentLoaded', function() {
    // Check if URL has lesson parameter
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id'); // Primary: WordPress ID
    const lessonSlug = urlParams.get('lesson'); // Secondary: slug for SEO
    
    if (lessonId || lessonSlug) {
        console.log('📖 Loading specific lesson:', { id: lessonId, slug: lessonSlug });
        loadSpecificTaiLieuLesson(lessonId, lessonSlug);
    } else {
        console.log('📚 Loading lesson list');
        loadTaiLieuData();
    }
});

// Decode ALL HTML entities (comprehensive)
function decodeAllHtmlEntitiesTaiLieu(text) {
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
function generateSlugTaiLieu(title) {
    const decodedTitle = decodeAllHtmlEntitiesTaiLieu(title);
    return decodedTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function loadTaiLieuData() {
    console.log('🔄 Loading Tài liệu sưu tầm data...');
    const apiUrl = 'https://admin.wikiw.vn/wp-json/custom/v1/wikingon-tai-lieu';
    const contentDiv = document.getElementById('tailieu-content');
    
    console.log('📡 Fetching from:', apiUrl);
    
    // ✅ SỬ DỤNG CACHE MANAGER
    if (typeof window.CacheManager !== 'undefined') {
        console.log('📦 Using Cache Manager for Tài liệu sưu tầm');
        
        window.CacheManager.fetchWithCache(apiUrl)
            .then(result => {
                const data = result.data;
                if (result.fromCache) {
                    console.log('⚡ Tài liệu sưu tầm loaded from CACHE (fast!)');
                } else {
                    console.log('🌐 Tài liệu sưu tầm loaded from SERVER (cached for 30 days)');
                }
                console.log('✅ Tài liệu sưu tầm data loaded:', data);
                displayTaiLieuContent(data);
            })
            .catch(error => {
                console.error('❌ Error loading Tài liệu sưu tầm data:', error);
                displayTaiLieuError(error);
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
                displayTaiLieuContent(data);
            })
            .catch(error => {
                displayTaiLieuError(error);
            });
    }
}

// Initialize search functionality
function initializeTaiLieuSearch() {
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
    performTaiLieuSearch(searchTerm);
  });
  
  // Clear search
  clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    performTaiLieuSearch('');
    searchInput.focus();
  });
  
  // Search button click
  searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();
    performTaiLieuSearch(searchTerm);
    searchInput.focus();
  });
  
  // Enter key to search
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      performTaiLieuSearch(searchInput.value.trim());
    }
  });
  
  // Initial info
  updateTaiLieuSearchInfo(allTaiLieuLessons.length, allTaiLieuLessons.length);
}

// Perform search
function performTaiLieuSearch(searchTerm) {
  if (!searchTerm) {
    filteredTaiLieuLessons = allTaiLieuLessons;
    displayFilteredTaiLieu(filteredTaiLieuLessons);
    updateTaiLieuSearchInfo(allTaiLieuLessons.length, allTaiLieuLessons.length);
    return;
  }
  
  const searchLower = searchTerm.toLowerCase();
  
  filteredTaiLieuLessons = allTaiLieuLessons.filter(doc => {
    const title = (doc.title || '').toLowerCase();
    const content = (doc.content || '').replace(/<[^>]*>/g, '').toLowerCase();
    
    return title.includes(searchLower) || content.includes(searchLower);
  });
  
  displayFilteredTaiLieu(filteredTaiLieuLessons, searchTerm);
  updateTaiLieuSearchInfo(filteredTaiLieuLessons.length, allTaiLieuLessons.length);
}

// Update search results info
function updateTaiLieuSearchInfo(found, total) {
  const searchResultsInfo = document.getElementById('searchResultsInfo');
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.trim();
  
  if (!searchTerm) {
    searchResultsInfo.innerHTML = `📊 Hiển thị <strong>${total}</strong> tài liệu sưu tầm`;
  } else if (found === 0) {
    searchResultsInfo.innerHTML = `❌ Không tìm thấy kết quả cho "<strong>${searchTerm}</strong>"`;
  } else {
    searchResultsInfo.innerHTML = `✅ Tìm thấy <strong>${found}</strong> kết quả từ <strong>${total}</strong> tài liệu`;
  }
}

// Escape special characters for regex
function escapeRegexTaiLieu(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function displayTaiLieuContent(data) {
    const contentDiv = document.getElementById('tailieu-content');
    
    if (!data.data || !data.data.contents || !data.data.contents.nodes) {
        contentDiv.innerHTML = '<p>❌ Không có dữ liệu từ WordPress</p>';
        return;
    }
    
    let posts = data.data.contents.nodes;
    
    // Store data globally
    allTaiLieuLessons = posts;
    filteredTaiLieuLessons = posts;
    
    console.log(`📊 Found ${posts.length} Tài liệu sưu tầm posts from WordPress`);
    
    // Sort posts by title alphabetically
    posts = posts.sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return titleA.localeCompare(titleB, 'vi');
    });
    
    console.log('📚 Sorted documents:', posts.map(p => p.title));
    
    displayFilteredTaiLieu(posts);
    initializeTaiLieuSearch();
}

// Display filtered documents with optional highlight
function displayFilteredTaiLieu(posts, searchTerm = '') {
    const contentDiv = document.getElementById('tailieu-content');
    
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
        <div class="tailieu-posts">
            <div class="tailieu-grid">
    `;
    
    posts.forEach((post, index) => {
        let title = post.title || 'Không có tiêu đề';
        title = decodeAllHtmlEntitiesTaiLieu(title);
        
        const link = post.link || '#';
        const postId = post.id || index;
        
        // Highlight search term if provided
        let displayTitle = title;
        if (searchTerm) {
          const regex = new RegExp(`(${escapeRegexTaiLieu(searchTerm)})`, 'gi');
          displayTitle = displayTitle.replace(regex, '<span class="highlight">$1</span>');
        }
        
        // Generate slug for SEO-friendly URL
        const slug = generateSlugTaiLieu(title);
        const lessonUrl = `/tai-lieu-suu-tam/?id=${postId}&lesson=${slug}`;
        
        // Lấy text thuần từ content
        let content = 'Không có nội dung';
        if (post.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            content = textContent.trim().substring(0, 200) + (textContent.length > 200 ? '...' : '');
        }
        
        // Highlight search term in content if provided
        let displayContent = content;
        if (searchTerm) {
          const regex = new RegExp(`(${escapeRegexTaiLieu(searchTerm)})`, 'gi');
          displayContent = displayContent.replace(regex, '<span class="highlight">$1</span>');
        }
        
        html += `
            <div class="tailieu-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <h3 class="tailieu-title" style="margin: 0; flex: 1;">${displayTitle}</h3>
                    <span class="tailieu-id" style="font-size: 0.7rem; color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 3px; margin-left: 8px; font-family: monospace; cursor: pointer;" title="WordPress ID: ${postId} (Click to copy)" onclick="copyTaiLieuLessonId(${postId}, event)">
                        #${postId}
                    </span>
                </div>
                <div class="tailieu-excerpt">${displayContent}</div>
                <a href="${lessonUrl}" class="tailieu-link" style="display: inline-block; text-decoration: none; text-align: center;">
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

function openTaiLieuLesson(url, title) {
    // Create modal for iframe
    const modal = document.createElement('div');
    modal.id = 'tailieu-iframe-modal';
    modal.className = 'tailieu-iframe-overlay';
    modal.innerHTML = `
        <div class="tailieu-iframe-content">
            <div class="tailieu-iframe-header">
                <h3>${title}</h3>
                <button class="tailieu-iframe-close" onclick="closeTaiLieuIframe()">&times;</button>
            </div>
            <div class="tailieu-iframe-body">
                <iframe src="${url}" frameborder="0" class="tailieu-iframe" onload="hideWordPressHeaderTaiLieu(this)"></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function hideWordPressHeaderTaiLieu(iframe) {
    console.log('🔍 Attempting to hide WordPress header for Tài liệu sưu tầm...');
    
    const iframeContainer = iframe.parentNode;
    iframeContainer.style.position = 'relative';
    
    const headerOverlay = document.createElement('div');
    headerOverlay.className = 'wordpress-header-overlay';
    
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
    
    iframe.style.transform = 'translateY(0px)';
    iframe.style.height = '100%';
    
    console.log('✅ WordPress header overlay created for Tài liệu sưu tầm');
    
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        const style = iframeDoc.createElement('style');
        style.textContent = `
            /* Ẩn header WordPress */
            .gt-header, .gt-mobile-header, .gt-default, .gt-header-main,
            .gt-style-1, .gt-light, header[class*="gt-"],
            .site-header, .wp-site-blocks > header,
            .wp-block-template-part, .entry-header, .page-header,
            header[role="banner"], .site-branding, .main-navigation,
            .site-navigation, .menu-toggle, nav, .navigation {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
            }
            
            body {
                margin-top: 0px !important;
                padding-top: 0 !important;
            }
            
            .gt-post-header {
                margin-top: 20px !important;
                padding-top: 20px !important;
            }
            
            .gt-post-header h1 {
                margin-top: 0px !important;
                font-size: 1.5rem !important;
                line-height: 1.3 !important;
            }
            
            @media (max-width: 768px) {
                .gt-post-header {
                    margin-top: 15px !important;
                }
            }
            
            @media (max-width: 480px) {
                .gt-post-header {
                    margin-top: 20px !important;
                }
            }
        `;
        
        iframeDoc.head.appendChild(style);
        iframeDoc.body.classList.add('tailieu-iframe-content');
        
        console.log('✅ CSS injected successfully into iframe for Tài liệu sưu tầm');
        
    } catch (error) {
        console.log('⚠️ CORS restriction - using overlay method only for Tài liệu sưu tầm');
    }
}

function closeTaiLieuIframe() {
    const modal = document.getElementById('tailieu-iframe-modal');
    if (modal) {
        modal.remove();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('tailieu-iframe-modal');
    if (modal && event.target === modal) {
        closeTaiLieuIframe();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeTaiLieuIframe();
    }
});

// Load specific lesson by ID or slug
function loadSpecificTaiLieuLesson(lessonId, lessonSlug) {
    console.log('🔍 Looking for lesson:', { id: lessonId, slug: lessonSlug });
    const apiUrl = 'https://admin.wikiw.vn/wp-json/custom/v1/wikingon-tai-lieu';
    const contentDiv = document.getElementById('tailieu-content');
    
    contentDiv.innerHTML = '<div class="loading"><p>🔄 Đang tải tài liệu...</p></div>';
    
    const shouldBypassCache = true;
    const fetchPromise = (typeof window.CacheManager !== 'undefined' && !shouldBypassCache)
        ? window.CacheManager.fetchWithCache(apiUrl)
        : fetch(apiUrl).then(response => response.json()).then(data => ({ data }));
    
    fetchPromise
        .then(result => {
            const data = result.data;
            if (!data.data || !data.data.contents || !data.data.contents.nodes) {
                throw new Error('No data received');
            }
            
            const posts = data.data.contents.nodes;
            allTaiLieuLessons = posts;
            
            let lesson = null;
            
            if (lessonId) {
                lesson = posts.find(post => post.id && post.id.toString() === lessonId.toString());
                console.log('🔍 Search by ID:', lessonId, '→', lesson ? 'Found' : 'Not found');
            }
            
            if (!lesson && lessonSlug) {
                lesson = posts.find(post => {
                    const title = post.title || '';
                    const cleanTitle = decodeAllHtmlEntitiesTaiLieu(title);
                    const postSlug = generateSlugTaiLieu(cleanTitle);
                    return postSlug === lessonSlug;
                });
                console.log('🔍 Search by slug:', lessonSlug, '→', lesson ? 'Found' : 'Not found');
            }
            
            if (lesson) {
                displaySpecificTaiLieuLesson(lesson);
            } else {
                displayTaiLieuLessonNotFound(lessonId || lessonSlug);
            }
        })
        .catch(error => {
            console.error('❌ Error loading lesson:', error);
            displayTaiLieuError(error);
        });
}

// Display specific lesson in iframe
function displaySpecificTaiLieuLesson(lesson) {
    const contentDiv = document.getElementById('tailieu-content');
    const title = decodeAllHtmlEntitiesTaiLieu(lesson.title);
    const url = lesson.link;
    const postId = lesson.id;
    
    document.title = `${title} - Tài liệu sưu tầm - Wikiw`;
    
    contentDiv.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <a href="/tai-lieu-suu-tam/" class="tailieu-link" style="display: inline-block; text-decoration: none;">
                ← Quay lại danh sách
            </a>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
                <h2 style="margin: 0; color: #333; flex: 1;">${title}</h2>
                <span style="font-size: 0.75rem; color: #999; background: #f0f0f0; padding: 4px 10px; border-radius: 4px; margin-left: 1rem; font-family: monospace; cursor: pointer; white-space: nowrap;" title="WordPress ID: ${postId} (Click to copy)" onclick="copyTaiLieuLessonId(${postId}, event)">
                    ID: #${postId}
                </span>
            </div>
        </div>
        <div style="position: relative; width: 100%; height: 80vh; min-height: 600px;">
            <iframe 
                src="${url}" 
                frameborder="0" 
                class="tailieu-iframe" 
                style="width: 100%; height: 100%; border: 1px solid #ddd; border-radius: 8px;"
                onload="hideWordPressHeaderTaiLieu(this)">
            </iframe>
        </div>
    `;
}

// Display lesson not found
function displayTaiLieuLessonNotFound(slug) {
    const contentDiv = document.getElementById('tailieu-content');
    contentDiv.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <h2>❌ Không tìm thấy tài liệu</h2>
            <p>Tài liệu với slug "<strong>${slug}</strong>" không tồn tại.</p>
            <a href="/tai-lieu-suu-tam/" class="tailieu-link" style="display: inline-block; text-decoration: none; margin-top: 1rem;">
                ← Quay lại danh sách
            </a>
        </div>
    `;
}

// Copy lesson ID to clipboard
function copyTaiLieuLessonId(id, event) {
    event.preventDefault();
    event.stopPropagation();
    
    const text = id.toString();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showCopyNotificationTaiLieu(event.target, 'Đã copy ID!'))
            .catch(() => fallbackCopyTextToClipboardTaiLieu(text, event.target));
    } else {
        fallbackCopyTextToClipboardTaiLieu(text, event.target);
    }
}

// Fallback copy method
function fallbackCopyTextToClipboardTaiLieu(text, targetElement) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotificationTaiLieu(targetElement, 'Đã copy ID!');
    } catch (err) {
        showCopyNotificationTaiLieu(targetElement, 'Copy failed');
    }
    
    document.body.removeChild(textArea);
}

// Show copy notification
function showCopyNotificationTaiLieu(element, message) {
    const originalText = element.textContent;
    const originalBg = element.style.backgroundColor;
    const originalColor = element.style.color;
    
    element.textContent = message;
    element.style.backgroundColor = '#4CAF50';
    element.style.color = 'white';
    
    setTimeout(() => {
        element.textContent = originalText;
        element.style.backgroundColor = originalBg;
        element.style.color = originalColor;
    }, 1500);
}

function displayTaiLieuError(error) {
    const contentDiv = document.getElementById('tailieu-content');
    
    contentDiv.innerHTML = `
        <div class="tailieu-error">
            <p>❌ Lỗi khi tải dữ liệu Tài liệu sưu tầm</p>
            <p><strong>Chi tiết:</strong> ${error.message}</p>
            <p><strong>URL:</strong> https://admin.wikiw.vn/wp-json/custom/v1/wikingon-tai-lieu</p>
        </div>
    `;
}
</script>

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
  color: #333;
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

/* Loading spinner */
.loading {
    text-align: center;
    padding: 40px 20px;
    font-size: 1.1rem;
    color: #667eea;
}

/* Grid layout for posts */
.tailieu-posts {
    margin: 20px 0;
}

.tailieu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    padding: 20px 0;
}

/* Card styling */
.tailieu-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.tailieu-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.tailieu-title {
    color: white;
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0 0 16px 0;
    line-height: 1.4;
}

.tailieu-excerpt {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 20px;
    flex-grow: 1;
}

.tailieu-link {
    background: white;
    color: #667eea;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
}

.tailieu-link:hover {
    background: #f0f0f0;
    transform: scale(1.05);
}

/* Error styling */
.tailieu-error {
    background: #fee;
    border: 2px solid #f88;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    color: #c00;
}

/* Modal/Iframe overlay */
.tailieu-iframe-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.tailieu-iframe-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 1200px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.tailieu-iframe-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.tailieu-iframe-header h3 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
}

.tailieu-iframe-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 32px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.tailieu-iframe-close:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.tailieu-iframe-body {
    flex: 1;
    overflow: hidden;
    position: relative;
}

.tailieu-iframe {
    width: 100%;
    height: 100%;
    border: none;
}

/* Responsive Design */
@media (max-width: 768px) {
    .tailieu-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
    }
    
    .tailieu-card {
        padding: 20px;
    }
    
    .tailieu-title {
        font-size: 1.15rem;
    }
    
    .tailieu-excerpt {
        font-size: 0.9rem;
    }
    
    .tailieu-iframe-content {
        width: 95%;
        height: 85vh;
    }
    
    .tailieu-iframe-header {
        padding: 16px 20px;
    }
    
    .tailieu-iframe-header h3 {
        font-size: 1.1rem;
    }
}

@media (max-width: 480px) {
    .tailieu-grid {
        grid-template-columns: 1fr;
        gap: 16px;
        padding: 16px 0;
    }
    
    .tailieu-card {
        padding: 18px;
    }
    
    .tailieu-title {
        font-size: 1.1rem;
    }
    
    .tailieu-excerpt {
        font-size: 0.85rem;
        margin-bottom: 16px;
    }
    
    .tailieu-link {
        padding: 10px 20px;
        font-size: 0.95rem;
    }
    
    .tailieu-iframe-overlay {
        padding: 10px;
    }
    
    .tailieu-iframe-content {
        width: 100%;
        height: 90vh;
        border-radius: 8px;
    }
    
    .tailieu-iframe-header {
        padding: 12px 16px;
    }
    
    .tailieu-iframe-header h3 {
        font-size: 1rem;
    }
    
    .tailieu-iframe-close {
        width: 36px;
        height: 36px;
        font-size: 28px;
    }
}
</style>
