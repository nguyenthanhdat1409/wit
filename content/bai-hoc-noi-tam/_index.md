---
title: "Bài học nội tâm"
date: 2025-10-20T09:00:00+07:00
draft: false
description: "Danh sách các bài học nội tâm từ WordPress"
type: "page"
layout: "noi-tam-lessons"
weight: 15
---

# 🧘 Bài học nội tâm

<div id="noitam-content">
    <div class="loading">
        <p>🔄 Đang tải dữ liệu từ WordPress...</p>
    </div>
</div>

<style>
/* Loading Animation */
.loading {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
    color: #666;
}

.loading p {
    animation: pulse 1.5s ease-in-out infinite alternate;
}

@keyframes pulse {
    from { opacity: 0.6; }
    to { opacity: 1; }
}

/* Noi Tam Posts Styles */
.noitam-posts {
    margin: 2rem 0;
}

.noitam-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
}

.noitam-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
}

.noitam-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.noitam-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.75rem;
    line-height: 1.4;
}

.noitam-excerpt {
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 1rem;
    font-size: 0.95rem;
}

.noitam-link {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.noitam-link:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.noitam-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    margin: 2rem 0;
}

/* Iframe Modal Styles */
.noitam-iframe-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.noitam-iframe-content {
    background: white;
    border-radius: 12px;
    width: 95%;
    height: 90%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.noitam-iframe-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.noitam-iframe-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #1f2937;
    font-weight: 600;
}

.noitam-iframe-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.noitam-iframe-close:hover {
    background: #e5e7eb;
    color: #374151;
}

.noitam-iframe-body {
    flex: 1;
    position: relative;
}

.noitam-iframe {
    width: 100%;
    height: 100%;
    border: none;
}

.wordpress-header-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: white;
    z-index: 1000;
    pointer-events: none;
}

/* Responsive Design */
@media (max-width: 768px) {
    .noitam-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .noitam-card {
        padding: 1.25rem;
    }
    
    .noitam-iframe-content {
        width: 98%;
        height: 95%;
        margin: 0.5rem;
    }
    
    .noitam-iframe-header {
        padding: 0.75rem 1rem;
    }
    
    .noitam-iframe-header h3 {
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .noitam-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
    
    .noitam-card {
        padding: 1rem;
    }
    
    .noitam-title {
        font-size: 1.1rem;
    }
    
    .noitam-excerpt {
        font-size: 0.9rem;
    }
    
    .noitam-link {
        padding: 0.625rem 1.25rem;
        font-size: 0.85rem;
    }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    loadNoiTamData();
});

function loadNoiTamData() {
    console.log('🔄 Loading Bài học nội tâm data...');
    const apiUrl = 'https://admin.wikiw.vn/wp-json/custom/v1/baihoc-contents';
    const contentDiv = document.getElementById('noitam-content');
    
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
            console.log('✅ Bài học nội tâm data loaded:', data);
            displayNoiTamContent(data);
        })
        .catch(error => {
            console.error('❌ Error loading Bài học nội tâm data:', error);
            displayNoiTamError(error);
        });
    === HẾT CODE CŨ === */
    
    // ✅ CODE MỚI (CÓ CACHE - 30 NGÀY)
    if (typeof window.CacheManager !== 'undefined') {
        console.log('📦 Using Cache Manager for Bài học nội tâm');
        
        window.CacheManager.fetchWithCache(apiUrl)
            .then(result => {
                const data = result.data;
                if (result.fromCache) {
                    console.log('⚡ Bài học nội tâm loaded from CACHE (fast!)');
                } else {
                    console.log('🌐 Bài học nội tâm loaded from SERVER (cached for 30 days)');
                }
                console.log('✅ Bài học nội tâm data loaded:', data);
                displayNoiTamContent(data);
            })
            .catch(error => {
                console.error('❌ Error loading Bài học nội tâm data:', error);
                displayNoiTamError(error);
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
                displayNoiTamContent(data);
            })
            .catch(error => {
                displayNoiTamError(error);
            });
    }
}

function displayNoiTamContent(data) {
    const contentDiv = document.getElementById('noitam-content');
    
    if (!data.data || !data.data.contents || !data.data.contents.nodes) {
        contentDiv.innerHTML = '<p>❌ Không có dữ liệu từ WordPress</p>';
        return;
    }
    
    let posts = data.data.contents.nodes;
    console.log(`📊 Found ${posts.length} Bài học nội tâm posts from WordPress`);
    
    // Sort posts by lesson number (Chủ đề XX hoặc số thứ tự)
    posts = posts.sort((a, b) => {
        const getLessonNumber = (title) => {
            // Tìm số trong tiêu đề (Chủ đề 50, Bài 1, etc.)
            const match = title.match(/(?:Chủ đề|Bài|Bài học)\s*(\d+)/i);
            return match ? parseInt(match[1]) : 999; // Put items without number at end
        };
        
        const numA = getLessonNumber(a.title || '');
        const numB = getLessonNumber(b.title || '');
        
        return numA - numB; // Ascending order (01, 02, 03...)
    });
    
    console.log('📚 Sorted lessons:', posts.map(p => p.title));
    
    let html = `
        <div class="noitam-posts">
            <div class="noitam-grid">
    `;
    
    posts.forEach((post, index) => {
        // Bỏ chữ "TVHL" khỏi title nếu có
        let title = post.title || 'Không có tiêu đề';
        title = title.replace(/TVHL\.?\s*/g, '').replace(/&#8211;/g, '–');
        
        const link = post.link || '#';
        
        // Lấy text thuần từ content, bỏ HTML tags
        let content = 'Không có nội dung';
        if (post.content) {
            // Tạo một div tạm để parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            content = textContent.trim().substring(0, 150) + (textContent.length > 150 ? '...' : '');
        }
        
        // Escape HTML để tránh lỗi cấu trúc
        const escapedTitle = title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const escapedContent = content.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const escapedLink = link.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        html += `
            <div class="noitam-card">
                <h3 class="noitam-title">${escapedTitle}</h3>
                <div class="noitam-excerpt">${escapedContent}</div>
                <button onclick="openNoiTamLesson('${escapedLink}', '${escapedTitle}')" class="noitam-link">
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

function openNoiTamLesson(url, title) {
    // Create modal for iframe
    const modal = document.createElement('div');
    modal.id = 'noitam-iframe-modal';
    modal.className = 'noitam-iframe-overlay';
    modal.innerHTML = `
        <div class="noitam-iframe-content">
            <div class="noitam-iframe-header">
                <h3>${title}</h3>
                <button class="noitam-iframe-close" onclick="closeNoiTamIframe()">&times;</button>
            </div>
            <div class="noitam-iframe-body">
                <iframe src="${url}" frameborder="0" class="noitam-iframe" onload="hideWordPressHeaderNoiTam(this)"></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function hideWordPressHeaderNoiTam(iframe) {
    console.log('🔍 Attempting to hide WordPress header for Bài học nội tâm...');
    
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
    
    console.log('✅ WordPress header overlay created for Bài học nội tâm');
    
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
            
            /* Điều chỉnh body WordPress để bỏ margin/padding top và thêm margin-top cho header popup */
            body {
                margin-top: 0px !important;
                padding-top: 0 !important;
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
                    margin-top: 20px !important;
                }
            }
            
            /* Đảm bảo tiêu đề bài học hiển thị đầy đủ */
            .entry-title,
            .post-title,
            .page-title,
            h1.entry-title,
            .wp-block-post-title {
                margin-top: 20px !important;
                padding-top: 10px !important;
            }
            
            /* Xử lý cấu trúc WordPress cụ thể */
            .gt-main {
                margin-top: 0px !important;
                padding-top: 20px !important;
            }
            
            .gt-post-header {
                margin-top: 5% !important;
                padding-top: 20px !important;
            }
            
            .gt-post-header h1 {
                margin-top: 0px !important;
                padding-top: 0px !important;
                font-size: 1.5rem !important;
                line-height: 1.3 !important;
            }
            
            .gt-content-body {
                margin-top: 20px !important;
            }
            
            /* Đảm bảo nội dung không bị cắt */
            .gt-page-wrapper {
                margin-top: 0px !important;
            }
            
            .gt-article {
                margin-top: 0px !important;
            }
            
            /* Cập nhật padding cho gt-flex-container */
            .gt-flex-container {
                width: 1440px !important;
                max-width: 100% !important;
                padding: 30px 60px !important;
                margin: 0 auto !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                flex-wrap: wrap !important;
            }
            
            /* Loại bỏ các đường line che chữ */
            .gt-post-header::before,
            .gt-post-header::after,
            .gt-post-header h1::before,
            .gt-post-header h1::after,
            h1::before,
            h1::after {
                display: none !important;
                content: none !important;
            }
            
            /* Loại bỏ border và outline */
            .gt-post-header,
            .gt-post-header h1,
            h1 {
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
            }
            
            /* Đảm bảo tiêu đề không bị che */
            .gt-post-header h1 {
                position: relative !important;
                z-index: 10 !important;
                background: transparent !important;
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
        `;
        
        iframeDoc.head.appendChild(style);
        iframeDoc.body.classList.add('noitam-iframe-content');
        
        console.log('✅ CSS injected successfully into iframe for Bài học nội tâm');
        
    } catch (error) {
        console.log('⚠️ CORS restriction - using overlay method only for Bài học nội tâm');
    }
}

function closeNoiTamIframe() {
    const modal = document.getElementById('noitam-iframe-modal');
    if (modal) {
        modal.remove();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('noitam-iframe-modal');
    if (modal && event.target === modal) {
        closeNoiTamIframe();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeNoiTamIframe();
    }
});

function displayNoiTamError(error) {
    const contentDiv = document.getElementById('noitam-content');
    
    contentDiv.innerHTML = `
        <div class="noitam-error">
            <p>❌ Lỗi khi tải dữ liệu Bài học nội tâm</p>
            <p><strong>Chi tiết:</strong> ${error.message}</p>
            <p><strong>URL:</strong> https://admin.wikiw.vn/wp-json/custom/v1/baihoc-contents</p>
        </div>
    `;
}
</script>

