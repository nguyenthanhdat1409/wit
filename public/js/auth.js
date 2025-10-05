/**
 * Authentication System for HappyMarketDocs
 * Handles login, register, and session management
 */

// Configuration
const AUTH_CONFIG = {
    wordpressUrl: 'https://admin.wikiw.vn',
    netlifyFunctionUrl: '/.netlify/functions/auth',
    // Use Netlify Function for production, direct API for testing
    useDirectAPI: true, // Set to true for testing direct WordPress API
    // WordPress Application Password for authentication
    appPassword: 'YJhl 3GV0 nX5O 64fe Lq7o h7J3', // Application Password for Hugo Website Auth
    apiEndpoints: {
        login: '/wp-json/jwt-auth/v1/token', // JWT endpoint
        loginBasic: '/wp-json/wp/v2/users/me', // Basic WordPress API
        register: '/wp-json/wp/v2/users', // REST API (requires auth)
        registerForm: '/wp-login.php?action=register', // WordPress registration form
        user: '/wp-json/wp/v2/users/me', // Endpoint to get user info
        forgotPassword: '/wp-login.php?action=lostpassword' // WordPress forgot password
    },
    storageKeys: {
        user: 'happymarket_user',
        token: 'happymarket_token',
        remember: 'happymarket_remember'
    }
};

// Global state
let currentUser = null;
let authToken = null;

/**
 * Initialize authentication system
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    setupEventListeners();
    checkAuthStatus();
});

/**
 * Initialize authentication
 */
function initializeAuth() {
    // Load saved user data
    const savedUser = localStorage.getItem(AUTH_CONFIG.storageKeys.user);
    const savedToken = localStorage.getItem(AUTH_CONFIG.storageKeys.token);
    const rememberMe = localStorage.getItem(AUTH_CONFIG.storageKeys.remember);
    
    if (savedUser && savedToken && rememberMe === 'true') {
        currentUser = JSON.parse(savedUser);
        authToken = savedToken;
        updateUIForLoggedInUser();
    } else {
        // Ensure UI shows logged out state on page load
        updateUIForLoggedOutUser();
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Forgot password form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
    
    // Password confirmation
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', validatePasswordMatch);
    }
    
    // Close modals on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
            closeAllModals();
        }
    });
    
    // Close modals on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

/**
 * Check authentication status
 */
async function checkAuthStatus() {
    if (authToken) {
        try {
            const response = await fetch(AUTH_CONFIG.netlifyFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'user',
                    token: authToken
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    currentUser = data.user;
                    updateUIForLoggedInUser();
                } else {
                    logout();
                }
            } else {
                logout();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        }
    }
}

/**
 * Handle login form submission
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Clear previous errors
    hideError('loginError');
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang đăng nhập...';
    submitBtn.disabled = true;
    submitBtn.classList.add('auth-btn-loading');
    
    try {
        let response;
        
        if (AUTH_CONFIG.useDirectAPI) {
            // Try JWT first, then fallback to basic auth
            console.log('Using direct WordPress API for login');
            
            // First try JWT authentication
            response = await fetch(`${AUTH_CONFIG.wordpressUrl}${AUTH_CONFIG.apiEndpoints.login}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                })
            });
            
            // If JWT fails, try basic auth
            if (!response.ok) {
                console.log('JWT failed, trying basic auth...');
                const authHeader = btoa(`${email}:${password}`);
                
                response = await fetch(`${AUTH_CONFIG.wordpressUrl}${AUTH_CONFIG.apiEndpoints.loginBasic}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${authHeader}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } else {
            // Use Netlify Function for authentication
            response = await fetch(AUTH_CONFIG.netlifyFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'login',
                    username: email,
                    password: password
                })
            });
        }
        
        // Check if response is ok and has content
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const responseText = await response.text();
        console.log('Login response:', responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response text:', responseText);
            throw new Error('Server response is not valid JSON. Please check server configuration.');
        }
        
        // Handle different response formats
        let isSuccess = false;
        let token = null;
        let userData = null;
        
        if (AUTH_CONFIG.useDirectAPI) {
            // Handle both JWT and Basic Auth responses
            if (data.token) {
                // JWT response format
                isSuccess = true;
                token = data.token;
                userData = {
                    id: data.user_id || 1,
                    name: data.user_display_name || email,
                    email: data.user_email || email,
                    display_name: data.user_display_name || email
                };
            } else if (data.id) {
                // Basic Auth response format
                isSuccess = true;
                token = 'basic-auth-token'; // Simple token for Basic Auth
                userData = {
                    id: data.id,
                    name: data.name || email,
                    email: data.email || email,
                    display_name: data.name || email
                };
            }
        } else {
            // Netlify Function response format
            if (data.success) {
                isSuccess = true;
                token = data.token;
                userData = {
                    id: data.user?.id || 1,
                    name: data.user || email,
                    email: data.email || email,
                    display_name: data.user || email
                };
            }
        }
        
        if (isSuccess) {
            // Store authentication data
            authToken = token;
            currentUser = userData;
            
            // Save to localStorage if remember me is checked
            if (rememberMe) {
                localStorage.setItem(AUTH_CONFIG.storageKeys.user, JSON.stringify(currentUser));
                localStorage.setItem(AUTH_CONFIG.storageKeys.token, authToken);
                localStorage.setItem(AUTH_CONFIG.storageKeys.remember, 'true');
            }
            
            // Update UI
            updateUIForLoggedInUser();
            closeLoginModal();
            
            // Show success message
            showSuccessMessage('Đăng nhập thành công!');
        } else {
            // Handle different error formats
            let errorMessage = 'Đăng nhập thất bại';
            
            if (AUTH_CONFIG.useDirectAPI) {
                errorMessage = data.message || data.code || 'Thông tin đăng nhập không hợp lệ';
            } else {
                errorMessage = data.message || 'Đăng nhập thất bại';
            }
            
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('loginError', error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('auth-btn-loading');
    }
}

/**
 * Handle register form submission
 */
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Clear previous errors
    hideError('registerError');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showError('registerError', 'Mật khẩu xác nhận không khớp');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang đăng ký...';
    submitBtn.disabled = true;
    submitBtn.classList.add('auth-btn-loading');
    
    try {
        let response;
        
        if (AUTH_CONFIG.useDirectAPI) {
            // Use direct WordPress API with Application Password for registration
            console.log('Using direct WordPress API for registration');
            
            // Create basic auth header with Application Password
            const authHeader = btoa(`admin:${AUTH_CONFIG.appPassword}`);
            
            response = await fetch(`${AUTH_CONFIG.wordpressUrl}${AUTH_CONFIG.apiEndpoints.register}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${authHeader}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: email,
                    email: email,
                    password: password,
                    name: name
                })
            });
        } else {
            // Use Netlify Function for registration
            response = await fetch(AUTH_CONFIG.netlifyFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'register',
                    username: email,
                    email: email,
                    password: password,
                    name: name
                })
            });
        }
        
            // Check if response is ok and has content
            if (!response.ok) {
                if (response.status === 500) {
                    throw new Error('Email hoặc tên đăng nhập đã tồn tại. Vui lòng chọn thông tin khác.');
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const responseText = await response.text();
            console.log('Registration response:', responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response text:', responseText);
            throw new Error('Server response is not valid JSON. Please check server configuration.');
        }
        
        // Handle different response formats
        let isSuccess = false;
        let userData = null;
        
        if (AUTH_CONFIG.useDirectAPI) {
            // Direct WordPress API response format (Application Password)
            if (data.id) {
                isSuccess = true;
                userData = {
                    id: data.id,
                    name: data.name || name,
                    email: data.email || email,
                    display_name: data.name || name
                };
            }
        } else {
            // Netlify Function response format
            if (data.success) {
                isSuccess = true;
                userData = data.user;
            }
        }
        
        if (isSuccess) {
            // Registration successful - show success message and close modal
            closeRegisterModal();
            showSuccessMessage('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
            
            // Clear form
            e.target.reset();
        } else {
            // Handle different error formats
            let errorMessage = 'Đăng ký thất bại';
            
            if (AUTH_CONFIG.useDirectAPI) {
                // Handle specific WordPress errors
                if (data.code === 'existing_user_email') {
                    errorMessage = 'Email này đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập.';
                } else if (data.code === 'existing_user_login') {
                    errorMessage = 'Tên đăng nhập này đã tồn tại. Vui lòng chọn tên khác.';
                } else if (data.message) {
                    errorMessage = data.message;
                } else if (data.code) {
                    errorMessage = `Lỗi: ${data.code}`;
                } else {
                    errorMessage = 'Thông tin đăng ký không hợp lệ';
                }
            } else {
                errorMessage = data.message || 'Đăng ký thất bại';
            }
            
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Register error:', error);
        showError('registerError', error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('auth-btn-loading');
    }
}

/**
 * Validate password match
 */
function validatePasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        document.getElementById('confirmPassword').setCustomValidity('Mật khẩu không khớp');
    } else {
        document.getElementById('confirmPassword').setCustomValidity('');
    }
}

/**
 * Update UI for logged in user
 */
function updateUIForLoggedInUser() {
    if (!currentUser) return;
    
    // Hide auth buttons
    const authButtons = document.getElementById('auth-buttons');
    const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
    
    if (authButtons) {
        authButtons.classList.add('hidden');
        authButtons.style.display = 'none';
    }
    if (mobileAuthButtons) {
        mobileAuthButtons.classList.add('hidden');
        mobileAuthButtons.style.display = 'none';
    }
    
    // Show user menu
    const userMenu = document.getElementById('user-menu');
    const mobileUserMenu = document.getElementById('mobile-user-menu');
    
    if (userMenu) {
        userMenu.classList.remove('hidden');
        userMenu.style.display = 'flex';
    }
    if (mobileUserMenu) {
        mobileUserMenu.classList.remove('hidden');
        mobileUserMenu.style.display = 'block';
    }
    
    // Update user info
    const userName = document.getElementById('user-name');
    const mobileUserName = document.getElementById('mobile-user-name');
    const userAvatar = document.getElementById('user-avatar');
    const mobileUserAvatar = document.getElementById('mobile-user-avatar');
    
    const displayName = currentUser.display_name || currentUser.name || currentUser.username || 'User';
    const avatarText = displayName.charAt(0).toUpperCase();
    
    if (userName) userName.textContent = displayName;
    if (mobileUserName) mobileUserName.textContent = displayName;
    if (userAvatar) userAvatar.textContent = avatarText;
    if (mobileUserAvatar) mobileUserAvatar.textContent = avatarText;
}

/**
 * Update UI for logged out user
 */
function updateUIForLoggedOutUser() {
    // Show auth buttons
    const authButtons = document.getElementById('auth-buttons');
    const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
    
    if (authButtons) {
        authButtons.classList.remove('hidden');
        authButtons.style.display = 'flex';
    }
    if (mobileAuthButtons) {
        mobileAuthButtons.classList.remove('hidden');
        mobileAuthButtons.style.display = 'block';
    }
    
    // Hide user menu
    const userMenu = document.getElementById('user-menu');
    const mobileUserMenu = document.getElementById('mobile-user-menu');
    
    if (userMenu) {
        userMenu.classList.add('hidden');
        userMenu.style.display = 'none';
    }
    if (mobileUserMenu) {
        mobileUserMenu.classList.add('hidden');
        mobileUserMenu.style.display = 'none';
    }
}

/**
 * Logout user
 */
function logout() {
    // Clear stored data
    localStorage.removeItem(AUTH_CONFIG.storageKeys.user);
    localStorage.removeItem(AUTH_CONFIG.storageKeys.token);
    localStorage.removeItem(AUTH_CONFIG.storageKeys.remember);
    
    // Clear global state
    currentUser = null;
    authToken = null;
    
    // Update UI
    updateUIForLoggedOutUser();
    
    // Show success message
    showSuccessMessage('Đã đăng xuất thành công!');
}

// Forgot password function
async function handleForgotPassword(e) {
    e.preventDefault();
    hideError('forgotPasswordError');
    
    const form = e.target;
    const email = form.email.value;
    
    if (!email) {
        showError('forgotPasswordError', 'Vui lòng nhập email của bạn.');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;
    submitBtn.classList.add('auth-btn-loading');
    
    try {
        // Show loading message
        showSuccessMessage('Đang chuyển hướng đến trang đặt lại mật khẩu...');
        
        // Close modal first
        closeForgotPasswordModal();
        
        // Redirect to WordPress forgot password page with email pre-filled
        const forgotPasswordUrl = `${AUTH_CONFIG.wordpressUrl}/wp-login.php?action=lostpassword&user_login=${encodeURIComponent(email)}`;
        
        // Open in new tab
        window.open(forgotPasswordUrl, '_blank');
        
        // Show success message
        showSuccessMessage('Đã mở trang đặt lại mật khẩu. Vui lòng làm theo hướng dẫn trên trang mới.');
        
    } catch (error) {
        console.error('Forgot password error:', error);
        showError('forgotPasswordError', 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('auth-btn-loading');
    }
}

/**
 * Modal functions
 */
function openLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    clearForm('loginForm');
}

function openRegisterModal() {
    document.getElementById('registerModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    clearForm('registerForm');
}

function openForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    closeLoginModal();
    closeRegisterModal();
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

/**
 * Utility functions
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

function showSuccessMessage(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        // Clear any error messages
        const errorElements = form.querySelectorAll('[id$="Error"]');
        errorElements.forEach(element => {
            element.classList.add('hidden');
        });
    }
}

/**
 * Export functions for global access
 */
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.openRegisterModal = openRegisterModal;
window.closeRegisterModal = closeRegisterModal;
window.switchToRegister = switchToRegister;
window.switchToLogin = switchToLogin;
window.logout = logout;
