const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Extract slug from path: /.netlify/functions/get-vocabulary/slug-name
    const pathParts = event.path.split('/');
    const slug = pathParts[pathParts.length - 1];
    
    if (!slug || slug === 'get-vocabulary') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Slug is required' 
        })
      };
    }
    
    // Read vocabulary file
    const vocabPath = path.join(process.cwd(), 'content', 'TU-KHAINIEM', slug, '_index.md');
    
    try {
      const fileContent = await fs.readFile(vocabPath, 'utf8');
      
      // Parse frontmatter and content
      const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
      const match = fileContent.match(frontmatterRegex);
      
      if (!match) {
        throw new Error('Invalid file format');
      }
      
      const frontmatter = match[1];
      const content = match[2];
      
      // Extract fields from frontmatter
      const titleMatch = frontmatter.match(/title:\s*"(.*)"/);
      const tagsMatch = frontmatter.match(/tags:\s*\[(.*)\]/);
      const categoriesMatch = frontmatter.match(/categories:\s*\[(.*)\]/);
      
      // Extract content (skip heading and ## Khái Niệm)
      const contentLines = content.trim().split('\n');
      let actualContent = '';
      let foundKhaiNiem = false;
      
      for (let i = 0; i < contentLines.length; i++) {
        if (contentLines[i].includes('## Khái Niệm')) {
          foundKhaiNiem = true;
          continue;
        }
        if (foundKhaiNiem && contentLines[i].trim()) {
          actualContent = contentLines.slice(i).join('\n').trim();
          break;
        }
      }
      
      const vocabularyData = {
        slug: slug,
        title: titleMatch ? titleMatch[1] : slug,
        content: actualContent || content.replace(/^#.*\n/, '').replace(/##\s*Khái Niệm\n/, '').trim(),
        tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/"/g, '')).filter(t => t) : [],
        categories: categoriesMatch ? categoriesMatch[1].split(',').map(c => c.trim().replace(/"/g, '')).filter(c => c) : []
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: vocabularyData
        })
      };
    } catch (error) {
      console.error('Error reading vocabulary file:', error);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Vocabulary not found'
        })
      };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};

