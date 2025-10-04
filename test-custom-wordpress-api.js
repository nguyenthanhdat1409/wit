#!/usr/bin/env node

/**
 * Test Custom WordPress REST API
 */

async function testCustomWordPressAPI(wordpressUrl) {
  console.log(`🔍 Testing Custom WordPress API: ${wordpressUrl}/wp-json/custom/v1/contents`);
  
  try {
    const response = await fetch(`${wordpressUrl}/wp-json/custom/v1/contents`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Custom API works!');
    console.log(`📊 Response:`, JSON.stringify(data, null, 2));
    
    if (data.contents && data.contents.nodes) {
      console.log(`📝 Found ${data.contents.nodes.length} posts`);
      
      data.contents.nodes.forEach((post, index) => {
        console.log(`${index + 1}. "${post.title}" (ID: ${post.id})`);
        console.log(`   Link: ${post.link}`);
        console.log(`   Content length: ${post.content ? post.content.length : 0} chars`);
      });
    }
    
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Custom API Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testStandardWordPressAPI(wordpressUrl) {
  console.log(`\n🔍 Testing Standard WordPress API: ${wordpressUrl}/wp-json/wp/v2/posts`);
  
  try {
    const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/posts?per_page=5`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Standard API works!');
    console.log(`📊 Found ${data.length} posts`);
    
    data.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title.rendered}" (ID: ${post.id})`);
      console.log(`   Link: ${post.link}`);
      console.log(`   Status: ${post.status}`);
    });
    
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Standard API Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const wordpressUrl = args[0] || 'https://admin.wikiw.vn';
  
  (async () => {
    console.log('🚀 Testing WordPress Custom API Integration\n');
    
    // Test custom API first
    const customResult = await testCustomWordPressAPI(wordpressUrl);
    
    if (customResult.success) {
      console.log('\n🎉 Custom API is working!');
      
      if (customResult.data.contents.nodes.length === 0) {
        console.log('\n📋 No posts found. This could mean:');
        console.log('   1. No published posts exist');
        console.log('   2. Custom API only returns published posts');
        console.log('   3. Need to create some test posts');
      }
    } else {
      console.log('\n🔄 Custom API failed, testing standard API...');
      const standardResult = await testStandardWordPressAPI(wordpressUrl);
      
      if (standardResult.success) {
        console.log('\n✅ Standard API is available as fallback');
      }
    }
    
    console.log('\n📋 Next steps:');
    console.log('1. Use Admin Panel: http://localhost:1313/admin/wordpress-integration.html');
    console.log('2. Or use command line: npm run wordpress:test-custom');
  })();
}

module.exports = { testCustomWordPressAPI, testStandardWordPressAPI };
