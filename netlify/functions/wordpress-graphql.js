const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { wordpressUrl, query, variables = {}, username, password } = JSON.parse(event.body);

    if (!wordpressUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'WordPress URL is required'
        })
      };
    }

    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'GraphQL query is required'
        })
      };
    }

    // Prepare request headers
    const requestHeaders = {
      'Content-Type': 'application/json'
    };

    // Add authentication if provided
    if (username && password) {
      const auth = Buffer.from(`${username}:${password}`).toString('base64');
      requestHeaders['Authorization'] = `Basic ${auth}`;
    }

    // Try GraphQL endpoint first
    let graphqlUrl = `${wordpressUrl}/graphql`;
    let response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        query,
        variables
      })
    });

    // If GraphQL fails, try custom REST API first, then standard REST API
    if (!response.ok && response.status === 404) {
      console.log('GraphQL not available, trying custom REST API...');
      
      // Try custom REST API first
      try {
        const customResponse = await fetch(`${wordpressUrl}/wp-json/custom/v1/contents`, {
          headers: requestHeaders
        });
        
        if (customResponse.ok) {
          const customData = await customResponse.json();
          const transformedData = transformCustomAPIData(customData);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: transformedData,
              source: 'custom-api',
              message: 'Using custom WordPress REST API'
            })
          };
        }
      } catch (error) {
        console.log('Custom API failed, trying standard REST API...');
      }
      
      // Convert GraphQL query to standard REST API call
      const restData = await convertGraphQLToREST(wordpressUrl, query, requestHeaders);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: restData,
          source: 'rest-api',
          message: 'GraphQL not available, using standard REST API'
        })
      };
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: data.errors[0].message,
          errors: data.errors
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: data.data,
        source: 'graphql'
      })
    };

  } catch (error) {
    console.error('WordPress GraphQL Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

// Convert GraphQL query to REST API calls
async function convertGraphQLToREST(wordpressUrl, query, headers) {
  try {
    // Simple query parsing for common patterns
    if (query.includes('posts')) {
      const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/posts?per_page=10&_embed`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`REST API Error: ${response.status}`);
      }
      
      const posts = await response.json();
      
      // Transform REST data to match GraphQL structure
      return {
        posts: {
          nodes: posts.map(post => ({
            id: post.id.toString(),
            title: post.title.rendered,
            content: post.content.rendered,
            excerpt: post.excerpt.rendered,
            date: post.date,
            slug: post.slug,
            author: {
              node: {
                name: post._embedded?.author?.[0]?.name || 'Unknown'
              }
            },
            categories: {
              nodes: post._embedded?.['wp:term']?.[0]?.map(cat => ({
                name: cat.name,
                slug: cat.slug
              })) || []
            },
            tags: {
              nodes: post._embedded?.['wp:term']?.[1]?.map(tag => ({
                name: tag.name,
                slug: tag.slug
              })) || []
            }
          }))
        }
      };
    }
    
    if (query.includes('pages')) {
      const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/pages?per_page=10&_embed`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`REST API Error: ${response.status}`);
      }
      
      const pages = await response.json();
      
      return {
        pages: {
          nodes: pages.map(page => ({
            id: page.id.toString(),
            title: page.title.rendered,
            content: page.content.rendered,
            excerpt: page.excerpt.rendered,
            date: page.date,
            slug: page.slug
          }))
        }
      };
    }
    
    if (query.includes('categories')) {
      const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/categories?per_page=20`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`REST API Error: ${response.status}`);
      }
      
      const categories = await response.json();
      
      return {
        categories: {
          nodes: categories.map(cat => ({
            id: cat.id.toString(),
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            count: cat.count
          }))
        }
      };
    }
    
    if (query.includes('tags')) {
      const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/tags?per_page=20`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`REST API Error: ${response.status}`);
      }
      
      const tags = await response.json();
      
      return {
        tags: {
          nodes: tags.map(tag => ({
            id: tag.id.toString(),
            name: tag.name,
            slug: tag.slug,
            description: tag.description,
            count: tag.count
          }))
        }
      };
    }
    
    // Default fallback
    return {
      message: 'Query not supported in REST API mode',
      suggestion: 'Install WPGraphQL plugin for full GraphQL support'
    };
    
  } catch (error) {
    throw new Error(`REST API conversion failed: ${error.message}`);
  }
}

// Transform custom API data to match GraphQL structure
function transformCustomAPIData(customData) {
  if (!customData || !customData.contents || !customData.contents.nodes) {
    return {
      posts: { nodes: [] }
    };
  }
  
  const transformedNodes = customData.contents.nodes.map(post => ({
    id: post.id.toString(),
    title: post.title || 'Untitled',
    content: post.content || '',
    excerpt: post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : '',
    date: new Date().toISOString(), // Custom API doesn't provide date
    slug: post.link ? post.link.split('/').pop() : `post-${post.id}`,
    author: {
      node: {
        name: 'Unknown' // Custom API doesn't provide author
      }
    },
    categories: {
      nodes: [] // Custom API doesn't provide categories
    },
    tags: {
      nodes: [] // Custom API doesn't provide tags
    }
  }));
  
  return {
    posts: {
      nodes: transformedNodes
    }
  };
}
