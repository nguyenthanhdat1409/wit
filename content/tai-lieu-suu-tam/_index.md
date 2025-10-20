---
title: "Tài liệu sưu tầm"
description: ""
date: 2025-10-20
draft: false
weight: 20
type: "page"
layout: "tailieu-lessons"
---

<div id="tailieu-content">
    <div class="loading">
        <p>🔄 Đang tải dữ liệu từ WordPress...</p>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    loadTaiLieuData();
});

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

function displayTaiLieuContent(data) {
    const contentDiv = document.getElementById('tailieu-content');
    
    if (!data.data || !data.data.contents || !data.data.contents.nodes) {
        contentDiv.innerHTML = '<p>❌ Không có dữ liệu từ WordPress</p>';
        return;
    }
    
    let posts = data.data.contents.nodes;
    console.log(`📊 Found ${posts.length} Tài liệu sưu tầm posts from WordPress`);
    
    // Sort posts by title alphabetically
    posts = posts.sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return titleA.localeCompare(titleB, 'vi');
    });
    
    console.log('📚 Sorted documents:', posts.map(p => p.title));
    
    let html = `
        <div class="tailieu-posts">
            <div class="tailieu-grid">
    `;
    
    posts.forEach((post, index) => {
        let title = post.title || 'Không có tiêu đề';
        title = title.replace(/&#8211;/g, '–');
        
        const link = post.link || '#';
        
        // Lấy text thuần từ content
        let content = 'Không có nội dung';
        if (post.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            content = textContent.trim().substring(0, 200) + (textContent.length > 200 ? '...' : '');
        }
        
        // Escape HTML
        const escapedTitle = title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const escapedContent = content.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const escapedLink = link.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        html += `
            <div class="tailieu-card">
                <h3 class="tailieu-title">${escapedTitle}</h3>
                <div class="tailieu-excerpt">${escapedContent}</div>
                <button onclick="openTaiLieuLesson('${escapedLink}', '${escapedTitle}')" class="tailieu-link">
                    📖 Đọc thêm
                </button>
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
