#!/usr/bin/env node

/**
 * Test các GraphQL queries khác nhau để lấy dữ liệu thực tế
 */

async function testGraphQLQuery(wordpressUrl, query, description) {
  console.log(`\n🔍 Testing: ${description}`);
  console.log(`Query: ${query}`);
  
  try {
    const response = await fetch(`${wordpressUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    console.log('✅ Success!');
    console.log(`📊 Response:`, JSON.stringify(data, null, 2));
    
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testAllQueries(wordpressUrl) {
  console.log('🚀 Testing Multiple GraphQL Queries\n');
  
  const queries = [
    {
      query: `{ contents { nodes { id title content link } } }`,
      description: 'Contents endpoint (như bạn đã dùng)'
    },
    {
      query: `{ posts { nodes { id title content link } } }`,
      description: 'Posts endpoint (standard)'
    },
    {
      query: `{ pages { nodes { id title content link } } }`,
      description: 'Pages endpoint'
    },
    {
      query: `{ categories { nodes { id name description } } }`,
      description: 'Categories endpoint'
    },
    {
      query: `{ tags { nodes { id name description } } }`,
      description: 'Tags endpoint'
    },
    {
      query: `{ __schema { types { name } } }`,
      description: 'Schema introspection'
    }
  ];
  
  for (const queryObj of queries) {
    const result = await testGraphQLQuery(wordpressUrl, queryObj.query, queryObj.description);
    
    if (result.success && result.data) {
      // Check if we got actual data
      const hasData = Object.values(result.data).some(value => 
        Array.isArray(value) ? value.length > 0 : 
        value && typeof value === 'object' && Object.keys(value).length > 0
      );
      
      if (hasData) {
        console.log('🎉 Found data! This query works!');
        return result;
      } else {
        console.log('📭 No data returned');
      }
    }
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n❌ No queries returned data. Possible issues:');
  console.log('1. Need authentication');
  console.log('2. Custom schema configuration');
  console.log('3. Different endpoint structure');
  
  return null;
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const wordpressUrl = args[0] || 'https://admin.wikiw.vn';
  
  (async () => {
    const result = await testAllQueries(wordpressUrl);
    
    if (result) {
      console.log('\n🎉 Found working query!');
      console.log('📋 Next steps:');
      console.log('1. Use this query in admin panel');
      console.log('2. Update GraphQL function to use this query');
      console.log('3. Test with admin panel');
    } else {
      console.log('\n📋 Troubleshooting:');
      console.log('1. Check if posts are published in WordPress');
      console.log('2. Try with authentication');
      console.log('3. Check GraphQL plugin configuration');
    }
  })();
}

module.exports = { testAllQueries, testGraphQLQuery };
