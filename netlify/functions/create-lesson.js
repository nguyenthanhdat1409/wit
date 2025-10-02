const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

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

// Generate frontmatter cho Hugo
function generateFrontmatter(lessonData) {
  const now = new Date();
  return `---
title: "${lessonData.title}"
description: "${lessonData.description || ''}"
date: ${now.toISOString().split('T')[0]}
draft: false
tags: ["bài-học", "admin-created"]
categories: ["bai-hoc"]
weight: 10
type: "page"
tableOfContents: true
lesson:
  sources:
    hinh: "${lessonData.sources.hinh.id}"
    khaiNiem: "${lessonData.sources.khaiNiem.id}"
    tuKhaiNiem: "${lessonData.sources.tuKhaiNiem.id}"
---`;
}

// Generate markdown content
function generateMarkdownContent(lessonData) {
  return `# ${lessonData.title}

## Hình ảnh minh họa

${lessonData.sources.hinh.content}

---

## Khái niệm nguồn

${lessonData.sources.khaiNiem.content}

---

## Từ - Khái niệm

${lessonData.sources.tuKhaiNiem.content}

---

## Tổng kết

Bài học này kết hợp 3 nguồn kiến thức quan trọng:
- **Hình ảnh**: ${lessonData.sources.hinh.title}
- **Khái niệm nguồn**: ${lessonData.sources.khaiNiem.title}
- **Từ khái niệm**: ${lessonData.sources.tuKhaiNiem.title}

Tạo thành một bài học hoàn chỉnh về ${lessonData.title.toLowerCase()}, giúp người học có cái nhìn toàn diện và sâu sắc về chủ đề này.`;
}

// Tạo file markdown cho bài học
async function createLessonFile(slug, lessonData) {
  const frontmatter = generateFrontmatter(lessonData);
  const content = generateMarkdownContent(lessonData);
  
  const filePath = path.join(process.cwd(), 'content', 'BAI-HOC', slug, 'index.md');
  const fileContent = `${frontmatter}\n\n${content}`;
  
  // Tạo thư mục nếu chưa tồn tại
  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });
  
  // Write file to filesystem
  await fs.writeFile(filePath, fileContent, 'utf8');
  
  return { path: filePath, content: fileContent };
}

// Validate lesson data
function validateLessonData(lessonData) {
  const errors = [];
  
  if (!lessonData.title || lessonData.title.trim().length < 5) {
    errors.push('Tên bài học phải có ít nhất 5 ký tự');
  }
  
  if (!lessonData.title || lessonData.title.trim().length > 100) {
    errors.push('Tên bài học không được quá 100 ký tự');
  }
  
  if (!lessonData.sources || !lessonData.sources.hinh || !lessonData.sources.khaiNiem || !lessonData.sources.tuKhaiNiem) {
    errors.push('Phải chọn đầy đủ 3 nguồn nội dung');
  }
  
  if (lessonData.sources) {
    if (!lessonData.sources.hinh.id || !lessonData.sources.hinh.title || !lessonData.sources.hinh.content) {
      errors.push('Thông tin hình ảnh không đầy đủ');
    }
    if (!lessonData.sources.khaiNiem.id || !lessonData.sources.khaiNiem.title || !lessonData.sources.khaiNiem.content) {
      errors.push('Thông tin khái niệm nguồn không đầy đủ');
    }
    if (!lessonData.sources.tuKhaiNiem.id || !lessonData.sources.tuKhaiNiem.title || !lessonData.sources.tuKhaiNiem.content) {
      errors.push('Thông tin từ khái niệm không đầy đủ');
    }
  }
  
  return errors;
}

// Cập nhật mục lục BAI-HOC tự động
async function updateBaiHocTableOfContents() {
  try {
    const scriptPath = path.join(process.cwd(), 'scripts', 'update-bai-hoc-toc.js');
    
    // Kiểm tra xem script có tồn tại không
    try {
      await fs.access(scriptPath);
    } catch (error) {
      console.warn('Script cập nhật mục lục không tồn tại:', scriptPath);
      return;
    }
    
    // Chạy script cập nhật mục lục
    const { stdout, stderr } = await execAsync(`node "${scriptPath}"`);
    
    if (stderr) {
      console.warn('Script cập nhật mục lục có warning:', stderr);
    }
    
    console.log('Đã cập nhật mục lục BAI-HOC:', stdout);
  } catch (error) {
    console.error('Lỗi khi cập nhật mục lục BAI-HOC:', error);
    throw error;
  }
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
    const lessonData = JSON.parse(event.body);
    
    // Validate data
    const validationErrors = validateLessonData(lessonData);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Validation failed',
          details: validationErrors
        })
      };
    }

    // Generate slug
    const slug = generateSlug(lessonData.title);
    
    // Check if lesson already exists
    const lessonPath = path.join(process.cwd(), 'content', 'BAI-HOC', slug, 'index.md');
    try {
      await fs.access(lessonPath);
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ 
          error: 'Lesson already exists',
          slug: slug
        })
      };
    } catch (error) {
      // File doesn't exist, continue
    }
    
    // Create lesson file
    const result = await createLessonFile(slug, lessonData);
    
    // Auto commit and push to Git (giống như tạo từ vựng)
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    try {
      // Add lesson file to git
      const lessonPath = path.join(process.cwd(), 'content', 'BAI-HOC', slug, 'index.md');
      await execPromise(`git add "${lessonPath}"`);
      
      // Commit with descriptive message
      const commitMessage = `feat: add lesson "${lessonData.title}"`;
      await execPromise(`git commit -m "${commitMessage}"`);
      
      // Push to repository
      await execPromise('git push');
      console.log('✅ Git: lesson committed and pushed');
    } catch (gitError) {
      console.warn('⚠️ Git operation failed for lesson:', gitError.message);
      // Không fail toàn bộ request nếu chỉ lỗi Git
    }
    
    // Cập nhật mục lục BAI-HOC tự động
    try {
      await updateBaiHocTableOfContents();
    } catch (tocError) {
      console.warn('Không thể cập nhật mục lục:', tocError.message);
      // Không fail toàn bộ request nếu chỉ lỗi cập nhật mục lục
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        slug: slug,
        url: `/bai-hoc/${slug}/`,
        message: 'Bài học đã được tạo thành công và tự động deploy!'
      })
    };
  } catch (error) {
    console.error('Error creating lesson:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
