const fs = require('fs').promises;
const path = require('path');

// Generate slug từ title
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

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

    // Generate slug
    const slug = generateSlug(vocabData.title);
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
    
    // ⚠️ QUAN TRỌNG: 
    // - LOCAL (netlify dev): Có thể ghi file trực tiếp
    // - PRODUCTION (Netlify): KHÔNG thể ghi file, chỉ trả về content
    
    const isLocal = process.env.NETLIFY_DEV === 'true' || process.env.CONTEXT === 'dev';
    
    if (isLocal) {
      // LOCAL: Ghi file trực tiếp
      try {
        const vocabPath = path.join(process.cwd(), 'content', 'TU-KHAINIEM', slug, '_index.md');
        
        // Check if vocabulary already exists
        try {
          await fs.access(vocabPath);
          return {
            statusCode: 409,
            headers,
            body: JSON.stringify({ 
              success: false,
              error: 'Từ vựng đã tồn tại',
              slug: slug
            })
          };
        } catch (error) {
          // File doesn't exist, continue
        }
        
        // Create directory
        const dirPath = path.join(process.cwd(), 'content', 'TU-KHAINIEM', slug);
        await fs.mkdir(dirPath, { recursive: true });
        
        // Write file
        await fs.writeFile(vocabPath, markdownContent, { encoding: 'utf8' });
        console.log('✅ Created vocabulary file:', vocabPath);
        
        // Auto commit and push to Git (local development)
        const { exec } = require('child_process');
        const util = require('util');
        const execPromise = util.promisify(exec);
        
        try {
          await execPromise(`git add "${vocabPath}"`);
          const commitMessage = `feat: add vocabulary "${vocabData.title}"`;
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
              url: `/tu-khainiem/${slug}/`,
              created: true,
              message: 'Từ vựng đã được tạo và commit vào Git thành công!'
            },
            message: 'Từ vựng đã được tạo thành công!'
          })
        };
      } catch (error) {
        console.error('Error creating vocabulary:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            success: false,
            error: 'Lỗi khi tạo file',
            message: error.message
          })
        };
      }
    } else {
      // PRODUCTION: Trả về nội dung để user commit thủ công
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
            created: false, // Chưa tạo file trên server
            message: 'Vui lòng commit file thủ công hoặc sử dụng local development để tự động tạo file.'
          },
          message: 'Đã tạo nội dung từ vựng. Vui lòng commit vào Git để hiển thị trên website.'
        })
      };
    }
  } catch (error) {
    console.error('Error creating vocabulary:', error);
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

