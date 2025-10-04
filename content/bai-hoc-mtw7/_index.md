---
title: "Bài học MTW7"
date: 2024-10-04T09:00:00+07:00
draft: false
description: "Danh sách các bài học MTW7 từ WordPress"
type: "page"
layout: "mtw7-lessons"
---

# 🎯 Bài học MTW7

Danh sách các bài học MTW7 được tải từ WordPress API.

<div id="mtw7-content">
    <div class="loading">
        <p>🔄 Đang tải dữ liệu từ WordPress...</p>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    loadMTW7Data();
});

function loadMTW7Data() {
    console.log('🔄 Loading MTW7 data...');
    const apiUrl = 'https://wit.convoi.com.vn/wp-json/custom/v1/mtw7-contents';
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

function displayMTW7Content(data) {
    const contentDiv = document.getElementById('mtw7-content');
    
    if (!data.data || !data.data.contents || !data.data.contents.nodes) {
        contentDiv.innerHTML = '<p>❌ Không có dữ liệu từ WordPress</p>';
        return;
    }
    
    let posts = data.data.contents.nodes;
    console.log(`📊 Found ${posts.length} MTW7 posts from WordPress`);
    
    // Sort posts by lesson number (Buổi XX)
    posts = posts.sort((a, b) => {
        const getLessonNumber = (title) => {
            const match = title.match(/Buổi\s*(\d+)/i);
            return match ? parseInt(match[1]) : 999; // Put items without number at end
        };
        
        const numA = getLessonNumber(a.title || '');
        const numB = getLessonNumber(b.title || '');
        
        return numA - numB; // Ascending order (01, 02, 03...)
    });
    
    console.log('📚 Sorted lessons:', posts.map(p => p.title));
    
    let html = `
        <div class="mtw7-posts">
            <div class="mtw7-grid">
    `;
    
    posts.forEach((post, index) => {
        // Bỏ chữ "TVHL" khỏi title
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
            <div class="mtw7-card">
                <h3 class="mtw7-title">${escapedTitle}</h3>
                <div class="mtw7-excerpt">${escapedContent}</div>
                <button onclick="openMTW7Lesson('${escapedLink}', '${escapedTitle}')" class="mtw7-link">
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
    headerOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 80px;
        background: white;
        z-index: 1000;
        pointer-events: none;
    `;
    
    iframeContainer.appendChild(headerOverlay);
    
    // Điều chỉnh iframe để bỏ phần header
    iframe.style.transform = 'translateY(-80px)';
    iframe.style.height = 'calc(100% + 80px)';
    
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
            
            /* Điều chỉnh body WordPress để bỏ margin/padding top */
            body {
                margin-top: 0 !important;
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
                    margin-top: 10px !important;
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

function displayMTW7Error(error) {
    const contentDiv = document.getElementById('mtw7-content');
    
    contentDiv.innerHTML = `
        <div class="mtw7-error">
            <p>❌ Lỗi khi tải dữ liệu MTW7</p>
            <p><strong>Chi tiết:</strong> ${error.message}</p>
            <p><strong>URL:</strong> https://wit.convoi.com.vn/wp-json/custom/v1/mtw7-contents</p>
        </div>
    `;
}
</script>
