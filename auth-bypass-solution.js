// Temporary authentication bypass for testing
// Add this to auth.js temporarily to test iframe functionality

// Override handleLogin function temporarily
function handleLoginBypass(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    console.log('🔓 Bypass mode: Simulating successful login');
    
    // Simulate successful login
    const mockUser = {
        id: 1,
        name: email.split('@')[0],
        email: email,
        display_name: email.split('@')[0],
        roles: ['subscriber']
    };
    
    // Store mock data
    localStorage.setItem('auth_token', 'mock_token_' + Date.now());
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    
    // Show success and update UI
    showSuccessMessage('Đăng nhập thành công! (Bypass mode)');
    closeLoginModal();
    updateUIForLoggedInUser(mockUser);
}

// Override handleRegister function temporarily
function handleRegisterBypass(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    
    console.log('🔓 Bypass mode: Simulating successful registration');
    
    // Simulate successful registration
    const mockUser = {
        id: Date.now(),
        name: name,
        email: email,
        display_name: name,
        roles: ['subscriber']
    };
    
    // Store mock data
    localStorage.setItem('auth_token', 'mock_token_' + Date.now());
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    
    // Show success and update UI
    showSuccessMessage('Đăng ký thành công! (Bypass mode)');
    closeRegisterModal();
    updateUIForLoggedInUser(mockUser);
}

// Instructions to use:
/*
1. Open browser console on wikiw.vn
2. Copy and paste this code
3. Then run:
   window.handleLogin = handleLoginBypass;
   window.handleRegister = handleRegisterBypass;
4. Now try to login/register - it will work in bypass mode
5. This allows you to test iframe functionality without authentication issues
*/
