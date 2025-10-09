---
title: "Câu tâm đắc"
date: 2024-10-04T09:00:00+07:00
draft: false
description: "Danh sách các câu tâm đắc từ WordPress"
type: "page"
layout: "tamdac-lessons"
---

# ⭐ Câu tâm đắc

<div id="tamdac-content">
    <div class="loading">
        <p>🔄 Đang tải dữ liệu từ WordPress...</p>
    </div>
</div>

<script>
// Fetch data from WordPress API
fetch('https://admin.wikiw.vn/wp-json/custom/v1/tamdac-contents')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('📊 Tam dac data received:', data);
        displayTamDacContent(data);
    })
    .catch(error => {
        console.error('❌ Error fetching Tam dac data:', error);
        displayTamDacError(error);
    });

function displayTamDacContent(data) {
    const contentDiv = document.getElementById('tamdac-content');
    
    // Debug: Log data structure
    console.log('🔍 Tam dac data structure:', data);
    
    // Extract posts array from data object
    let posts = data;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Try different possible keys
        posts = data.posts || data.data || data.items || data.results || Object.values(data)[0];
    }
    
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
        contentDiv.innerHTML = '<div class="tamdac-error"><p>Không có dữ liệu câu tâm đắc nào.</p></div>';
        return;
    }
    
    let html = `
        <div class="tamdac-container">
            <div class="tamdac-grid">
    `;
    
    posts.forEach((post, index) => {
        // Xử lý title
        let title = post.title || 'Không có tiêu đề';
        title = title.replace(/&#8211;/g, '–');
        
        const link = post.link || '#';
        
        // Lấy full content để hiển thị trực tiếp
        let fullContent = 'Không có nội dung';
        if (post.content) {
            // Tạo một div tạm để parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            fullContent = textContent.trim();
        }
        
        // Escape HTML để tránh lỗi cấu trúc
        const escapedTitle = title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const escapedContent = fullContent.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        html += `
            <div class="tamdac-card-container">
                <div class="tamdac-header">
                    <div class="tamdac-star-icon">⭐</div>
                    <h3 class="tamdac-title">${escapedTitle}</h3>
                </div>
                <div class="tamdac-content">
                    <div class="tamdac-content-text">${escapedContent}</div>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    contentDiv.innerHTML = html;
}

function displayTamDacError(error) {
    const contentDiv = document.getElementById('tamdac-content');
    
    contentDiv.innerHTML = `
        <div class="tamdac-error">
            <p>❌ Lỗi khi tải dữ liệu Câu tâm đắc</p>
            <p><strong>Chi tiết:</strong> ${error.message}</p>
            <p><strong>URL:</strong> https://admin.wikiw.vn/wp-json/custom/v1/tamdac-contents</p>
        </div>
    `;
}
</script>