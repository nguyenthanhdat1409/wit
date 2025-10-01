const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const vocabData = JSON.parse(event.body);
    
    // Validate data
    if (!vocabData.slug) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'Slug is required'
        })
      };
    }
    
    if (!vocabData.title || vocabData.title.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'Tiêu đề không được để trống'
        })
      };
    }
    
    if (!vocabData.content || vocabData.content.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'Nội dung không được để trống'
        })
      };
    }
    
    const slug = vocabData.slug;
    const date = new Date().toISOString().split('T')[0];
    
    // Generate markdown content
    const tags = vocabData.tags || [];
    const categories = vocabData.categories || [];
    const tagsYaml = tags.length > 0 ? `tags: [${tags.map(tag => `"${tag}"`).join(', ')}]` : 'tags: [""]';
    const categoriesYaml = categories.length > 0 ? `categories: [${categories.map(cat => `"${cat}"`).join(', ')}]` : 'categories: [""]';
    
    const markdownContent = `---
title: "${vocabData.title}"
description: ""
date: ${date}
draft: false
weight: 59
${tagsYaml}
${categoriesYaml}
---

## Khái Niệm

${vocabData.content}`;
    
    const isLocal = process.env.NETLIFY_DEV === 'true' || process.env.CONTEXT === 'dev';
    
    if (isLocal) {
      // LOCAL: Ghi file trực tiếp
      try {
        const vocabPath = path.join(process.cwd(), 'content', 'TU-KHAINIEM', slug, '_index.md');
        
        // Check if vocabulary exists
        try {
          await fs.access(vocabPath);
        } catch (error) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ 
              success: false,
              error: 'Vocabulary not found'
            })
          };
        }
        
        // Write file
        await fs.writeFile(vocabPath, markdownContent, { encoding: 'utf8' });
        console.log('✅ Updated vocabulary file:', vocabPath);
        
        // Auto commit and push to Git
        const { exec } = require('child_process');
        const util = require('util');
        const execPromise = util.promisify(exec);
        
        try {
          await execPromise(`git add "${vocabPath}"`);
          const commitMessage = `feat: update vocabulary "${vocabData.title}"`;
          await execPromise(`git commit -m "${commitMessage}"`);
          await execPromise('git push');
          console.log('✅ Git: committed and pushed');
        } catch (gitError) {
          console.warn('⚠️ Git operation failed:', gitError.message);
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: {
              title: vocabData.title,
              slug: slug,
              filePath: `content/TU-KHAINIEM/${slug}/_index.md`,
              url: `/tu-khainiem/${slug}/`
            },
            message: 'Từ vựng đã được cập nhật thành công!'
          })
        };
      } catch (error) {
        console.error('Error updating vocabulary:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            success: false,
            error: 'Lỗi khi cập nhật file',
            message: error.message
          })
        };
      }
    } else {
      // PRODUCTION: Trả về nội dung
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            title: vocabData.title,
            slug: slug,
            filePath: `content/TU-KHAINIEM/${slug}/_index.md`,
            fileContent: markdownContent,
            url: `/tu-khainiem/${slug}/`,
            updated: false,
            message: 'Vui lòng commit file thủ công hoặc sử dụng local development.'
          },
          message: 'Đã cập nhật nội dung từ vựng. Vui lòng commit vào Git.'
        })
      };
    }
  } catch (error) {
    console.error('Error updating vocabulary:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: 'Lỗi server',
        message: error.message
      })
    };
  }
};

