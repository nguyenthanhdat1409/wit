---
title: "Nghi vấn"
date: 2024-10-04T09:00:00+07:00
draft: false
description: "Danh sách các câu hỏi nghi vấn từ WordPress"
type: "page"
layout: "nghivan-lessons"
---

# 🎯 Nghi vấn

<div id="nghivan-content">
    <div class="loading">
        <p>🔄 Đang tải dữ liệu từ WordPress...</p>
    </div>
</div>

<script>
// Fetch data from WordPress API
fetch('https://admin.wikiw.vn/wp-json/custom/v1/nghivan-contents')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('📊 Nghi vấn data received:', data);
        displayNghiVanContent(data);
    })
    .catch(error => {
        console.error('❌ Error fetching Nghi vấn data:', error);
        displayNghiVanError(error);
    });

function displayNghiVanContent(posts) {
    const contentDiv = document.getElementById('nghivan-content');
    
    if (!posts || posts.length === 0) {
        contentDiv.innerHTML = '<div class="nghivan-error"><p>Không có dữ liệu nghi vấn nào.</p></div>';
        return;
    }
    
    let html = `
        <div class="nghivan-container">
            <div class="nghivan-grid">
    `;
    
    posts.forEach(post => {
        let title = post.title || 'Không có tiêu đề';
        title = title.replace(/&#8211;/g, '–');
        
        const link = post.link || '#';
        
        // Lấy full content để phân chia thành 2 phần
        let fullContent = 'Không có nội dung';
        if (post.content) {
            // Tạo một div tạm để parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            fullContent = textContent.trim();
        }
        
        // Tách content thành 2 phần: trước "Lời giải:" và từ "Lời giải:" trở đi
        let questionPart = fullContent;
        let answerPart = '';
        
        const loiGiaiIndex = fullContent.indexOf('Lời giải:');
        if (loiGiaiIndex !== -1) {
            questionPart = fullContent.substring(0, loiGiaiIndex).trim();
            answerPart = fullContent.substring(loiGiaiIndex).trim();
        }
        
        // Escape HTML để tránh lỗi cấu trúc
        const escapedTitle = title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const escapedQuestion = questionPart.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const escapedAnswer = answerPart.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        html += `
            <div class="nghivan-card-container">
                <div class="nghivan-question-box">
                    <div class="nghivan-question-content">${escapedQuestion}</div>
                </div>
                <div class="nghivan-answer-box">
                    <div class="nghivan-answer-content">${escapedAnswer}</div>
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

function displayNghiVanError(error) {
    const contentDiv = document.getElementById('nghivan-content');
    
    contentDiv.innerHTML = `
        <div class="nghivan-error">
            <p>❌ Lỗi khi tải dữ liệu Nghi vấn</p>
            <p><strong>Chi tiết:</strong> ${error.message}</p>
            <p><strong>URL:</strong> https://admin.wikiw.vn/wp-json/custom/v1/nghivan-contents</p>
        </div>
    `;
}
</script>