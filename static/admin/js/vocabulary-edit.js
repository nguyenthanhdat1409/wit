// Vocabulary Edit JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('vocabularyForm');
    const titleInput = document.getElementById('vocabularyTitle');
    const slugInput = document.getElementById('vocabularySlug');
    const contentInput = document.getElementById('conceptContent');
    const tagsInput = document.getElementById('tags');
    const categoriesInput = document.getElementById('categories');
    const updateBtn = document.getElementById('updateBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const loading = document.getElementById('loading');
    const initialLoading = document.getElementById('initialLoading');
    const successModal = document.getElementById('successModal');
    const viewVocabularyBtn = document.getElementById('viewVocabularyBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const editingInfo = document.getElementById('editingInfo');

    let currentSlug = '';
    let vocabularyData = null;

    // Get slug from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    const title = urlParams.get('title');

    if (!slug) {
        alert('Không tìm thấy thông tin từ vựng để chỉnh sửa!');
        window.location.href = '/admin/';
        return;
    }

    currentSlug = slug;
    editingInfo.textContent = `Đang chỉnh sửa: ${title || slug}`;

    // Load vocabulary data
    loadVocabularyData(slug);

    // Cancel button
    cancelBtn.addEventListener('click', function() {
        if (confirm('Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu.')) {
            window.location.href = `/tu-khainiem/${slug}/`;
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        updateVocabulary();
    });

    // Modal event listeners
    closeModalBtn.addEventListener('click', function() {
        successModal.classList.add('hidden');
        window.location.href = `/tu-khainiem/${slug}/`;
    });

    viewVocabularyBtn.addEventListener('click', function() {
        window.location.href = `/tu-khainiem/${slug}/`;
    });

    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
            window.location.href = `/tu-khainiem/${slug}/`;
        }
    });

    // Functions
    function loadVocabularyData(slug) {
        console.log('📥 Loading vocabulary data for:', slug);
        
        // Call API to get vocabulary data
        fetch(`http://localhost:3001/api/get-vocabulary/${slug}`)
        .then(response => {
            console.log('📡 API Response:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('📄 Vocabulary data:', data);
            
            if (data.success) {
                vocabularyData = data.data;
                populateForm(vocabularyData);
                
                // Show form, hide loading
                initialLoading.classList.add('hidden');
                form.classList.remove('hidden');
            } else {
                throw new Error(data.error || 'Không thể tải dữ liệu');
            }
        })
        .catch(error => {
            console.error('❌ Error loading vocabulary:', error);
            alert('Không thể tải dữ liệu từ vựng. Vui lòng thử lại!');
            window.location.href = '/admin/';
        });
    }

    function populateForm(data) {
        titleInput.value = data.title || '';
        slugInput.value = data.slug || '';
        contentInput.value = data.content || '';
        tagsInput.value = data.tags ? data.tags.join(', ') : '';
        categoriesInput.value = data.categories ? data.categories.join(', ') : '';
    }

    function updateVocabulary() {
        const updatedData = {
            slug: currentSlug,
            title: titleInput.value.trim(),
            content: contentInput.value.trim(),
            tags: tagsInput.value.trim() ? tagsInput.value.split(',').map(t => t.trim()).filter(t => t) : [],
            categories: categoriesInput.value.trim() ? categoriesInput.value.split(',').map(c => c.trim()).filter(c => c) : []
        };

        if (!updatedData.title || !updatedData.content) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // Show loading
        loading.classList.remove('hidden');
        updateBtn.disabled = true;

        console.log('📤 Updating vocabulary:', updatedData);

        // Call API to update vocabulary
        fetch('http://localhost:3001/api/update-vocabulary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            console.log('📡 Update response:', response.status);
            return response.json();
        })
        .then(result => {
            console.log('✅ Update result:', result);
            
            loading.classList.add('hidden');
            updateBtn.disabled = false;
            
            if (result.success) {
                // Show success modal
                successModal.classList.remove('hidden');
            } else {
                alert('Lỗi: ' + (result.error || 'Không thể cập nhật từ vựng'));
            }
        })
        .catch(error => {
            console.error('❌ Update failed:', error);
            loading.classList.add('hidden');
            updateBtn.disabled = false;
            alert('Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!');
        });
    }
});
