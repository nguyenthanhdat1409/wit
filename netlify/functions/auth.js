/**
 * Netlify Function for WordPress Authentication
 * Handles login, register, and user management
 */

const WORDPRESS_URL = 'https://admin.wikiw.vn';

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const { action, ...data } = JSON.parse(event.body || '{}');

        switch (action) {
            case 'login':
                return await handleLogin(data, headers);
            case 'register':
                return await handleRegister(data, headers);
            case 'validate':
                return await handleValidate(data, headers);
            case 'user':
                return await handleGetUser(data, headers);
            case 'logout':
                return await handleLogout(data, headers);
            default:
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        message: 'Invalid action'
                    })
                };
        }
    } catch (error) {
        console.error('Auth function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: error.message
            })
        };
    }
};

/**
 * Handle user login
 */
async function handleLogin(data, headers) {
    const { username, password } = data;

    if (!username || !password) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Username and password are required'
            })
        };
    }

    try {
        // Try JWT authentication first
        const jwtResponse = await fetch(`${WORDPRESS_URL}/wp-json/jwt-auth/v1/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (jwtResponse.ok) {
            const jwtData = await jwtResponse.json();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    token: jwtData.token,
                    user: jwtData.user_display_name || jwtData.user_nicename,
                    email: jwtData.user_email,
                    message: 'Login successful'
                })
            };
        }

        // Fallback to basic auth
        const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');
        const userResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json'
            }
        });

        if (userResponse.ok) {
            const userData = await userResponse.json();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    user: userData,
                    message: 'Login successful (basic auth)'
                })
            };
        }

        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Invalid credentials'
            })
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Login failed',
                error: error.message
            })
        };
    }
}

/**
 * Handle user registration
 */
async function handleRegister(data, headers) {
    const { username, email, password, name, phone } = data;

    if (!username || !email || !password) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Username, email, and password are required'
            })
        };
    }

    // Validate phone number if provided
    if (phone && !phone.match(/^[0-9]{10,11}$/)) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Phone number must be 10-11 digits'
            })
        };
    }

    try {
        const requestBody = {
            username,
            email,
            password,
            name: name || username,
            roles: ['subscriber'],
            phone: phone || '',
            meta: {
                phone: phone || ''
            }
        };
        
        console.log('Sending to WordPress:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const userData = await response.json();
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({
                    success: true,
                    user: userData,
                    message: 'Registration successful'
                })
            };
        }

        const errorData = await response.json();
        return {
            statusCode: response.status,
            headers,
            body: JSON.stringify({
                success: false,
                message: errorData.message || 'Registration failed'
            })
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Registration failed',
                error: error.message
            })
        };
    }
}

/**
 * Handle token validation
 */
async function handleValidate(data, headers) {
    const { token } = data;

    if (!token) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Token is required'
            })
        };
    }

    try {
        const response = await fetch(`${WORDPRESS_URL}/wp-json/jwt-auth/v1/token/validate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    valid: true,
                    data
                })
            };
        }

        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
                success: false,
                valid: false,
                message: 'Invalid token'
            })
        };
    } catch (error) {
        console.error('Token validation error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Token validation failed',
                error: error.message
            })
        };
    }
}

/**
 * Handle get user data
 */
async function handleGetUser(data, headers) {
    const { token } = data;

    if (!token) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Token is required'
            })
        };
    }

    try {
        const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const userData = await response.json();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    user: userData
                })
            };
        }

        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Invalid token or user not found'
            })
        };
    } catch (error) {
        console.error('Get user error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Failed to get user data',
                error: error.message
            })
        };
    }
}

/**
 * Handle logout
 */
async function handleLogout(data, headers) {
    const { token } = data;

    if (!token) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Token is required'
            })
        };
    }

    try {
        // Try to revoke token if JWT plugin supports it
        const response = await fetch(`${WORDPRESS_URL}/wp-json/jwt-auth/v1/token/revoke`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Logout successful'
            })
        };
    } catch (error) {
        console.error('Logout error:', error);
        // Even if revoke fails, we consider logout successful
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Logout successful'
            })
        };
    }
}
