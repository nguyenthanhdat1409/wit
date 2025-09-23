/**
 * Lesson Generator - Generate lesson content from selected sources
 * Combines content from HINH, KHAI-NIEM-NGUON, and TU-KHAINIEM
 */

class LessonGenerator {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormHandlers();
        this.setupSlugGeneration();
    }

    setupFormHandlers() {
        const form = document.getElementById('lessonForm');
        const previewBtn = document.getElementById('previewBtn');
        const createBtn = document.getElementById('createBtn');

        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewLesson());
        }

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    setupSlugGeneration() {
        const titleInput = document.getElementById('lessonTitle');
        const slugInput = document.getElementById('lessonSlug');

        if (titleInput && slugInput) {
            titleInput.addEventListener('input', () => {
                const slug = this.generateSlug(titleInput.value);
                slugInput.value = slug;
            });
        }
    }

    generateSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim('-'); // Remove leading/trailing hyphens
    }

    async previewLesson() {
        const selectedFiles = this.getSelectedFiles();
        if (!selectedFiles.hinh || !selectedFiles.khaiNiem || !selectedFiles.tuKhaiNiem) {
            alert('Vui lòng chọn đầy đủ 3 nguồn nội dung.');
            return;
        }

        try {
            this.showLoading(true);
            const lessonContent = await this.generateLessonContent(selectedFiles);
            this.displayPreview(lessonContent);
        } catch (error) {
            console.error('Error generating preview:', error);
            alert('Có lỗi xảy ra khi tạo preview. Vui lòng thử lại.');
        } finally {
            this.showLoading(false);
        }
    }

    getSelectedFiles() {
        const hinhSelect = document.getElementById('hinhSelect');
        const khaiNiemSelect = document.getElementById('khaiNiemSelect');
        const tuKhaiNiemSelect = document.getElementById('tuKhaiNiemSelect');

        return {
            hinh: hinhSelect ? hinhSelect.value : null,
            khaiNiem: khaiNiemSelect ? khaiNiemSelect.value : null,
            tuKhaiNiem: tuKhaiNiemSelect ? tuKhaiNiemSelect.value : null
        };
    }

    async generateLessonContent(selectedFiles) {
        // Get file data
        const hinhFile = window.fileLoader.getFileById(selectedFiles.hinh, 'hinh');
        const khaiNiemFile = window.fileLoader.getFileById(selectedFiles.khaiNiem, 'khaiNiem');
        const tuKhaiNiemFile = window.fileLoader.getFileById(selectedFiles.tuKhaiNiem, 'tuKhaiNiem');

        if (!hinhFile || !khaiNiemFile || !tuKhaiNiemFile) {
            throw new Error('Không tìm thấy file được chọn');
        }

        // Load content from files (in real implementation, this would fetch actual content)
        const hinhContent = await this.loadFileContent(hinhFile.path);
        const khaiNiemContent = await this.loadFileContent(khaiNiemFile.path);
        const tuKhaiNiemContent = await this.loadFileContent(tuKhaiNiemFile.path);

        // Generate lesson
        const title = document.getElementById('lessonTitle').value || 'Bài học mới';
        const slug = document.getElementById('lessonSlug').value || this.generateSlug(title);

        return {
            title,
            slug,
            hinh: {
                ...hinhFile,
                content: hinhContent
            },
            khaiNiem: {
                ...khaiNiemFile,
                content: khaiNiemContent
            },
            tuKhaiNiem: {
                ...tuKhaiNiemFile,
                content: tuKhaiNiemContent
            }
        };
    }

    async loadFileContent(filePath) {
        try {
            // In real implementation, this would fetch actual file content
            // For now, return mock content based on file type
            if (filePath.includes('/HINH/')) {
                return this.getMockHinhContent();
            } else if (filePath.includes('/KHAI-NIEM-NGUON/')) {
                return this.getMockKhaiNiemContent();
            } else if (filePath.includes('/TU-KHAINIEM/')) {
                return this.getMockTuKhaiNiemContent();
            }
            return 'Nội dung sẽ được tải...';
        } catch (error) {
            console.error('Error loading file content:', error);
            return 'Không thể tải nội dung file.';
        }
    }

    getMockHinhContent() {
        return `## Hình ảnh minh họa

**Mã hình:** WNT36003  
**Khóa học:** THẤU HIỂU NỘI TÂM - KIẾN TẠO AN VUI

### Tổng quan
Hình ảnh minh họa về 3 gốc nhìn của con người, giúp hiểu rõ các góc độ khác nhau trong cách nhìn nhận và đánh giá sự việc.

### Mô tả
Hình ảnh thể hiện 3 góc nhìn cơ bản:
- Góc nhìn từ bên ngoài
- Góc nhìn từ bên trong  
- Góc nhìn tổng thể

### Ứng dụng
Sử dụng trong các buổi học về nhận thức và tư duy, giúp học viên mở rộng góc nhìn và hiểu sâu hơn về bản thân.`;
    }

    getMockKhaiNiemContent() {
        return `## Khái niệm nguồn

**Mã khái niệm:** NT0105  
**Nhóm:** I. Quy luật

### Tổng quan
Chuyển hóa là quy luật cơ bản trong phát triển nội tâm, thể hiện sự thay đổi từ trạng thái này sang trạng thái khác một cách tích cực và có ý nghĩa.

### Nội dung chính
- **Định nghĩa**: Chuyển hóa là quá trình thay đổi từ bên trong, từ nhận thức đến hành động
- **Đặc điểm**: Có tính bền vững, sâu sắc và toàn diện
- **Điều kiện**: Cần có ý thức, quyết tâm và phương pháp phù hợp

### Ứng dụng thực tế
- Trong tư vấn: Giúp khách hàng nhận ra và thực hiện sự thay đổi
- Trong huấn luyện: Hướng dẫn học viên phát triển bản thân
- Trong cuộc sống: Áp dụng để cải thiện các mối quan hệ và công việc`;
    }

    getMockTuKhaiNiemContent() {
        return `## Từ - Khái niệm

**Mã:** KNW-0016  
**Nhóm:** KNN NỘI TÂM

### Định nghĩa
Quy luật chuyển hóa là nguyên lý cơ bản chi phối mọi sự thay đổi tích cực trong con người, từ nhận thức đến hành động, từ cá nhân đến cộng đồng.

### Nội dung chi tiết
- **Bản chất**: Là quy luật tự nhiên, không thể tránh khỏi khi có đủ điều kiện
- **Cơ chế**: Hoạt động thông qua sự tương tác giữa nhận thức, cảm xúc và hành động
- **Kết quả**: Tạo ra sự thay đổi bền vững và có ý nghĩa

### Ví dụ minh họa
- Một người từ thái độ tiêu cực chuyển sang tích cực
- Từ thói quen xấu chuyển sang thói quen tốt
- Từ mối quan hệ căng thẳng chuyển sang hòa hợp

### Ứng dụng
- Làm nền tảng cho các phương pháp tư vấn và huấn luyện
- Hướng dẫn quá trình phát triển cá nhân
- Tạo động lực cho sự thay đổi tích cực`;
    }

    displayPreview(lessonContent) {
        const previewContent = document.getElementById('previewContent');
        if (!previewContent) return;

        const markdown = this.generateMarkdown(lessonContent);
        previewContent.innerHTML = this.markdownToHtml(markdown);
    }

    generateMarkdown(lessonContent) {
        const { title, hinh, khaiNiem, tuKhaiNiem } = lessonContent;
        
        return `# ${title}

## Hình ảnh minh họa

${hinh.content}

---

## Khái niệm nguồn

${khaiNiem.content}

---

## Từ - Khái niệm

${tuKhaiNiem.content}

---

## Tổng kết

Bài học này kết hợp 3 nguồn kiến thức quan trọng:
- **Hình ảnh**: ${hinh.title} - ${hinh.description}
- **Khái niệm nguồn**: ${khaiNiem.title} - ${khaiNiem.description}  
- **Từ khái niệm**: ${tuKhaiNiem.title} - ${tuKhaiNiem.description}

Tạo thành một bài học hoàn chỉnh về ${title.toLowerCase()}, giúp người học có cái nhìn toàn diện và sâu sắc về chủ đề này.`;
    }

    markdownToHtml(markdown) {
        // Simple markdown to HTML converter
        return markdown
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-800 mb-3 mt-6">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-gray-700 mb-2 mt-4">$1</h3>')
            .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/\n\n/g, '</p><p class="mb-4">')
            .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
            .replace(/<li class="ml-4">/g, '<ul class="list-disc list-inside mb-4"><li class="ml-4">')
            .replace(/<\/li>\n(?!<li)/g, '</li></ul>')
            .replace(/<p class="mb-4"><\/p>/g, '');
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const selectedFiles = this.getSelectedFiles();
        if (!selectedFiles.hinh || !selectedFiles.khaiNiem || !selectedFiles.tuKhaiNiem) {
            alert('Vui lòng chọn đầy đủ 3 nguồn nội dung.');
            return;
        }

        const title = document.getElementById('lessonTitle').value;
        if (!title.trim()) {
            alert('Vui lòng nhập tên bài học.');
            return;
        }

        try {
            this.showLoading(true);
            const lessonContent = await this.generateLessonContent(selectedFiles);
            const result = await this.saveLesson(lessonContent);
            this.showSuccessModal(lessonContent, result);
        } catch (error) {
            console.error('Error creating lesson:', error);
            alert('Có lỗi xảy ra khi tạo bài học: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async saveLesson(lessonContent) {
        try {
            console.log('Creating lesson with real API...');
            
            const response = await fetch('http://localhost:3001/api/create-lesson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: lessonContent.title,
                    description: `Bài học được tạo từ 3 nguồn: ${lessonContent.hinh.title}, ${lessonContent.khaiNiem.title}, ${lessonContent.tuKhaiNiem.title}`,
                    sources: {
                        hinh: {
                            id: lessonContent.hinh.id,
                            title: lessonContent.hinh.title,
                            content: lessonContent.hinh.content
                        },
                        khaiNiem: {
                            id: lessonContent.khaiNiem.id,
                            title: lessonContent.khaiNiem.title,
                            content: lessonContent.khaiNiem.content
                        },
                        tuKhaiNiem: {
                            id: lessonContent.tuKhaiNiem.id,
                            title: lessonContent.tuKhaiNiem.title,
                            content: lessonContent.tuKhaiNiem.content
                        }
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create lesson');
            }

            const result = await response.json();
            console.log('Lesson created successfully:', result);
            return result;
        } catch (error) {
            console.error('Error saving lesson:', error);
            throw error;
        }
    }

    createMockLesson(lessonContent) {
        // Generate slug
        const slug = this.generateSlug(lessonContent.title);
        
        // Create mock lesson data
        const mockLesson = {
            title: lessonContent.title,
            description: `Bài học được tạo từ 3 nguồn: ${lessonContent.hinh.title}, ${lessonContent.khaiNiem.title}, ${lessonContent.tuKhaiNiem.title}`,
            sources: {
                hinh: {
                    id: lessonContent.hinh.id,
                    title: lessonContent.hinh.title,
                    content: lessonContent.hinh.content
                },
                khaiNiem: {
                    id: lessonContent.khaiNiem.id,
                    title: lessonContent.khaiNiem.title,
                    content: lessonContent.khaiNiem.content
                },
                tuKhaiNiem: {
                    id: lessonContent.tuKhaiNiem.id,
                    title: lessonContent.tuKhaiNiem.title,
                    content: lessonContent.tuKhaiNiem.content
                }
            }
        };

        // Generate markdown content
        const markdownContent = this.generateMarkdown(mockLesson);
        
        // Create downloadable file
        this.downloadLessonFile(slug, markdownContent);
        
        return {
            success: true,
            slug: slug,
            url: `/bai-hoc/${slug}/`,
            message: 'Bài học đã được tạo thành công! (Local Development)',
            mock: true,
            content: markdownContent
        };
    }

    downloadLessonFile(slug, content) {
        // Create a downloadable file for local development
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`Lesson file downloaded: ${slug}.md`);
    }

    showSuccessModal(lessonContent, result) {
        const modal = document.getElementById('successModal');
        const viewBtn = document.getElementById('viewLessonBtn');
        
        if (modal) {
            modal.classList.remove('hidden');
            
            // Update modal content
            const modalTitle = modal.querySelector('h3');
            const modalMessage = modal.querySelector('p');
            
            if (modalTitle) {
                modalTitle.textContent = 'Tạo bài học thành công!';
            }
            
            if (modalMessage) {
                modalMessage.innerHTML = `
                    Bài học đã được tạo và lưu vào hệ thống.<br>
                    <strong>Slug:</strong> ${result.slug}<br>
                    <strong>URL:</strong> ${result.url}
                `;
            }
            
            if (viewBtn) {
                viewBtn.textContent = 'Xem bài học';
                viewBtn.onclick = () => {
                    // Redirect to the actual lesson page
                    window.open(result.url, '_blank');
                };
            }
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const createBtn = document.getElementById('createBtn');
        const previewBtn = document.getElementById('previewBtn');

        if (loading) {
            loading.classList.toggle('show', show);
        }
        
        if (createBtn) {
            createBtn.disabled = show;
        }
        
        if (previewBtn) {
            previewBtn.disabled = show;
        }
    }
}

// Initialize lesson generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lessonGenerator = new LessonGenerator();
});

// Close modal handlers
document.addEventListener('DOMContentLoaded', () => {
    const closeModalBtn = document.getElementById('closeModalBtn');
    const successModal = document.getElementById('successModal');
    
    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.add('hidden');
        });
    }
    
    // Close modal when clicking outside
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.add('hidden');
            }
        });
    }
});
