#!/usr/bin/env node

/**
 * Simple WordPress API Test Server
 * Chạy local để test WordPress API
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// WordPress API endpoint
app.post('/api/wordpress', async (req, res) => {
  try {
    const { wordpressUrl, endpoint, params, username, password } = req.body;
    
    if (!wordpressUrl) {
      return res.status(400).json({ error: 'WordPress URL is required' });
    }

    // Build API URL
    const baseUrl = wordpressUrl.endsWith('/') ? wordpressUrl : `${wordpressUrl}/`;
    const apiUrl = `${baseUrl}wp-json/wp/v2/`;
    let url = `${apiUrl}${endpoint || 'posts'}`;
    
    // Add query parameters
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    console.log('Fetching from WordPress API:', url);

    // Prepare headers
    const requestHeaders = {
      'User-Agent': 'HappyMarketDocs/1.0',
      'Content-Type': 'application/json'
    };

    // Add authentication if provided
    if (username && password) {
      const auth = Buffer.from(`${username}:${password}`).toString('base64');
      requestHeaders['Authorization'] = `Basic ${auth}`;
      console.log('Using authentication for:', username);
    }

    // Call WordPress REST API
    const response = await axios.get(url, {
      timeout: 10000,
      headers: requestHeaders
    });

    // Process data
    const processedData = processWikiContent(response.data);

    res.json({
      success: true,
      data: processedData,
      total: response.data.length,
      source: 'WordPress REST API',
      auth: username ? 'authenticated' : 'public'
    });

  } catch (error) {
    console.error('WordPress API Error:', error.message);
    
    res.status(500).json({
      error: 'Failed to fetch from WordPress',
      message: error.message,
      details: error.response?.data || null
    });
  }
});

// Process WordPress content
function processWikiContent(data) {
  return data.map(post => {
    const content = extractWikiContent(post.content?.rendered || '');
    
    return {
      id: post.id,
      title: post.title?.rendered || '',
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      author: post.author,
      categories: post.categories || [],
      tags: post.tags || [],
      excerpt: post.excerpt?.rendered || '',
      status: post.status,
      type: post.type,
      wikiContent: content,
      wordCount: content.length,
      hasImages: content.includes('<img'),
      hasLinks: content.includes('<a href'),
      lastUpdated: new Date().toISOString()
    };
  });
}

// Extract wiki content
function extractWikiContent(htmlContent) {
  if (!htmlContent) return '';
  
  let content = htmlContent
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  content = content
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  return content;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 WordPress API Test Server running on http://localhost:${PORT}`);
  console.log(`📡 WordPress API endpoint: http://localhost:${PORT}/api/wordpress`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
