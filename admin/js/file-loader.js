/**
 * File Loader - Load files from content directories
 * Loads files from HINH, KHAI-NIEM-NGUON, and TU-KHAINIEM directories
 */

class FileLoader {
    constructor() {
        this.hinhFiles = [];
        this.khaiNiemFiles = [];
        this.tuKhaiNiemFiles = [];
        this.init();
    }

    async init() {
        await this.loadAllFiles();
        this.populateSelects();
        this.setupSearch();
    }

    async loadAllFiles() {
        try {
            // Load files from all three sources
            await Promise.all([
                this.loadHinhFiles(),
                this.loadKhaiNiemFiles(),
                this.loadTuKhaiNiemFiles()
            ]);
        } catch (error) {
            console.error('Error loading files:', error);
            this.showError('Không thể tải danh sách files. Vui lòng thử lại.');
        }
    }

    async loadHinhFiles() {
        try {
            // Simulate API call - in real implementation, this would be an actual API
            const response = await fetch('/api/files/hinh');
            if (!response.ok) {
                throw new Error('Failed to load HINH files');
            }
            this.hinhFiles = await response.json();
        } catch (error) {
            // Fallback to mock data for development
            console.warn('Using mock data for HINH files:', error);
            this.hinhFiles = [
                {
                    id: '3-goc-nhin-cua-con-nguoi',
                    title: '3 GỐC NHÌN CỦA CON NGƯỜI',
                    description: 'Hình ảnh WNT36003 - 3 GỐC NHÌN CỦA CON NGƯỜI',
                    path: '/content/HINH/3-gốc-nhìn-của-con-người.md',
                    tags: ['hình-ảnh', 'đồ-họa', 'THẤU HIỂU NỘI TÂM - KIẾN TẠO AN VUI']
                },
                {
                    id: 'con-thuyen-suoi-dong',
                    title: 'CON THUYỀN SUỐI DÒNG',
                    description: 'Hình ảnh minh họa con thuyền suối dòng',
                    path: '/content/HINH/con-thuyền-suôi-dòng.md',
                    tags: ['hình-ảnh', 'minh-họa']
                },
                {
                    id: 'huong-thu-hoc-tap',
                    title: 'HƯỞNG THỤ HỌC TẬP',
                    description: 'Hình ảnh về hưởng thụ học tập',
                    path: '/content/HINH/hưởng-thụ-học-tập.md',
                    tags: ['hình-ảnh', 'học-tập']
                },
                {
                    id: 'lo-trinh-nang-tam-nhan-thuc-noi-tam',
                    title: 'LỘ TRÌNH NÂNG TẦM NHẬN THỨC NỘI TÂM',
                    description: 'Hình ảnh lộ trình nâng tầm nhận thức nội tâm',
                    path: '/content/HINH/lộ-trình-nâng-tầm-nhận-thức-nội-tâm.md',
                    tags: ['hình-ảnh', 'lộ-trình', 'nhận-thức']
                },
                {
                    id: 'nguyen-ly-anh-sang',
                    title: 'NGUYÊN LÝ ÁNH SÁNG',
                    description: 'Hình ảnh nguyên lý ánh sáng',
                    path: '/content/HINH/nguyên-lý-ánh-sáng.md',
                    tags: ['hình-ảnh', 'nguyên-lý', 'ánh-sáng']
                },
                {
                    id: 'quy-luat-chuyen-hoa',
                    title: 'QUY LUẬT CHUYỂN HÓA',
                    description: 'Hình ảnh quy luật chuyển hóa',
                    path: '/content/HINH/quy-luật-chuyển-hóa.md',
                    tags: ['hình-ảnh', 'quy-luật', 'chuyển-hóa']
                }
            ];
        }
    }

    async loadKhaiNiemFiles() {
        try {
            const response = await fetch('/api/files/khai-niem-nguon');
            if (!response.ok) {
                throw new Error('Failed to load KHAI-NIEM-NGUON files');
            }
            this.khaiNiemFiles = await response.json();
        } catch (error) {
            // Fallback to mock data
            console.warn('Using mock data for KHAI-NIEM-NGUON files:', error);
            this.khaiNiemFiles = [
                {
                    id: 'chuyen-hoa',
                    title: '5. Chuyển Hoá',
                    description: 'Khái niệm NT0105 - 5. Chuyển Hoá',
                    path: '/content/KHAI-NIEM-NGUON/quy-luật/chuyển-hoá.md',
                    category: 'quy-luật',
                    tags: ['I. Quy luật', 'khái-niệm-nguồn']
                },
                {
                    id: 'anh-huong',
                    title: '1. Ảnh Hưởng',
                    description: 'Khái niệm NT0101 - 1. Ảnh Hưởng',
                    path: '/content/KHAI-NIEM-NGUON/quy-luật/ảnh-hưởng.md',
                    category: 'quy-luật',
                    tags: ['I. Quy luật', 'khái-niệm-nguồn']
                },
                {
                    id: 'gia-tri',
                    title: '3. Giá Trị',
                    description: 'Khái niệm NT0103 - 3. Giá Trị',
                    path: '/content/KHAI-NIEM-NGUON/quy-luật/giá-trị.md',
                    category: 'quy-luật',
                    tags: ['I. Quy luật', 'khái-niệm-nguồn']
                },
                {
                    id: 'anh-sang',
                    title: '1. Ánh Sáng',
                    description: 'Khái niệm NT0201 - 1. Ánh Sáng',
                    path: '/content/KHAI-NIEM-NGUON/nguyên-lý/ánh-sáng.md',
                    category: 'nguyên-lý',
                    tags: ['II. Nguyên lý', 'khái-niệm-nguồn']
                },
                {
                    id: 'kich-hoat-nao',
                    title: '2. Kích Hoạt Não',
                    description: 'Khái niệm NT0202 - 2. Kích Hoạt Não',
                    path: '/content/KHAI-NIEM-NGUON/nguyên-lý/kích-hoạt-não.md',
                    category: 'nguyên-lý',
                    tags: ['II. Nguyên lý', 'khái-niệm-nguồn']
                },
                {
                    id: '4-buoc-tu-van-huan-luyen',
                    title: '4 Bước Tư Vấn Huấn Luyện',
                    description: 'Khái niệm NT0301 - 4 Bước Tư Vấn Huấn Luyện',
                    path: '/content/KHAI-NIEM-NGUON/công-thức/4-bước-tư-vấn-huấn-luyện.md',
                    category: 'công-thức',
                    tags: ['III. Công thức', 'khái-niệm-nguồn']
                }
            ];
        }
    }

    async loadTuKhaiNiemFiles() {
        try {
            const response = await fetch('/api/files/tu-khainiem');
            if (!response.ok) {
                throw new Error('Failed to load TU-KHAINIEM files');
            }
            this.tuKhaiNiemFiles = await response.json();
        } catch (error) {
            // Fallback to mock data
            console.warn('Using mock data for TU-KHAINIEM files:', error);
            this.tuKhaiNiemFiles = [
                {
                    id: 'quy-luat-chuyen-hoa',
                    title: 'QUY LUẬT CHUYỂN HÓA',
                    description: 'Từ - khái niệm KNW-0016 - QUY LUẬT CHUYỂN HÓA',
                    path: '/content/TU-KHAINIEM/knn-nội-tâm/quy-luật-chuyển-hóa.md',
                    tags: ['KNN NỘI TÂM', 'từ-khái-niệm']
                },
                {
                    id: 'quy-luat-anh-huong',
                    title: 'QUY LUẬT ẢNH HƯỞNG',
                    description: 'Từ - khái niệm KNW-0011 - QUY LUẬT ẢNH HƯỞNG',
                    path: '/content/TU-KHAINIEM/knn-nội-tâm/quy-luật-ảnh-hưởng.md',
                    tags: ['KNN NỘI TÂM', 'từ-khái-niệm']
                },
                {
                    id: 'quy-luat-gia-tri',
                    title: 'QUY LUẬT GIÁ TRỊ',
                    description: 'Từ - khái niệm KNW-0013 - QUY LUẬT GIÁ TRỊ',
                    path: '/content/TU-KHAINIEM/knn-nội-tâm/quy-luật-giá-trị.md',
                    tags: ['KNN NỘI TÂM', 'từ-khái-niệm']
                },
                {
                    id: 'nguyen-ly-anh-sang',
                    title: 'NGUYÊN LÝ ÁNH SÁNG',
                    description: 'Từ - khái niệm KNW-0021 - NGUYÊN LÝ ÁNH SÁNG',
                    path: '/content/TU-KHAINIEM/knn-nội-tâm/nguyên-lý-ánh-sáng.md',
                    tags: ['KNN NỘI TÂM', 'từ-khái-niệm']
                },
                {
                    id: 'nang-luc-lang-nghe',
                    title: 'NĂNG LỰC LẮNG NGHE',
                    description: 'Từ - khái niệm KNW-0034 - NĂNG LỰC LẮNG NGHE',
                    path: '/content/TU-KHAINIEM/knn-nội-tâm/năng-lực-lắng-nghe.md',
                    tags: ['KNN NỘI TÂM', 'từ-khái-niệm']
                },
                {
                    id: 'nang-luc-noi-va-viet',
                    title: 'NĂNG LỰC NÓI VÀ VIẾT',
                    description: 'Từ - khái niệm KNW-0037 - NĂNG LỰC NÓI VÀ VIẾT',
                    path: '/content/TU-KHAINIEM/knn-nội-tâm/năng-lực-nói-và-viết.md',
                    tags: ['KNN NỘI TÂM', 'từ-khái-niệm']
                }
            ];
        }
    }

    populateSelects() {
        this.populateSelect('hinhSelect', this.hinhFiles);
        this.populateSelect('khaiNiemSelect', this.khaiNiemFiles);
        this.populateSelect('tuKhaiNiemSelect', this.tuKhaiNiemFiles);
    }

    populateSelect(selectId, files) {
        const select = document.getElementById(selectId);
        if (!select) return;

        // Clear existing options except the first one
        select.innerHTML = '<option value="">-- Chọn ' + this.getSelectLabel(selectId) + ' --</option>';

        files.forEach(file => {
            const option = document.createElement('option');
            option.value = file.id;
            option.textContent = file.title;
            option.dataset.path = file.path;
            option.dataset.description = file.description;
            option.dataset.tags = JSON.stringify(file.tags || []);
            select.appendChild(option);
        });
    }

    getSelectLabel(selectId) {
        const labels = {
            'hinhSelect': 'hình ảnh',
            'khaiNiemSelect': 'khái niệm',
            'tuKhaiNiemSelect': 'từ khái niệm'
        };
        return labels[selectId] || 'file';
    }

    setupSearch() {
        // Setup search for each category
        this.setupSearchForCategory('hinhSearch', 'hinhSelect', this.hinhFiles);
        this.setupSearchForCategory('khaiNiemSearch', 'khaiNiemSelect', this.khaiNiemFiles);
        this.setupSearchForCategory('tuKhaiNiemSearch', 'tuKhaiNiemSelect', this.tuKhaiNiemFiles);
    }

    setupSearchForCategory(searchId, selectId, files) {
        const searchInput = document.getElementById(searchId);
        const select = document.getElementById(selectId);

        if (!searchInput || !select) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredFiles = files.filter(file => 
                file.title.toLowerCase().includes(searchTerm) ||
                file.description.toLowerCase().includes(searchTerm) ||
                (file.tags && file.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );

            this.populateSelect(selectId, filteredFiles);
        });
    }

    getFileById(id, category) {
        let files;
        switch (category) {
            case 'hinh':
                files = this.hinhFiles;
                break;
            case 'khaiNiem':
                files = this.khaiNiemFiles;
                break;
            case 'tuKhaiNiem':
                files = this.tuKhaiNiemFiles;
                break;
            default:
                return null;
        }
        return files.find(file => file.id === id);
    }

    showError(message) {
        // Simple error display - in production, use a proper notification system
        alert('Lỗi: ' + message);
    }
}

// Initialize file loader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fileLoader = new FileLoader();
});
