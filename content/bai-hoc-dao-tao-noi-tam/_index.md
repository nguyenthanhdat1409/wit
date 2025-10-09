---
title: "Bài học đào tạo nội tâm"
date: 2024-12-19T09:00:00+07:00
draft: false
description: "Danh sách các bài học đào tạo nội tâm từ WordPress"
type: "page"
layout: "daotao-lessons"
---

# 🧘 Bài học đào tạo nội tâm

<div id="daotao-content">
    <div class="loading">
        <p>🔄 Đang tải dữ liệu từ WordPress...</p>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    loadDaoTaoData();
});

function loadDaoTaoData() {
    console.log('🔄 Loading Đào tạo nội tâm data...');
    const apiUrl = 'https://admin.wikiw.vn/wp-json/custom/v1/daotao-contents';
    const contentDiv = document.getElementById('daotao-content');
    
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
            console.log('✅ Đào tạo nội tâm data loaded:', data);
            displayDaoTaoContent(data);
        })
        .catch(error => {
            console.error('❌ Error loading Đào tạo nội tâm data:', error);
            displayDaoTaoError(error);
        });
}

function displayDaoTaoContent(data) {
    const contentDiv = document.getElementById('daotao-content');
    
    if (!data.data || !data.data.contents || !data.data.contents.nodes) {
        contentDiv.innerHTML = '<p>❌ Không có dữ liệu từ WordPress</p>';
        return;
    }
    
    let posts = data.data.contents.nodes;
    console.log(`📊 Found ${posts.length} Đào tạo nội tâm posts from WordPress`);
    
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
        <div class="daotao-posts">
            <div class="daotao-grid">
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
            <div class="daotao-card">
                <h3 class="daotao-title">${escapedTitle}</h3>
                <div class="daotao-excerpt">${escapedContent}</div>
                <button onclick="openDaoTaoLesson('${escapedLink}', '${escapedTitle}')" class="daotao-link">
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

function openDaoTaoLesson(url, title) {
    // Create modal for iframe
    const modal = document.createElement('div');
    modal.id = 'daotao-iframe-modal';
    modal.className = 'daotao-iframe-overlay';
    modal.innerHTML = `
        <div class="daotao-iframe-content">
            <div class="daotao-iframe-header">
                <h3>${title}</h3>
                <button class="daotao-iframe-close" onclick="closeDaoTaoIframe()">&times;</button>
            </div>
            <div class="daotao-iframe-body">
                <iframe src="${url}" frameborder="0" class="daotao-iframe" onload="hideWordPressHeaderDaoTao(this)"></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function hideWordPressHeaderDaoTao(iframe) {
    console.log('🔍 Attempting to hide WordPress header for Đào tạo nội tâm...');
    
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
    
    console.log('✅ WordPress header overlay created for Đào tạo nội tâm');
    
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
        iframeDoc.body.classList.add('daotao-iframe-content');
        
        console.log('✅ CSS injected successfully into iframe for Đào tạo nội tâm');
        
    } catch (error) {
        console.log('⚠️ CORS restriction - using overlay method only for Đào tạo nội tâm');
    }
}

function closeDaoTaoIframe() {
    const modal = document.getElementById('daotao-iframe-modal');
    if (modal) {
        modal.remove();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('daotao-iframe-modal');
    if (modal && event.target === modal) {
        closeDaoTaoIframe();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeDaoTaoIframe();
    }
});

function displayDaoTaoError(error) {
    const contentDiv = document.getElementById('daotao-content');
    
    contentDiv.innerHTML = `
        <div class="daotao-error">
            <p>❌ Lỗi khi tải dữ liệu Đào tạo nội tâm</p>
            <p><strong>Chi tiết:</strong> ${error.message}</p>
            <p><strong>URL:</strong> https://admin.wikiw.vn/wp-json/custom/v1/daotao-contents</p>
        </div>
    `;
}
</script>
