---
title: "Khái Niệm Nguồn"
date: 2024-10-04T09:00:00+07:00
draft: false
description: "Khái Niệm Nguồn"
type: "page"
layout: "khainiem-lessons"
---

# 💎 Khái Niệm Nguồn

<div id="khainiem-content">
    <div class="loading">
        <p>🔄 Đang tải dữ liệu từ WordPress...</p>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    loadKhaiNiemData();
});

function loadKhaiNiemData() {
    console.log('🔄 Loading Khái Niệm Nguồn data...');
    const apiUrl = 'https://admin.wikiw.vn/wp-json/custom/v1/khainiem-contents';
    const contentDiv = document.getElementById('khainiem-content');
    
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
            console.log('✅ Khái Niệm Nguồn data loaded:', data);
            displayKhaiNiemContent(data);
        })
        .catch(error => {
            console.error('❌ Error loading Khái Niệm Nguồn data:', error);
            displayKhaiNiemError(error);
        });
}

function displayKhaiNiemContent(data) {
    const contentDiv = document.getElementById('khainiem-content');
    
    if (!data.data || !data.data.contents || !data.data.contents.nodes) {
        contentDiv.innerHTML = '<p>❌ Không có dữ liệu từ WordPress</p>';
        return;
    }
    
    let posts = data.data.contents.nodes;
    console.log(`📊 Found ${posts.length} Khái Niệm Nguồn posts from WordPress`);
    
    let html = `
        <div class="khainiem-posts">
            <div class="khainiem-grid">
    `;
    
    posts.forEach((post, index) => {
        
        let title = post.title || 'Không có tiêu đề';
        
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
            <div class="khainiem-card">
                <h3 class="khainiem-title">${escapedTitle}</h3>
                <div class="khainiem-excerpt">${escapedContent}</div>
                <button onclick="openKhaiNiemLesson('${escapedLink}', '${escapedTitle}')" class="khainiem-link">
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
    
    // Thêm overlay để che header WordPress
    const iframeBody = iframe.parentNode;
    iframeBody.style.position = 'relative';
    
    const overlay = document.createElement('div');
    overlay.className = 'wordpress-header-overlay';
    
    // Điều chỉnh height dựa trên màn hình
    const isMobile = window.innerWidth <= 480;
    
    // Chỉ tạo overlay trên mobile để tránh đường line trắng trên desktop
    if (isMobile) {
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 10px;
            background: white;
            z-index: 1000;
            pointer-events: none;
        `;
        iframeBody.appendChild(overlay);
    }
    
    // Điều chỉnh iframe position để che header
    iframe.style.transform = 'translateY(0px)';
    iframe.style.height = '100%';
    
    console.log('✅ WordPress header overlay created');
    
    // Thử inject CSS vào iframe nếu có thể (same-origin)
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const style = document.createElement('style');
        style.textContent = `
            
            /* Ẩn header và navigation WordPress */
            .gt-site-header,
            .site-header,
            header.header,
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
