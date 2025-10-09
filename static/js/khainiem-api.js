// Khai Niem Nguon API Handler
document.addEventListener('DOMContentLoaded', function() {
    loadKhaiNiemData();
});

function loadKhaiNiemData() {
    console.log('🔄 Loading Khái Niệm Nguồn data...');
    
    // Detect environment and choose appropriate API endpoint
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('localhost');
    
    const apiUrl = isLocalhost 
        ? '/.netlify/functions/khainiem-proxy'  // Use proxy for local development
        : 'https://admin.wikiw.vn/wp-json/custom/v1/khainiem-contents'; // Direct API for production
    
    console.log('📡 Using API: ' + apiUrl + ' (localhost: ' + isLocalhost + ')');
    const contentDiv = document.getElementById('khainiem-content');
    
    console.log('📡 Fetching from:', apiUrl);
    
    fetch(apiUrl)
        .then(response => {
            console.log('📥 Response received:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error('HTTP ' + response.status + ': ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Khái Niệm Nguồn data loaded:', data);
            console.log('🔍 Data structure:', JSON.stringify(data, null, 2));
            displayKhaiNiemContent(data);
        })
        .catch(error => {
            console.error('❌ Error loading Khái Niệm Nguồn data:', error);
            displayKhaiNiemError(error);
        });
}

function displayKhaiNiemContent(data) {
    const contentDiv = document.getElementById('khainiem-content');
    
    console.log('🔍 Checking data structure:', {
        hasData: !!data.data,
        hasContents: !!(data.data && data.data.contents),
        hasNodes: !!(data.data && data.data.contents && data.data.contents.nodes),
        fullStructure: data
    });
    
    // Kiểm tra nhiều cấu trúc dữ liệu có thể có
    let posts = null;
    
    if (data.data && data.data.contents && data.data.contents.nodes) {
        posts = data.data.contents.nodes;
        console.log('📊 Found posts in data.data.contents.nodes');
    } else if (data.contents && data.contents.nodes) {
        posts = data.contents.nodes;
        console.log('📊 Found posts in data.contents.nodes');
    } else if (Array.isArray(data.data)) {
        posts = data.data;
        console.log('📊 Found posts in data.data (array)');
    } else if (Array.isArray(data)) {
        posts = data;
        console.log('📊 Found posts in root data (array)');
    }
    
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
        contentDiv.innerHTML = 
            '<div class="khainiem-error">' +
                '<p>❌ Không có dữ liệu từ WordPress</p>' +
                '<p><strong>Cấu trúc dữ liệu nhận được:</strong></p>' +
                '<pre>' + JSON.stringify(data, null, 2) + '</pre>' +
            '</div>';
        return;
    }
    
    console.log('📊 Found ' + posts.length + ' Khái Niệm Nguồn posts from WordPress');
    
    let html = 
        '<div class="khainiem-posts">' +
            '<div class="khainiem-grid">';
    
    posts.forEach(function(post, index) {
        console.log('🔍 Processing post ' + index + ':', post);
        
        // Xử lý title
        let title = post.title || post.name || 'Không có tiêu đề';
        // Decode HTML entities
        title = title.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        
        // Xử lý link
        const link = post.link || post.permalink || post.url || '#';
        
        // Lấy text thuần từ content, bỏ HTML tags
        let content = 'Không có nội dung';
        if (post.content || post.excerpt || post.description) {
            const contentText = post.content || post.excerpt || post.description;
            // Tạo một div tạm để parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = contentText;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            content = textContent.trim().substring(0, 150) + (textContent.length > 150 ? '...' : '');
        }
        
        // Escape HTML để tránh lỗi cấu trúc
        const escapedTitle = title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const escapedContent = content.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const escapedLink = link.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        html += 
            '<div class="khainiem-card">' +
                '<h3 class="khainiem-title">' + escapedTitle + '</h3>' +
                '<div class="khainiem-excerpt">' + escapedContent + '</div>' +
                '<button onclick="openKhaiNiemLesson(\'' + escapedLink + '\', \'' + escapedTitle + '\')" class="khainiem-link">' +
                    '📖 Đọc thêm' +
                '</button>' +
            '</div>';
    });
    
    html += 
            '</div>' +
        '</div>';
    
    contentDiv.innerHTML = html;
}

function openKhaiNiemLesson(link, title) {
    console.log('🔗 Opening lesson:', link, title);
    
    const modal = document.createElement('div');
    modal.className = 'khainiem-modal';
    modal.innerHTML = 
        '<div class="khainiem-modal-content">' +
            '<div class="khainiem-iframe-header">' +
                '<h3 class="khainiem-modal-title">' + title + '</h3>' +
                '<button onclick="closeKhaiNiemIframe()" class="khainiem-close-btn">' +
                    '<span>×</span>' +
                '</button>' +
            '</div>' +
            '<div class="khainiem-iframe-container">' +
                '<iframe src="' + link + '" class="khainiem-iframe"></iframe>' +
            '</div>' +
        '</div>';
    
    document.body.appendChild(modal);
    
    // Hide WordPress header after iframe loads
    const iframe = modal.querySelector('.khainiem-iframe');
    iframe.addEventListener('load', function() {
        hideWordPressHeader(iframe);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeKhaiNiemIframe();
        }
    });
}

function closeKhaiNiemIframe() {
    const modal = document.querySelector('.khainiem-modal');
    if (modal) {
        modal.remove();
    }
}

function hideWordPressHeader(iframe) {
    console.log('🔍 Attempting to hide WordPress header...');
    
    const iframeBody = iframe.parentNode;
    iframeBody.style.position = 'relative';
    
    const overlay = document.createElement('div');
    overlay.className = 'wordpress-header-overlay';
    
    const isMobile = window.innerWidth <= 480;
    
    // Chỉ tạo overlay trên mobile để tránh đường line trắng trên desktop
    if (isMobile) {
        overlay.style.cssText = 
            'position: absolute;' +
            'top: 0;' +
            'left: 0;' +
            'right: 0;' +
            'height: 10px;' +
            'background: white;' +
            'z-index: 1000;' +
            'pointer-events: none;';
        iframeBody.appendChild(overlay);
    }
    
    iframe.style.transform = 'translateY(0px)';
    iframe.style.height = '100%';
    
    console.log('✅ WordPress header overlay created');
    
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const style = document.createElement('style');
        style.textContent = 
            '/* Ẩn header và navigation WordPress */' +
            '.gt-site-header,' +
            '.site-header,' +
            'header.header,' +
            '.navigation,' +
            '.main-navigation,' +
            '.site-navigation,' +
            '.primary-navigation,' +
            '.secondary-navigation {' +
                'display: none !important;' +
            '}' +
            
            '/* Thêm margin-top cho post header để đẩy nội dung xuống */' +
            '.gt-post-header {' +
                'margin-top: 20px !important;' +
            '}' +
            
            '/* Responsive margin-top cho post header */' +
            '@media (max-width: 768px) {' +
                '.gt-post-header {' +
                    'margin-top: 15px !important;' +
                '}' +
            '}' +
            
            '@media (max-width: 480px) {' +
                '.gt-post-header {' +
                    'margin-top: 29% !important;' +
                '}' +
            '}';
        
        iframeDoc.head.appendChild(style);
        iframeDoc.body.classList.add('khainiem-iframe-content');
        
        console.log('✅ CSS injected successfully into iframe');
        
    } catch (error) {
        console.log('⚠️ CORS restriction - using overlay method only');
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeKhaiNiemIframe();
    }
});

function displayKhaiNiemError(error) {
    const contentDiv = document.getElementById('khainiem-content');
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('localhost');
    const apiUrl = isLocalhost 
        ? '/.netlify/functions/khainiem-proxy'
        : 'https://admin.wikiw.vn/wp-json/custom/v1/khainiem-contents';
    
    contentDiv.innerHTML = 
        '<div class="khainiem-error">' +
            '<p>❌ Lỗi khi tải dữ liệu Khái Niệm Nguồn</p>' +
            '<p><strong>Chi tiết:</strong> ' + error.message + '</p>' +
            '<p><strong>Environment:</strong> ' + (isLocalhost ? 'Local Development' : 'Production') + '</p>' +
            '<p><strong>URL:</strong> ' + apiUrl + '</p>' +
        '</div>';
}
