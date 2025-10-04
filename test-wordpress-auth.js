#!/usr/bin/env node

/**
 * Test WordPress API với Authentication
 */

async function testWordPressWithAuth(wordpressUrl, username, password) {
  console.log(`🔍 Testing WordPress API with auth: ${wordpressUrl}`);
  
  // Test public API first
  console.log('\n📡 Testing public API...');
  try {
    const publicResponse = await fetch(`${wordpressUrl}/wp-json/wp/v2/posts?per_page=1`);
    if (publicResponse.ok) {
      console.log('✅ Public API works - no authentication needed');
      return await testPublicAPI(wordpressUrl);
    }
  } catch (error) {
    console.log('❌ Public API failed, trying with authentication...');
  }

  // Test with authentication
  console.log('\n🔐 Testing with authentication...');
  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  
  try {
    const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/posts?per_page=1`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Authenticated API works!');
    console.log(`📊 Found ${data.length} posts`);
    
    if (data.length > 0) {
      const post = data[0];
      console.log(`📝 Sample post: "${post.title.rendered}"`);
      console.log(`📅 Date: ${post.date}`);
      console.log(`👤 Author: ${post.author}`);
      console.log(`🔒 Status: ${post.status}`);
    }
    
    return { success: true, data, auth };
    
  } catch (error) {
    console.error('❌ Authenticated API Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testPublicAPI(wordpressUrl) {
  try {
    const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/posts?per_page=5`);
    const data = await response.json();
    
    console.log(`📊 Found ${data.length} public posts`);
    data.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title.rendered}" (${post.status})`);
    });
    
    return { success: true, data, auth: null };
  } catch (error) {
    console.error('❌ Public API Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test different endpoints
async function testAllEndpoints(wordpressUrl, auth = null) {
  const endpoints = ['posts', 'pages', 'categories', 'tags', 'media'];
  const headers = auth ? { 'Authorization': `Basic ${auth}` } : {};
  
  console.log('\n🔍 Testing all endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/${endpoint}?per_page=1`, { headers });
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint}: ${data.length} items`);
      } else {
        console.log(`❌ ${endpoint}: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const wordpressUrl = args[0];
  const username = args[1];
  const password = args[2];
  
  if (!wordpressUrl) {
    console.log(`
Usage: node test-wordpress-auth.js <wordpress-url> [username] [password]

Examples:
  # Test public API only
  node test-wordpress-auth.js https://admin.wikiw.vn
  
  # Test with authentication
  node test-wordpress-auth.js https://admin.wikiw.vn username app-password
  
  # Test with Application Password
  node test-wordpress-auth.js https://admin.wikiw.vn admin abc123xyz789
    `);
    process.exit(1);
  }
  
  (async () => {
    const result = await testWordPressWithAuth(wordpressUrl, username, password);
    
    if (result.success) {
      await testAllEndpoints(wordpressUrl, result.auth);
      
      console.log('\n🎉 WordPress API is ready for integration!');
      console.log('\nNext steps:');
      console.log('1. Use Admin Panel: http://localhost:1313/admin/wordpress-integration.html');
      console.log('2. Or use command line: npm run wordpress:import');
    }
  })();
}

module.exports = { testWordPressWithAuth, testAllEndpoints };
