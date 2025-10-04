#!/usr/bin/env node

/**
 * Test GraphQL API với authentication
 */

async function testGraphQLWithAuth(wordpressUrl, username, password) {
  console.log(`🔍 Testing GraphQL with authentication: ${wordpressUrl}/graphql`);
  
  const query = `
    query GetPosts {
      posts(first: 10) {
        nodes {
          id
          title
          content
          excerpt
          date
          slug
          link
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
  `;

  try {
    // Prepare authentication
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    
    const response = await fetch(`${wordpressUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.log('❌ GraphQL Errors:', data.errors);
      return { success: false, error: data.errors[0].message };
    }

    console.log('✅ GraphQL API works with authentication!');
    console.log(`📊 Found ${data.data.posts.nodes.length} posts`);
    
    data.data.posts.nodes.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}" (ID: ${post.id})`);
      console.log(`   Link: ${post.link}`);
      console.log(`   Author: ${post.author?.node?.name || 'Unknown'}`);
      console.log(`   Date: ${post.date}`);
      console.log(`   Categories: ${post.categories?.nodes?.map(c => c.name).join(', ') || 'None'}`);
      console.log('');
    });
    
    return { success: true, data: data.data };
    
  } catch (error) {
    console.error('❌ GraphQL Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testWithoutAuth(wordpressUrl) {
  console.log(`\n🔍 Testing GraphQL without authentication...`);
  
  const query = `
    query GetPosts {
      posts(first: 10) {
        nodes {
          id
          title
          content
          link
        }
      }
    }
  `;

  try {
    const response = await fetch(`${wordpressUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.log('❌ GraphQL Errors:', data.errors);
      return { success: false, error: data.errors[0].message };
    }

    console.log('✅ GraphQL API works without authentication!');
    console.log(`📊 Found ${data.data.posts.nodes.length} posts`);
    
    if (data.data.posts.nodes.length > 0) {
      data.data.posts.nodes.forEach((post, index) => {
        console.log(`${index + 1}. "${post.title}" (ID: ${post.id})`);
      });
    } else {
      console.log('📭 No posts found. Possible reasons:');
      console.log('1. No published posts exist');
      console.log('2. Need authentication for private posts');
      console.log('3. Different post type or status');
    }
    
    return { success: true, data: data.data };
    
  } catch (error) {
    console.error('❌ GraphQL Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const wordpressUrl = args[0] || 'https://admin.wikiw.vn';
  const username = args[1];
  const password = args[2];
  
  (async () => {
    console.log('🚀 Testing WordPress GraphQL API\n');
    
    // Test without authentication first
    const noAuthResult = await testWithoutAuth(wordpressUrl);
    
    if (noAuthResult.success && noAuthResult.data.posts.nodes.length > 0) {
      console.log('\n🎉 No authentication needed!');
      console.log('📋 Next steps:');
      console.log('1. Use admin panel to import data');
      console.log('2. No need for username/password');
    } else if (username && password) {
      console.log('\n🔐 Testing with authentication...');
      const authResult = await testGraphQLWithAuth(wordpressUrl, username, password);
      
      if (authResult.success && authResult.data.posts.nodes.length > 0) {
        console.log('\n🎉 Authentication works!');
        console.log('📋 Next steps:');
        console.log('1. Use admin panel with username/password');
        console.log('2. Import data successfully');
      } else {
        console.log('\n❌ Authentication failed or no data');
        console.log('📋 Troubleshooting:');
        console.log('1. Check username/password');
        console.log('2. Check if posts are published');
        console.log('3. Check GraphQL plugin permissions');
      }
    } else {
      console.log('\n📋 No authentication provided');
      console.log('📋 To test with auth, run:');
      console.log(`node test-with-auth.js ${wordpressUrl} username password`);
    }
  })();
}

module.exports = { testGraphQLWithAuth, testWithoutAuth };
