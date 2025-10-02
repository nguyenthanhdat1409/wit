#!/usr/bin/env node

/**
 * Test Real WordPress GraphQL API với dữ liệu thực tế
 */

async function testRealGraphQL(wordpressUrl) {
  console.log(`🔍 Testing Real GraphQL: ${wordpressUrl}/graphql`);
  
  const query = {
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
    const response = await fetch(`${wordpressUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.log('❌ GraphQL Errors:', data.errors);
      return { success: false, error: data.errors[0].message };
    }

    console.log('✅ GraphQL API works!');
    console.log(`📊 Found ${data.data.contents.nodes.length} contents`);
    
    data.data.contents.nodes.forEach((content, index) => {
      console.log(`${index + 1}. "${content.title}" (ID: ${content.id})`);
      console.log(`   Link: ${content.link}`);
      console.log(`   Content length: ${content.content ? content.content.length : 0} chars`);
      
      // Show first 100 chars of content
      if (content.content) {
        const preview = content.content.replace(/<[^>]*>/g, '').substring(0, 100);
        console.log(`   Preview: ${preview}...`);
      }
      console.log('');
    });
    
    return { success: true, data: data.data };
    
  } catch (error) {
    console.error('❌ GraphQL Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testWithNetlifyFunction(wordpressUrl) {
  console.log(`\n🔍 Testing via Netlify Function...`);
  
  const query = `
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
  `;

  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/wordpress-graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wordpressUrl: wordpressUrl,
        query: query
      })
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
        console.log(`📊 Found ${result.data.contents.nodes.length} contents via function`);
      }
    } else {
      console.log('❌ Netlify Function Error:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Netlify Function Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const wordpressUrl = args[0] || 'https://wit.convoi.com.vn';
  
  (async () => {
    console.log('🚀 Testing Real WordPress GraphQL Integration\n');
    
    // Test direct GraphQL
    const directResult = await testRealGraphQL(wordpressUrl);
    
    if (directResult.success) {
      console.log('\n🎉 Direct GraphQL API is working!');
      
      // Test via Netlify function if dev server is running
      console.log('\n📋 Testing via Netlify Function...');
      console.log('   (Make sure to run: npm run dev)');
      
      try {
        await testWithNetlifyFunction(wordpressUrl);
      } catch (error) {
        console.log('   Netlify function test skipped (dev server not running)');
      }
      
      console.log('\n📋 Next steps:');
      console.log('1. Use Admin Panel: http://localhost:1313/admin/wordpress-integration.html');
      console.log('2. Select "GraphQL" as API Type');
      console.log('3. Click "Test Connection" to verify');
      console.log('4. Click "Lấy Dữ Liệu WordPress" to import content');
    } else {
      console.log('\n❌ GraphQL API failed');
      console.log('📋 Troubleshooting:');
      console.log('1. Check if GraphQL plugin is installed and activated');
      console.log('2. Check if custom schema is properly configured');
      console.log('3. Try with authentication if needed');
    }
  })();
}

module.exports = { testRealGraphQL, testWithNetlifyFunction };
