#!/usr/bin/env node

/**
 * Test WordPress REST API Connection
 */

const https = require('https');

async function testWordPressAPI(wordpressUrl) {
  console.log(`🔍 Testing WordPress API: ${wordpressUrl}`);
  
  const apiUrl = `${wordpressUrl}/wp-json/wp/v2/posts?per_page=1`;
  console.log(`📡 API URL: ${apiUrl}`);
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ WordPress API is working!');
    console.log(`📊 Found ${data.length} posts`);
    
    if (data.length > 0) {
      const post = data[0];
      console.log(`📝 Sample post: "${post.title.rendered}"`);
      console.log(`📅 Date: ${post.date}`);
      console.log(`👤 Author: ${post.author}`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ WordPress API Error:', error.message);
    return false;
  }
}

// Command line usage
if (require.main === module) {
  const wordpressUrl = process.argv[2];
  
  if (!wordpressUrl) {
    console.log(`
Usage: node test-wordpress-api.js <wordpress-url>

Examples:
  node test-wordpress-api.js https://example.com
  node test-wordpress-api.js https://myblog.wordpress.com
    `);
    process.exit(1);
  }
  
  testWordPressAPI(wordpressUrl);
}

module.exports = { testWordPressAPI };
