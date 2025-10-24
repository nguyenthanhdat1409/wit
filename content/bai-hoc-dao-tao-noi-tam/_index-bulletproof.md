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
// Global variable to store lessons data
let allDaoTaoLessons = [];

document.addEventListener('DOMContentLoaded', function() {
    // Check if URL has lesson parameter
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id'); // Primary: WordPress ID
    const lessonSlug = urlParams.get('lesson'); // Secondary: slug for SEO
    
    if (lessonId || lessonSlug) {
        console.log('📖 Loading specific lesson:', { id: lessonId, slug: lessonSlug });
        loadSpecificDaoTaoLesson(lessonId, lessonSlug);
    } else {
        console.log('📚 Loading lesson list');
        loadDaoTaoData();
    }
});

// Decode ALL HTML entities (comprehensive)
function decodeAllHtmlEntitiesDaoTao(text) {
    if (!text) return '';
    
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    let decoded = textarea.value;
    
    // Additional manual replacements for common entities
    const entities = {
        '&#8211;': '–',   // en dash
        '&#8212;': '—',   // em dash
        '&#8216;': '\u2018',   // left single quote
        '&#8217;': '\u2019',   // right single quote
        '&#8220;': '\u201C',   // left double quote
        '&#8221;': '\u201D',   // right double quote
        '&#8230;': '…',   // ellipsis
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&nbsp;': ' ',
        '&#038;': '&',
        '&#x2013;': '–',
        '&#x2014;': '—',
        '&hellip;': '…',
        '&mdash;': '—',
        '&ndash;': '–',
        '&lsquo;': '\u2018',
        '&rsquo;': '\u2019',
        '&ldquo;': '\u201C',
        '&rdquo;': '\u201D'
    };
    
    for (const [entity, char] of Object.entries(entities)) {
        decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }
    
    return decoded;
}

// Generate slug from title
function generateSlugDaoTao(title) {
    // Decode HTML entities first
    const decodedTitle = decodeAllHtmlEntitiesDaoTao(title);
    
    return decodedTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

function loadDaoTaoData() {
    console.log('🔄 Loading Đào tạo nội tâm data...');
    const apiUrl = 'https://admin.wikiw.vn/wp-json/custom/v1/daotao-contents';
    const contentDiv = document.getElementById('daotao-content');
    
    console.log('📡 Fetching from:', apiUrl);
    
    // Load data with cache
    if (typeof window.CacheManager !== 'undefined') {
        console.log('📦 Using Cache Manager for Đào tạo nội tâm');
        
        window.CacheManager.fetchWithCache(apiUrl)
            .then(result => {
                const data = result.data;
                if (result.fromCache) {
                    console.log('⚡ Đào tạo nội tâm loaded from CACHE (fast!)');
                } else {
                    console.log('🌐 Đào tạo nội tâm loaded from SERVER (cached for 30 days)');
                }
                console.log('✅ Đào tạo nội tâm data loaded:', data);
                displayDaoTaoContent(data);
            })
            .catch(error => {
                console.error('❌ Error loading Đào tạo nội tâm data:', error);
                displayDaoTaoError(error);
            });
    } else {
        // Fallback without cache
        console.log('⚠️ Cache Manager not available, using regular fetch');
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                displayDaoTaoContent(data);
            })
            .catch(error => {
                displayDaoTaoError(error);
            });
    }
}

function displayDaoTaoContent(data) {
    const contentDiv = document.getElementById('daotao-content');
    
    if (!data.data || !data.data.contents || !data.data.contents.nodes) {
        contentDiv.innerHTML = '<p>❌ Không có dữ liệu từ WordPress</p>';
        return;
    }
    
    let posts = data.data.contents.nodes;
    
    // Store data globally for later use
    allDaoTaoLessons = posts;
    
    console.log(`📊 Found ${posts.length} Đào tạo nội tâm posts from WordPress`);
    
    // Sort posts by lesson number
    posts = posts.sort((a, b) => {
        const getLessonNumber = (title) => {
            const match = title.match(/(?:Chủ đề|Bài|Bài học)\s*(\d+)/i);
            return match ? parseInt(match[1]) : 999;
        };
        
        const numA = getLessonNumber(a.title || '');
        const numB = getLessonNumber(b.title || '');
        
        return numA - numB;
    });
    
    console.log('📚 Sorted lessons:', posts.map(p => p.title));
    
    let html = `
        <div class="daotao-posts">
            <div class="daotao-grid">
    `;
    
    posts.forEach((post, index) => {
        // Bỏ chữ "TVHL" khỏi title nếu có
        let title = post.title || 'Không có tiêu đề';
        title = decodeAllHtmlEntitiesDaoTao(title.replace(/TVHL\.?\s*/g, ''));
        
        const link = post.link || '#';
        const postId = post.id || index; // Sử dụng WordPress ID (unique)
        
        // Generate slug for SEO-friendly URL (fallback)
        const slug = generateSlugDaoTao(title);
        
        // URL với cả ID và slug (ID là primary, slug là cho SEO)
        const lessonUrl = `/bai-hoc-dao-tao-noi-tam/?id=${postId}&lesson=${slug}`;
        
        // Lấy text thuần từ content, bỏ HTML tags
        let content = 'Không có nội dung';
        if (post.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            content = textContent.trim().substring(0, 150) + (textContent.length > 150 ? '...' : '');
        }
        
        // Escape HTML để tránh lỗi cấu trúc
        const escapedTitle = title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const escapedContent = content.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        html += `
            <div class="daotao-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <h3 class="daotao-title" style="margin: 0; flex: 1;">${escapedTitle}</h3>
                    <span class="daotao-id" style="font-size: 0.7rem; color: #999; background: #f0f0f0; padding: 2px 6px; border-radius: 3px; margin-left: 8px; font-family: monospace; cursor: pointer;" title="WordPress ID: ${postId} (Click to copy)" onclick="copyDaoTaoLessonId(${postId}, event)">
                        #${postId}
                    </span>
                </div>
                <div class="daotao-excerpt">${escapedContent}</div>
                <a href="${lessonUrl}" class="daotao-link" style="display: inline-block; text-decoration: none; text-align: center;">
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

// Load specific lesson by ID or slug
function loadSpecificDaoTaoLesson(lessonId, lessonSlug) {
    console.log('🔍 Looking for lesson:', { id: lessonId, slug: lessonSlug });
    const apiUrl = 'https://admin.wikiw.vn/wp-json/custom/v1/daotao-contents';
    const contentDiv = document.getElementById('daotao-content');
    
    contentDiv.innerHTML = '<div class="loading"><p>🔄 Đang tải bài học...</p></div>';
    
    // Force fresh fetch if coming from URL (bypass cache for navigation)
    const shouldBypassCache = true;
    
    // Load data
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
            allDaoTaoLessons = posts;
            
            // Find lesson by ID first (most reliable), then by slug (fallback)
            let lesson = null;
            
            if (lessonId) {
                // Primary: Find by WordPress ID (100% unique)
                lesson = posts.find(post => post.id && post.id.toString() === lessonId.toString());
                console.log('🔍 Search by ID:', lessonId, '→', lesson ? 'Found' : 'Not found');
            }
            
            if (!lesson && lessonSlug) {
                // Fallback: Find by slug (for backward compatibility or SEO URLs)
                lesson = posts.find(post => {
                    const title = post.title || '';
                    const cleanTitle = decodeAllHtmlEntitiesDaoTao(title.replace(/TVHL\.?\s*/g, ''));
                    const postSlug = generateSlugDaoTao(cleanTitle);
                    return postSlug === lessonSlug;
                });
                console.log('🔍 Search by slug:', lessonSlug, '→', lesson ? 'Found' : 'Not found');
            }
            
            if (lesson) {
                displaySpecificDaoTaoLesson(lesson);
            } else {
                displayDaoTaoLessonNotFound(lessonId || lessonSlug);
            }
        })
        .catch(error => {
            console.error('❌ Error loading lesson:', error);
            displayDaoTaoError(error);
        });
}

// Display specific lesson in iframe
function displaySpecificDaoTaoLesson(lesson) {
    const contentDiv = document.getElementById('daotao-content');
    const title = decodeAllHtmlEntitiesDaoTao(lesson.title.replace(/TVHL\.?\s*/g, ''));
    const url = lesson.link;
    const postId = lesson.id;
    
    // Update page title for SEO
    document.title = `${title} - Đào tạo nội tâm - Wikiw`;
    
    contentDiv.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <a href="/bai-hoc-dao-tao-noi-tam/" class="daotao-link" style="display: inline-block; text-decoration: none;">
                ← Quay lại danh sách
            </a>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
                <h2 style="margin: 0; color: #333; flex: 1;">${title}</h2>
                <span class="daotao-id" style="font-size: 0.75rem; color: #999; background: #f0f0f0; padding: 4px 10px; border-radius: 4px; margin-left: 1rem; font-family: monospace; cursor: pointer; white-space: nowrap;" title="WordPress ID: ${postId} (Click to copy)" onclick="copyDaoTaoLessonId(${postId}, event)">
                    ID: #${postId}
                </span>
            </div>
        </div>
        <div class="daotao-iframe-wrapper" style="position: relative; width: 100%; height: 80vh; min-height: 600px;">
            <iframe 
                src="${url}" 
                frameborder="0" 
                class="daotao-iframe" 
                style="width: 100%; height: 100%; border: 1px solid #ddd; border-radius: 8px;"
                onload="hideWordPressHeaderDaoTao(this)">
            </iframe>
        </div>
    `;
}

// Display lesson not found
function displayDaoTaoLessonNotFound(slug) {
    const contentDiv = document.getElementById('daotao-content');
    contentDiv.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <h2>❌ Không tìm thấy bài học</h2>
            <p>Bài học với slug "<strong>${slug}</strong>" không tồn tại.</p>
            <a href="/bai-hoc-dao-tao-noi-tam/" class="daotao-link" style="display: inline-block; text-decoration: none; margin-top: 1rem;">
                ← Quay lại danh sách
            </a>
        </div>
    `;
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
    
    console.log('✅ WordPress header overlay created for Đào tạo nội tâm');
    
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        const style = iframeDoc.createElement('style');
        style.textContent = `
            .gt-header, .gt-mobile-header, .site-header, .wp-site-blocks > header,
            header[class*="gt-"], header[role="banner"], .site-branding, .main-navigation,
            .wp-block-navigation, nav, .navigation { display: none !important; }
            body { margin-top: 0 !important; padding-top: 0 !important; }
            .gt-post-header { margin-top: 20px !important; }
            .gt-content-body { margin-top: 20px !important; }
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

document.addEventListener('click', function(event) {
    const modal = document.getElementById('daotao-iframe-modal');
    if (modal && event.target === modal) {
        closeDaoTaoIframe();
    }
});

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

// Copy lesson ID to clipboard
function copyDaoTaoLessonId(id, event) {
    event.preventDefault();
    event.stopPropagation();
    
    const text = id.toString();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showCopyNotificationDaoTao(event.target, 'Đã copy ID!');
            })
            .catch(() => {
                fallbackCopyTextToClipboardDaoTao(text, event.target);
            });
    } else {
        fallbackCopyTextToClipboardDaoTao(text, event.target);
    }
}

// Fallback copy method
function fallbackCopyTextToClipboardDaoTao(text, targetElement) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotificationDaoTao(targetElement, 'Đã copy ID!');
    } catch (err) {
        showCopyNotificationDaoTao(targetElement, 'Copy failed');
    }
    
    document.body.removeChild(textArea);
}

// Show copy notification
function showCopyNotificationDaoTao(element, message) {
    const originalText = element.textContent;
    element.textContent = message;
    element.style.backgroundColor = '#4CAF50';
    element.style.color = 'white';
    
    setTimeout(() => {
        element.textContent = originalText;
        element.style.backgroundColor = '#f0f0f0';
        element.style.color = '#999';
    }, 1500);
}
</script>

