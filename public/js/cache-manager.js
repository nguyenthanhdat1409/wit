/**
 * Browser Cache Manager for WordPress API Calls
 * Vòng đời cache: 30 ngày
 * Tự động clear cache khi data thay đổi
 */

const CacheManager = {
    // Cấu hình cache
    config: {
        CACHE_VERSION: '1.0.0',
        CACHE_PREFIX: 'wikiw_cache_',
        CACHE_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 ngày tính bằng milliseconds
        ENABLE_CACHE: true, // Bật/tắt cache
        USE_ETAG: true // Sử dụng ETag để detect thay đổi
    },

    /**
     * Tạo cache key từ URL
     */
    getCacheKey(url) {
        return this.config.CACHE_PREFIX + btoa(url);
    },

    /**
     * Lấy cache metadata key
     */
    getMetaKey(cacheKey) {
        return cacheKey + '_meta';
    },

    /**
     * Kiểm tra cache còn hợp lệ không
     */
    isCacheValid(metadata) {
        if (!metadata || !metadata.timestamp) {
            return false;
        }

        const now = Date.now();
        const age = now - metadata.timestamp;
        
        // Kiểm tra cache version
        if (metadata.version !== this.config.CACHE_VERSION) {
            console.log('🔄 Cache version mismatch, invalidating...');
            return false;
        }

        // Kiểm tra thời gian
        if (age > this.config.CACHE_DURATION) {
            console.log('⏰ Cache expired (age: ' + Math.floor(age / (24 * 60 * 60 * 1000)) + ' days)');
            return false;
        }

        return true;
    },

    /**
     * Lấy dữ liệu từ cache
     */
    async getFromCache(url) {
        if (!this.config.ENABLE_CACHE) {
            return null;
        }

        const cacheKey = this.getCacheKey(url);
        const metaKey = this.getMetaKey(cacheKey);

        try {
            // Lấy metadata
            const metadataStr = localStorage.getItem(metaKey);
            if (!metadataStr) {
                return null;
            }

            const metadata = JSON.parse(metadataStr);
            
            // Kiểm tra cache còn hợp lệ không
            if (!this.isCacheValid(metadata)) {
                this.clearCache(url);
                return null;
            }

            // Lấy dữ liệu
            const cachedDataStr = localStorage.getItem(cacheKey);
            if (!cachedDataStr) {
                return null;
            }

            const cachedData = JSON.parse(cachedDataStr);
            
            console.log('✅ Cache HIT for:', url);
            console.log('📊 Cache age:', Math.floor((Date.now() - metadata.timestamp) / (60 * 60 * 1000)), 'hours');
            
            return {
                data: cachedData,
                metadata: metadata,
                fromCache: true
            };

        } catch (error) {
            console.error('❌ Error reading cache:', error);
            this.clearCache(url);
            return null;
        }
    },

    /**
     * Lưu dữ liệu vào cache
     */
    async saveToCache(url, data, etag = null) {
        if (!this.config.ENABLE_CACHE) {
            return;
        }

        const cacheKey = this.getCacheKey(url);
        const metaKey = this.getMetaKey(cacheKey);

        try {
            // Tạo metadata
            const metadata = {
                url: url,
                timestamp: Date.now(),
                version: this.config.CACHE_VERSION,
                etag: etag,
                size: JSON.stringify(data).length
            };

            // Lưu dữ liệu và metadata
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(metaKey, JSON.stringify(metadata));

            console.log('💾 Saved to cache:', url);
            console.log('📦 Cache size:', (metadata.size / 1024).toFixed(2), 'KB');

        } catch (error) {
            console.error('❌ Error saving cache:', error);
            
            // Nếu lỗi do localStorage đầy, xóa cache cũ
            if (error.name === 'QuotaExceededError') {
                console.log('🧹 Storage full, cleaning old cache...');
                this.cleanOldCache();
                
                // Thử lưu lại
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                    localStorage.setItem(metaKey, JSON.stringify(metadata));
                } catch (retryError) {
                    console.error('❌ Still failed after cleanup:', retryError);
                }
            }
        }
    },

    /**
     * Xóa cache cho một URL
     */
    clearCache(url) {
        const cacheKey = this.getCacheKey(url);
        const metaKey = this.getMetaKey(cacheKey);

        localStorage.removeItem(cacheKey);
        localStorage.removeItem(metaKey);

        console.log('🗑️ Cleared cache for:', url);
    },

    /**
     * Xóa tất cả cache
     */
    clearAllCache() {
        const keys = Object.keys(localStorage);
        let count = 0;

        keys.forEach(key => {
            if (key.startsWith(this.config.CACHE_PREFIX)) {
                localStorage.removeItem(key);
                count++;
            }
        });

        console.log('🗑️ Cleared all cache (' + count + ' items)');
        return count;
    },

    /**
     * Xóa cache cũ (hơn 30 ngày)
     */
    cleanOldCache() {
        const keys = Object.keys(localStorage);
        let cleanedCount = 0;

        keys.forEach(key => {
            if (key.startsWith(this.config.CACHE_PREFIX) && key.endsWith('_meta')) {
                try {
                    const metadataStr = localStorage.getItem(key);
                    if (metadataStr) {
                        const metadata = JSON.parse(metadataStr);
                        if (!this.isCacheValid(metadata)) {
                            const cacheKey = key.replace('_meta', '');
                            localStorage.removeItem(cacheKey);
                            localStorage.removeItem(key);
                            cleanedCount++;
                        }
                    }
                } catch (error) {
                    console.error('Error cleaning cache:', error);
                }
            }
        });

        console.log('🧹 Cleaned ' + cleanedCount + ' old cache items');
        return cleanedCount;
    },

    /**
     * Fetch với cache (hàm chính)
     */
    async fetchWithCache(url, options = {}) {
        // Kiểm tra cache trước
        const cached = await this.getFromCache(url);
        
        if (cached && !options.forceRefresh) {
            // Nếu có ETag, kiểm tra với server xem có thay đổi không
            if (this.config.USE_ETAG && cached.metadata.etag) {
                const hasChanged = await this.checkIfModified(url, cached.metadata.etag, options);
                if (!hasChanged) {
                    console.log('✅ Data not modified, using cache');
                    return {
                        data: cached.data,
                        fromCache: true,
                        status: 304 // Not Modified
                    };
                } else {
                    console.log('🔄 Data modified, fetching new data...');
                    this.clearCache(url);
                }
            } else {
                // Không có ETag, dùng cache luôn
                return {
                    data: cached.data,
                    fromCache: true,
                    status: 200
                };
            }
        }

        // Fetch dữ liệu mới từ server
        console.log('🌐 Fetching from server:', url);
        const startTime = Date.now();

        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error('HTTP ' + response.status + ': ' + response.statusText);
            }

            const data = await response.json();
            const etag = response.headers.get('ETag') || response.headers.get('Last-Modified');
            
            // Lưu vào cache
            await this.saveToCache(url, data, etag);

            const duration = Date.now() - startTime;
            console.log('✅ Fetched in ' + duration + 'ms');

            return {
                data: data,
                fromCache: false,
                status: response.status
            };

        } catch (error) {
            console.error('❌ Fetch error:', error);
            
            // Nếu lỗi mạng, thử dùng cache cũ (stale cache)
            if (cached) {
                console.log('⚠️ Using stale cache due to network error');
                return {
                    data: cached.data,
                    fromCache: true,
                    stale: true,
                    status: 0
                };
            }
            
            throw error;
        }
    },

    /**
     * Kiểm tra xem dữ liệu có thay đổi không (dùng ETag)
     */
    async checkIfModified(url, etag, options = {}) {
        try {
            const headers = {
                ...options.headers,
                'If-None-Match': etag
            };

            const response = await fetch(url, {
                ...options,
                method: 'HEAD', // Chỉ lấy headers, không lấy body
                headers: headers
            });

            // 304 = Not Modified
            return response.status !== 304;

        } catch (error) {
            console.error('Error checking if modified:', error);
            // Nếu lỗi, coi như đã thay đổi
            return true;
        }
    },

    /**
     * Lấy thông tin cache statistics
     */
    getCacheStats() {
        const keys = Object.keys(localStorage);
        let cacheCount = 0;
        let totalSize = 0;
        const items = [];

        keys.forEach(key => {
            if (key.startsWith(this.config.CACHE_PREFIX) && !key.endsWith('_meta')) {
                cacheCount++;
                const data = localStorage.getItem(key);
                const metaKey = this.getMetaKey(key);
                const metaStr = localStorage.getItem(metaKey);
                
                if (data && metaStr) {
                    const size = data.length;
                    totalSize += size;
                    
                    try {
                        const metadata = JSON.parse(metaStr);
                        items.push({
                            url: metadata.url,
                            age: Date.now() - metadata.timestamp,
                            size: size,
                            etag: metadata.etag
                        });
                    } catch (e) {
                        // ignore
                    }
                }
            }
        });

        return {
            count: cacheCount,
            totalSize: totalSize,
            totalSizeKB: (totalSize / 1024).toFixed(2),
            items: items,
            version: this.config.CACHE_VERSION,
            duration: this.config.CACHE_DURATION / (24 * 60 * 60 * 1000) + ' days'
        };
    },

    /**
     * In ra cache stats
     */
    printCacheStats() {
        const stats = this.getCacheStats();
        console.log('📊 ===== CACHE STATISTICS =====');
        console.log('📦 Total cached items:', stats.count);
        console.log('💾 Total size:', stats.totalSizeKB, 'KB');
        console.log('🔢 Cache version:', stats.version);
        console.log('⏰ Cache duration:', stats.duration);
        console.log('📋 Items:', stats.items);
        console.log('================================');
        return stats;
    }
};

// Export cho global scope
window.CacheManager = CacheManager;

// Auto clean old cache khi load page
document.addEventListener('DOMContentLoaded', function() {
    // Clean sau 2 giây để không block UI
    setTimeout(() => {
        CacheManager.cleanOldCache();
    }, 2000);
});

console.log('✅ Cache Manager loaded (v' + CacheManager.config.CACHE_VERSION + ')');

