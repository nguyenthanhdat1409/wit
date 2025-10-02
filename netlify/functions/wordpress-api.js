const axios = require('axios');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
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
    const { wordpressUrl, endpoint, params, username, password } = JSON.parse(event.body || '{}');
    
    if (!wordpressUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'WordPress URL is required' })
      };
    }

    // Cấu hình WordPress REST API URL
    const baseUrl = wordpressUrl.endsWith('/') ? wordpressUrl : `${wordpressUrl}/`;
    const apiUrl = `${baseUrl}wp-json/wp/v2/`;
    
    let url = `${apiUrl}${endpoint || 'posts'}`;
    
    // Thêm query parameters
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    console.log('Fetching from WordPress API:', url);

    // Chuẩn bị headers
    const requestHeaders = {
      'User-Agent': 'HappyMarketDocs/1.0',
      'Content-Type': 'application/json'
    };

    // Thêm authentication nếu có
    if (username && password) {
      const auth = Buffer.from(`${username}:${password}`).toString('base64');
      requestHeaders['Authorization'] = `Basic ${auth}`;
    }

    // Gọi WordPress REST API
    const response = await axios.get(url, {
      timeout: 10000,
      headers: requestHeaders
    });

    // Xử lý dữ liệu để trích xuất wiki content
    const processedData = processWikiContent(response.data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: processedData,
        total: response.data.length,
        source: 'WordPress REST API'
      })
    };

  } catch (error) {
    console.error('WordPress API Error:', error.message);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch from WordPress',
        message: error.message,
        details: error.response?.data || null
      })
    };
  }
};

/**
 * Xử lý dữ liệu WordPress để trích xuất wiki content
 */
function processWikiContent(data) {
  return data.map(post => {
    // Trích xuất nội dung chính
    const content = extractWikiContent(post.content?.rendered || '');
    
    // Trích xuất metadata
    const metadata = {
      id: post.id,
      title: post.title?.rendered || '',
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      author: post.author,
      categories: post.categories || [],
      tags: post.tags || [],
      featured_media: post.featured_media,
      excerpt: post.excerpt?.rendered || '',
      status: post.status,
      type: post.type
    };

    // Trích xuất wiki sections
    const wikiSections = extractWikiSections(content);

    return {
      ...metadata,
      wikiContent: content,
      wikiSections,
      wordCount: content.length,
      hasImages: content.includes('<img'),
      hasLinks: content.includes('<a href'),
      lastUpdated: new Date().toISOString()
    };
  });
}

/**
 * Trích xuất nội dung wiki từ HTML content
 */
function extractWikiContent(htmlContent) {
  if (!htmlContent) return '';
  
  // Loại bỏ HTML tags nhưng giữ nội dung text
  let content = htmlContent
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Loại bỏ script tags
    .replace(/<style[^>]*>.*?<\/style>/gi, '') // Loại bỏ style tags
    .replace(/<[^>]+>/g, ' ') // Loại bỏ tất cả HTML tags
    .replace(/\s+/g, ' ') // Chuẩn hóa whitespace
    .trim();

  // Decode HTML entities
  content = content
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  return content;
}

/**
 * Trích xuất các sections từ wiki content
 */
function extractWikiSections(content) {
  const sections = [];
  
  // Tìm các heading patterns
  const headingPatterns = [
    /^# (.+)$/gm, // Markdown H1
    /^## (.+)$/gm, // Markdown H2
    /^### (.+)$/gm, // Markdown H3
    /^#### (.+)$/gm, // Markdown H4
    /<h1[^>]*>(.+?)<\/h1>/gi, // HTML H1
    /<h2[^>]*>(.+?)<\/h2>/gi, // HTML H2
    /<h3[^>]*>(.+?)<\/h3>/gi, // HTML H3
    /<h4[^>]*>(.+?)<\/h4>/gi  // HTML H4
  ];

  headingPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      sections.push({
        type: 'heading',
        text: match[1].replace(/<[^>]+>/g, '').trim(),
        level: pattern.source.includes('h1') ? 1 : 
               pattern.source.includes('h2') ? 2 :
               pattern.source.includes('h3') ? 3 : 4
      });
    }
  });

  // Tìm các list items
  const listPattern = /^[\*\-\+]\s+(.+)$/gm;
  let match;
  while ((match = listPattern.exec(content)) !== null) {
    sections.push({
      type: 'list_item',
      text: match[1].trim()
    });
  }

  // Tìm các đoạn văn quan trọng (có từ khóa wiki)
  const importantKeywords = ['định nghĩa', 'khái niệm', 'nguyên lý', 'quy luật', 'công thức', 'phương pháp'];
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  
  paragraphs.forEach(paragraph => {
    if (importantKeywords.some(keyword => paragraph.toLowerCase().includes(keyword))) {
      sections.push({
        type: 'important_paragraph',
        text: paragraph.trim(),
        keywords: importantKeywords.filter(keyword => 
          paragraph.toLowerCase().includes(keyword)
        )
      });
    }
  });

  return sections;
}
