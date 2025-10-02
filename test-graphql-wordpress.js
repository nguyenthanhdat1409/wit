#!/usr/bin/env node

/**
 * Test WordPress GraphQL API
 */

async function testGraphQLEndpoint(wordpressUrl) {
  console.log(`🔍 Testing GraphQL endpoint: ${wordpressUrl}/graphql`);
  
  const query = {
    query: `
      query GetPosts {
        posts(first: 5) {
          nodes {
            id
            title
            content
            excerpt
            date
            slug
            author {
              node {
                name
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
            tags {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    `
  };

  try {
    const response = await fetch(`${wordpressUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('❌ GraphQL endpoint not found (404)');
        console.log('📋 Cần cài đặt plugin GraphQL cho WordPress:');
        console.log('   1. Vào WordPress Admin: https://wit.convoi.com.vn/wp-admin/');
        console.log('   2. Plugins > Add New');
        console.log('   3. Tìm kiếm "WPGraphQL" hoặc "GraphQL"');
        console.log('   4. Cài đặt và kích hoạt plugin');
        console.log('   5. Hoặc cài đặt thủ công: https://wordpress.org/plugins/wp-graphql/');
        return { success: false, error: 'GraphQL plugin not installed' };
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.log('❌ GraphQL Errors:', data.errors);
      return { success: false, error: data.errors[0].message };
    }

    console.log('✅ GraphQL API works!');
    console.log(`📊 Found ${data.data.posts.nodes.length} posts`);
    
    data.data.posts.nodes.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}" (${post.slug})`);
      console.log(`   Author: ${post.author.node.name}`);
      console.log(`   Date: ${post.date}`);
      console.log(`   Categories: ${post.categories.nodes.map(c => c.name).join(', ')}`);
    });
    
    return { success: true, data: data.data };
    
  } catch (error) {
    console.error('❌ GraphQL Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testRESTAPI(wordpressUrl) {
  console.log(`\n🔍 Testing REST API as fallback: ${wordpressUrl}/wp-json/wp/v2/posts`);
  
  try {
    const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/posts?per_page=5`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ REST API works!');
    console.log(`📊 Found ${data.length} posts`);
    
    data.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title.rendered}" (${post.slug})`);
    });
    
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ REST API Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const wordpressUrl = args[0] || 'https://wit.convoi.com.vn';
  
  (async () => {
    console.log('🚀 Testing WordPress API Integration\n');
    
    // Test GraphQL first
    const graphqlResult = await testGraphQLEndpoint(wordpressUrl);
    
    if (!graphqlResult.success) {
      console.log('\n🔄 GraphQL failed, testing REST API...');
      const restResult = await testRESTAPI(wordpressUrl);
      
      if (restResult.success) {
        console.log('\n✅ REST API is available as fallback');
        console.log('\n📋 Recommendations:');
        console.log('   1. Cài đặt WPGraphQL plugin để có GraphQL API');
        console.log('   2. Hoặc sử dụng REST API hiện tại');
        console.log('   3. Run: npm run wordpress:test để test integration');
      }
    } else {
      console.log('\n🎉 GraphQL API is ready!');
      console.log('\nNext steps:');
      console.log('1. Use Admin Panel: http://localhost:1313/admin/wordpress-integration.html');
      console.log('2. Or use command line: npm run wordpress:import');
    }
  })();
}

module.exports = { testGraphQLEndpoint, testRESTAPI };
