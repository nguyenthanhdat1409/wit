/**
 * Preview functionality for lesson creation
 * Handles real-time preview updates and content validation
 */

class PreviewManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupRealTimePreview();
        this.setupContentValidation();
    }

    setupRealTimePreview() {
        // Update preview when any selection changes
        const selects = ['hinhSelect', 'khaiNiemSelect', 'tuKhaiNiemSelect'];
        const titleInput = document.getElementById('lessonTitle');

        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.addEventListener('change', () => this.updatePreviewStatus());
            }
        });

        if (titleInput) {
            titleInput.addEventListener('input', () => this.updatePreviewStatus());
        }
    }

    setupContentValidation() {
        // Validate form before enabling create button
        const form = document.getElementById('lessonForm');
        if (form) {
            form.addEventListener('input', () => this.validateForm());
            form.addEventListener('change', () => this.validateForm());
        }
        
        // Also validate on page load
        setTimeout(() => this.validateForm(), 100);
    }

    updatePreviewStatus() {
        const selectedFiles = this.getSelectedFiles();
        const title = document.getElementById('lessonTitle')?.value;
        
        const previewContent = document.getElementById('previewContent');
        if (!previewContent) return;

        if (!selectedFiles.hinh || !selectedFiles.khaiNiem || !selectedFiles.tuKhaiNiem || !title) {
            previewContent.innerHTML = `
                <div class="text-center py-8">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </div>
                    <p class="text-gray-500 italic">Chọn đầy đủ 3 nguồn nội dung và nhập tên bài học để xem preview...</p>
                    <div class="mt-4 text-sm text-gray-400">
                        <p>✓ Tên bài học: ${title ? 'Đã nhập' : 'Chưa nhập'}</p>
                        <p>✓ Hình ảnh: ${selectedFiles.hinh ? 'Đã chọn' : 'Chưa chọn'}</p>
                        <p>✓ Khái niệm nguồn: ${selectedFiles.khaiNiem ? 'Đã chọn' : 'Chưa chọn'}</p>
                        <p>✓ Từ khái niệm: ${selectedFiles.tuKhaiNiem ? 'Đã chọn' : 'Chưa chọn'}</p>
                    </div>
                </div>
            `;
        } else {
            previewContent.innerHTML = `
                <div class="text-center py-8">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <p class="text-green-600 font-medium">Sẵn sàng tạo bài học!</p>
                    <p class="text-sm text-gray-500 mt-2">Click "Preview" để xem nội dung hoặc "Tạo Bài Học" để lưu.</p>
                </div>
            `;
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

    validateForm() {
        const selectedFiles = this.getSelectedFiles();
        const title = document.getElementById('lessonTitle')?.value;
        const createBtn = document.getElementById('createBtn');
        const previewBtn = document.getElementById('previewBtn');
        const formStatus = document.getElementById('formStatus');

        const isValid = title && selectedFiles.hinh && selectedFiles.khaiNiem && selectedFiles.tuKhaiNiem;

        // Debug logging
        console.log('Form validation:', {
            title: title,
            hinh: selectedFiles.hinh,
            khaiNiem: selectedFiles.khaiNiem,
            tuKhaiNiem: selectedFiles.tuKhaiNiem,
            isValid: isValid
        });

        if (createBtn) {
            createBtn.disabled = !isValid;
            this.setupButtonTooltip(createBtn, !isValid);
            console.log('Create button disabled:', createBtn.disabled);
            console.log('Create button classes:', createBtn.className);
            
            // Force update button appearance
            if (isValid) {
                createBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                createBtn.classList.add('cursor-pointer');
            } else {
                createBtn.classList.add('opacity-50', 'cursor-not-allowed');
                createBtn.classList.remove('cursor-pointer');
            }
        }
        
        if (previewBtn) {
            previewBtn.disabled = !isValid;
        }

        // Update form status
        this.updateFormStatus(title, selectedFiles, formStatus);

        return isValid;
    }

    setupButtonTooltip(button, showTooltip) {
        const tooltip = document.getElementById('createBtnTooltip');
        if (!tooltip) return;

        if (showTooltip) {
            button.addEventListener('mouseenter', () => {
                tooltip.classList.remove('opacity-0');
                tooltip.classList.add('opacity-100');
            });
            
            button.addEventListener('mouseleave', () => {
                tooltip.classList.remove('opacity-100');
                tooltip.classList.add('opacity-0');
            });
        }
    }

    updateFormStatus(title, selectedFiles, formStatus) {
        if (!formStatus) return;

        // Update individual status indicators
        this.updateStatusIndicator('titleStatus', title, 'Nhập tên bài học');
        this.updateStatusIndicator('hinhStatus', selectedFiles.hinh, 'Chọn hình ảnh');
        this.updateStatusIndicator('khaiNiemStatus', selectedFiles.khaiNiem, 'Chọn khái niệm nguồn');
        this.updateStatusIndicator('tuKhaiNiemStatus', selectedFiles.tuKhaiNiem, 'Chọn từ khái niệm');

        // Update overall form status
        const allComplete = title && selectedFiles.hinh && selectedFiles.khaiNiem && selectedFiles.tuKhaiNiem;
        
        if (allComplete) {
            formStatus.className = 'text-center mt-4 p-4 bg-green-50 border border-green-200 rounded-lg';
            formStatus.innerHTML = `
                <div class="flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="text-green-800 font-medium">Hoàn thành! Bạn có thể tạo bài học ngay bây giờ.</span>
                </div>
            `;
        } else {
            formStatus.className = 'text-center mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg';
            formStatus.innerHTML = `
                <div class="flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                    <span class="text-amber-900 font-medium">Để tạo bài học, vui lòng:</span>
                </div>
                <div class="mt-2 text-sm text-amber-800">
                    <span id="titleStatus" class="inline-block mr-4">• Nhập tên bài học</span>
                    <span id="hinhStatus" class="inline-block mr-4">• Chọn hình ảnh</span>
                    <span id="khaiNiemStatus" class="inline-block mr-4">• Chọn khái niệm nguồn</span>
                    <span id="tuKhaiNiemStatus" class="inline-block">• Chọn từ khái niệm</span>
                </div>
            `;
        }
    }

    updateStatusIndicator(elementId, isComplete, label) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const wasComplete = element.classList.contains('text-green-600');
        
        if (isComplete) {
            element.innerHTML = `✓ ${label}`;
            element.className = 'inline-block mr-4 text-green-600 font-medium';
            
            // Add animation if this is a new completion
            if (!wasComplete) {
                element.classList.add('status-complete');
                setTimeout(() => {
                    element.classList.remove('status-complete');
                }, 500);
            }
        } else {
            element.innerHTML = `• ${label}`;
            element.className = 'inline-block mr-4 text-amber-800';
        }
    }

    showPreviewError(message) {
        const previewContent = document.getElementById('previewContent');
        if (!previewContent) return;

        previewContent.innerHTML = `
            <div class="text-center py-8">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <p class="text-red-600 font-medium">Lỗi khi tạo preview</p>
                <p class="text-sm text-gray-500 mt-2">${message}</p>
            </div>
        `;
    }

    showPreviewLoading() {
        const previewContent = document.getElementById('previewContent');
        if (!previewContent) return;

        previewContent.innerHTML = `
            <div class="text-center py-8">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="animate-spin w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <p class="text-blue-600 font-medium">Đang tạo preview...</p>
                <p class="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
            </div>
        `;
    }

    highlightSelectedItems() {
        // Add visual feedback for selected items
        const selects = ['hinhSelect', 'khaiNiemSelect', 'tuKhaiNiemSelect'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                const container = select.closest('.bg-blue-50, .bg-orange-50, .bg-gray-50');
                if (container) {
                    if (select.value) {
                        container.classList.add('ring-2', 'ring-opacity-50');
                        if (selectId === 'hinhSelect') {
                            container.classList.add('ring-blue-500');
                        } else if (selectId === 'khaiNiemSelect') {
                            container.classList.add('ring-orange-500');
                        } else if (selectId === 'tuKhaiNiemSelect') {
                            container.classList.add('ring-gray-500');
                        }
                    } else {
                        container.classList.remove('ring-2', 'ring-opacity-50', 'ring-blue-500', 'ring-orange-500', 'ring-gray-500');
                    }
                }
            }
        });
    }
}

// Initialize preview manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.previewManager = new PreviewManager();
    
    // Force validation after a short delay to ensure all elements are loaded
    setTimeout(() => {
        if (window.previewManager) {
            window.previewManager.validateForm();
        }
    }, 500);
    
    // Add manual validation trigger for debugging
    window.forceValidate = () => {
        if (window.previewManager) {
            window.previewManager.validateForm();
        }
    };
});
