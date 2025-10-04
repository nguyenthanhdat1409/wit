#!/usr/bin/env node

/**
 * Test WordPress API đơn giản
 */

const https = require('https');

async function testWordPressAPI() {
  console.log('🚀 Testing WordPress API...\n');
  
  const wordpressUrl = 'https://admin.wikiw.vn';
  
  // Test 1: GraphQL API
  console.log('1️⃣ Testing GraphQL API...');
  try {
    const graphqlQuery = {
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
    
    const response = await fetch(`${wordpressUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery)
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.contents && data.data.contents.nodes) {
        console.log(`✅ GraphQL works! Found ${data.data.contents.nodes.length} posts`);
        data.data.contents.nodes.forEach((post, index) => {
          console.log(`   ${index + 1}. "${post.title}" (ID: ${post.id})`);
        });
      } else {
        console.log('❌ GraphQL returned empty data');
      }
    } else {
      console.log(`❌ GraphQL failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ GraphQL error: ${error.message}`);
  }
  
  // Test 2: REST API
  console.log('\n2️⃣ Testing REST API...');
  try {
    const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/posts?per_page=5`);
    
    if (response.ok) {
      const posts = await response.json();
      console.log(`✅ REST API works! Found ${posts.length} posts`);
      posts.forEach((post, index) => {
        console.log(`   ${index + 1}. "${post.title.rendered}" (ID: ${post.id})`);
      });
    } else {
      console.log(`❌ REST API failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ REST API error: ${error.message}`);
  }
  
  // Test 3: Custom API
  console.log('\n3️⃣ Testing Custom API...');
  try {
    const response = await fetch(`${wordpressUrl}/wp-json/custom/v1/contents`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.contents && data.contents.nodes) {
        console.log(`✅ Custom API works! Found ${data.contents.nodes.length} contents`);
        data.contents.nodes.forEach((content, index) => {
          console.log(`   ${index + 1}. "${content.title}" (ID: ${content.id})`);
        });
      } else {
        console.log('❌ Custom API returned empty data');
      }
    } else {
      console.log(`❌ Custom API failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Custom API error: ${error.message}`);
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. If any API works, use Admin Panel to import data');
  console.log('2. Run: npm run dev');
  console.log('3. Go to: http://localhost:8888/admin/wordpress-integration.html');
  console.log('4. Configure and import your data');
}

// Run the test
testWordPressAPI().catch(console.error);