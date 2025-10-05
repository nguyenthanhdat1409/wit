/**
 * Authentication System for HappyMarketDocs
 * Handles login, register, and session management
 */

// Configuration
const AUTH_CONFIG = {
    wordpressUrl: 'https://admin.wikiw.vn',
    netlifyFunctionUrl: '/.netlify/functions/auth',
    apiEndpoints: {
        login: '/wp-json/wp/v2/users/me',
        register: '/wp-json/wp/v2/users',
        nonce: '/wp-json/wp/v2/users/me'
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
        // Use Netlify Function for authentication
        const response = await fetch(AUTH_CONFIG.netlifyFunctionUrl, {
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
        
        const data = await response.json();
        
        if (data.success) {
            // Store authentication data
            authToken = data.token;
            currentUser = {
                id: data.user?.id || 1,
                name: data.user || email,
                email: data.email || email,
                display_name: data.user || email
            };
            
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
            throw new Error(data.message || 'Đăng nhập thất bại');
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
        // Use Netlify Function for registration
        const response = await fetch(AUTH_CONFIG.netlifyFunctionUrl, {
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
        
        const data = await response.json();
        
        if (data.success) {
            // Auto login after successful registration
            const loginResponse = await fetch(AUTH_CONFIG.netlifyFunctionUrl, {
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
            
            const loginData = await loginResponse.json();
            
            if (loginData.success) {
                authToken = loginData.token;
                currentUser = {
                    id: loginData.user?.id || 1,
                    name: loginData.user || name,
                    email: loginData.email || email,
                    display_name: loginData.user || name
                };
                
                // Save to localStorage
                localStorage.setItem(AUTH_CONFIG.storageKeys.user, JSON.stringify(currentUser));
                localStorage.setItem(AUTH_CONFIG.storageKeys.token, authToken);
                localStorage.setItem(AUTH_CONFIG.storageKeys.remember, 'true');
                
                // Update UI
                updateUIForLoggedInUser();
                closeRegisterModal();
                showSuccessMessage('Đăng ký thành công! Chào mừng bạn đến với HappyMarketDocs!');
            } else {
                throw new Error('Đăng ký thành công nhưng đăng nhập tự động thất bại');
            }
        } else {
            throw new Error(data.message || 'Đăng ký thất bại');
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
    
    if (authButtons) authButtons.classList.add('hidden');
    if (mobileAuthButtons) mobileAuthButtons.classList.add('hidden');
    
    // Show user menu
    const userMenu = document.getElementById('user-menu');
    const mobileUserMenu = document.getElementById('mobile-user-menu');
    
    if (userMenu) userMenu.classList.remove('hidden');
    if (mobileUserMenu) mobileUserMenu.classList.remove('hidden');
    
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
    
    if (authButtons) authButtons.classList.remove('hidden');
    if (mobileAuthButtons) mobileAuthButtons.classList.remove('hidden');
    
    // Hide user menu
    const userMenu = document.getElementById('user-menu');
    const mobileUserMenu = document.getElementById('mobile-user-menu');
    
    if (userMenu) userMenu.classList.add('hidden');
    if (mobileUserMenu) mobileUserMenu.classList.add('hidden');
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
