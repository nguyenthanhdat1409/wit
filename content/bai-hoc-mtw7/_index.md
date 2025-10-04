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
    
    const posts = data.data.contents.nodes;
    console.log(`📊 Found ${posts.length} MTW7 posts from WordPress`);
    
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
                <iframe src="${url}" frameborder="0" class="mtw7-iframe"></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
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
