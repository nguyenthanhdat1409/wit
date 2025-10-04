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
            <p class="mtw7-meta">📚 Đã tải ${posts.length} bài học MTW7 từ WordPress</p>
            <div class="mtw7-grid">
    `;
    
    posts.forEach(post => {
        const title = post.title || 'Không có tiêu đề';
        const link = post.link || '#';
        const content = post.content ? post.content.substring(0, 200) + '...' : 'Không có nội dung';
        
        html += `
            <div class="mtw7-card">
                <h3 class="mtw7-title">${title}</h3>
                <div class="mtw7-excerpt">${content}</div>
                <a href="${link}" target="_blank" class="mtw7-link">
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
