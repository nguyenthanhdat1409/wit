#!/usr/bin/env node

/**
 * Test Netlify Function trực tiếp
 */

async function testNetlifyFunction() {
  console.log('🚀 Testing Netlify Function...\n');
  
  const functionUrl = 'http://localhost:8888/.netlify/functions/wordpress-graphql';
  const wordpressUrl = 'https://admin.wikiw.vn';
  
  const requestData = {
    wordpressUrl: wordpressUrl,
    query: `
      query GetContents {
        contents {
          nodes {
            id
            title
            content
            link
          }
        }
      }
    `
  };
  
  try {
    console.log(`📡 Calling Netlify Function: ${functionUrl}`);
    console.log(`📡 WordPress URL: ${wordpressUrl}`);
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Netlify Function works!');
      console.log(`📊 Source: ${result.source}`);
      console.log(`📝 Message: ${result.message}`);
      
      if (result.data && result.data.contents && result.data.contents.nodes) {
        console.log(`📊 Found ${result.data.contents.nodes.length} contents\n`);
        
        result.data.contents.nodes.forEach((content, index) => {
          console.log(`${index + 1}. "${content.title}"`);
          console.log(`   ID: ${content.id}`);
          console.log(`   Link: ${content.link}`);
          console.log(`   Content length: ${content.content ? content.content.length : 0} chars`);
          console.log('');
        });
      }
    } else {
      console.log('❌ Netlify Function Error:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Troubleshooting:');
    console.log('1. Make sure Netlify dev server is running: npm run dev');
    console.log('2. Check if port 8888 is available');
    console.log('3. Try alternative URLs:');
    console.log('   - http://localhost:1313 (Hugo server)');
    console.log('   - http://127.0.0.1:8888');
    return null;
  }
}

// Chạy test
testNetlifyFunction().then((result) => {
  if (result && result.success) {
    console.log('\n🎉 Success! You can now use the WordPress data.');
    console.log('📋 Next steps:');
    console.log('1. Use the data to create Hugo content');
    console.log('2. Or use the Admin Panel when server is running');
  }
}).catch(console.error);
