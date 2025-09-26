// Main JavaScript for WikiW theme

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Search functionality - Only on bai-hoc pages
    const searchInput = document.querySelector('input[type="text"][placeholder="Tìm kiếm..."]');
    if (searchInput && window.location.pathname.includes('/bai-hoc/')) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                hideSearchResults();
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                hideSearchResults();
            }
        });
    }
    
    // Table of Contents smooth scrolling and highlighting - Only on bai-hoc pages
    if (window.location.pathname.includes('/bai-hoc/')) {
        const tocLinks = document.querySelectorAll('.prose a[href^="#"]');
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // TOC highlighting based on scroll position
        const tocContainer = document.querySelector('.toc-container');
        if (tocContainer) {
        const tocLinks = tocContainer.querySelectorAll('a[href^="#"]');
        const headings = Array.from(tocLinks).map(link => {
            const id = link.getAttribute('href').substring(1);
            return {
                id: id,
                element: document.getElementById(id),
                link: link
            };
        }).filter(item => item.element);
        
        function updateTOCHighlight() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Remove active class from all links
            tocLinks.forEach(link => link.classList.remove('active'));
            
            // Find the current heading
            let currentHeading = null;
            
            for (let i = headings.length - 1; i >= 0; i--) {
                const heading = headings[i];
                const rect = heading.element.getBoundingClientRect();
                
                if (rect.top <= 100) { // 100px offset from top
                    currentHeading = heading;
                    break;
                }
            }
            
            // If no heading is found and we're at the top, highlight the first one
            if (!currentHeading && scrollTop < 200) {
                currentHeading = headings[0];
            }
            
            // If no heading is found and we're at the bottom, highlight the last one
            if (!currentHeading && scrollTop + windowHeight >= documentHeight - 100) {
                currentHeading = headings[headings.length - 1];
            }
            
            if (currentHeading) {
                currentHeading.link.classList.add('active');
            }
        }
        
        // Update TOC on scroll
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateTOCHighlight);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
        window.addEventListener('resize', requestTick);
        
        // Initial update
        updateTOCHighlight();
        }
    }
    
    // Copy code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-code-btn absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 hover:opacity-100 transition-opacity';
        button.textContent = 'Copy';
        
        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(button);
        
        button.addEventListener('click', function() {
            navigator.clipboard.writeText(block.textContent).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        });
        
        pre.addEventListener('mouseenter', function() {
            button.classList.remove('opacity-0');
        });
        
        pre.addEventListener('mouseleave', function() {
            button.classList.add('opacity-0');
        });
    });
    
    // Dark mode toggle (if implemented)
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
        
        // Load saved dark mode preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
    
    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('hidden');
            } else {
                backToTopButton.classList.add('hidden');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Reading progress bar
    const progressBar = document.querySelector('.reading-progress');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            const article = document.querySelector('article');
            if (article) {
                const articleHeight = article.offsetHeight;
                const windowHeight = window.innerHeight;
                const scrollTop = window.pageYOffset;
                const progress = (scrollTop / (articleHeight - windowHeight)) * 100;
                progressBar.style.width = Math.min(progress, 100) + '%';
            }
        });
    }
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Print functionality
    const printButton = document.querySelector('.print-button');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Share functionality
    const shareButton = document.querySelector('.share-button');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showNotification('Link đã được sao chép!');
                });
            }
        });
    }
});

// Search functions
function performSearch(query) {
    // This would typically make an API call to a search service
    // For now, we'll implement a simple client-side search
    const searchResults = searchContent(query);
    displaySearchResults(searchResults);
}

function searchContent(query) {
    // Simple client-side search implementation
    const articles = document.querySelectorAll('article h1, article h2, article h3, article p');
    const results = [];
    
    articles.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            results.push({
                title: element.textContent.substring(0, 100),
                url: window.location.pathname + '#' + element.id,
                excerpt: element.textContent.substring(0, 200)
            });
        }
    });
    
    return results.slice(0, 10); // Limit to 10 results
}

function displaySearchResults(results) {
    let searchContainer = document.querySelector('.search-container');
    if (!searchContainer) {
        searchContainer = document.createElement('div');
        searchContainer.className = 'search-container relative';
        const searchInput = document.querySelector('input[type="text"][placeholder="Tìm kiếm..."]');
        searchInput.parentNode.appendChild(searchContainer);
    }
    
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item text-gray-500">Không tìm thấy kết quả nào</div>';
    } else {
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="font-medium text-gray-900">${result.title}</div>
                <div class="text-sm text-gray-600">${result.excerpt}</div>
            `;
            resultItem.addEventListener('click', function() {
                window.location.href = result.url;
            });
            searchResults.appendChild(resultItem);
        });
    }
    
    searchContainer.innerHTML = '';
    searchContainer.appendChild(searchResults);
}

function hideSearchResults() {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.innerHTML = '';
    }
}

// Utility functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Smooth scrolling for anchor links
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Keyboard navigation - Only on bai-hoc pages
if (window.location.pathname.includes('/bai-hoc/')) {
    document.addEventListener('keydown', function(e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
            hideSearchResults();
        }
        
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="text"][placeholder="Tìm kiếm..."]');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}
