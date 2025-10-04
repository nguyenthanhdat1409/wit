#!/usr/bin/env node

/**
 * Test GraphQL API để lấy draft posts
 */

async function testDraftPosts(wordpressUrl, username, password) {
  console.log(`🔍 Testing GraphQL for draft posts: ${wordpressUrl}/graphql`);
  
  const queries = [
    {
      name: 'Published Posts Only',
      query: `
        query GetPublishedPosts {
          posts(first: 10) {
            nodes {
              id
              title
              status
              date
              link
            }
          }
        }
      `
    },
    {
      name: 'All Posts (including drafts)',
      query: `
        query GetAllPosts {
          posts(first: 10, where: { status: ANY }) {
            nodes {
              id
              title
              status
              date
              link
            }
          }
        }
      `
    },
    {
      name: 'Draft Posts Only',
      query: `
        query GetDraftPosts {
          posts(first: 10, where: { status: DRAFT }) {
            nodes {
              id
              title
              status
              date
              link
            }
          }
        }
      `
    }
  ];

  for (const queryObj of queries) {
    console.log(`\n🔍 Testing: ${queryObj.name}`);
    
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authentication if provided
      if (username && password) {
        const auth = Buffer.from(`${username}:${password}`).toString('base64');
        headers['Authorization'] = `Basic ${auth}`;
      }
      
      const response = await fetch(`${wordpressUrl}/graphql`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: queryObj.query })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        console.log('❌ GraphQL Errors:', data.errors);
        continue;
      }

      console.log('✅ Success!');
      console.log(`📊 Found ${data.data.posts.nodes.length} posts`);
      
      if (data.data.posts.nodes.length > 0) {
        data.data.posts.nodes.forEach((post, index) => {
          console.log(`${index + 1}. "${post.title}" (${post.status}) - ${post.date}`);
        });
        
        // If we found posts, this query works!
        console.log(`\n🎉 ${queryObj.name} works!`);
        return { success: true, query: queryObj.query, data: data.data };
      } else {
        console.log('📭 No posts found');
      }
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
  
  return { success: false };
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const wordpressUrl = args[0] || 'https://admin.wikiw.vn';
  const username = args[1];
  const password = args[2];
  
  (async () => {
    console.log('🚀 Testing WordPress GraphQL for Draft Posts\n');
    
    const result = await testDraftPosts(wordpressUrl, username, password);
    
    if (result.success) {
      console.log('\n🎉 Found working query!');
      console.log('📋 Next steps:');
      console.log('1. Use this query in admin panel');
      console.log('2. Update GraphQL function');
      console.log('3. Or publish posts to make them public');
    } else {
      console.log('\n❌ No queries returned data');
      console.log('📋 Solutions:');
      console.log('1. Publish posts in WordPress admin');
      console.log('2. Try with authentication');
      console.log('3. Check GraphQL plugin permissions');
    }
  })();
}

module.exports = { testDraftPosts };
