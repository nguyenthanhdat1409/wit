const { createOrUpdateFile } = require('./lib/github-helper');

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

// Generate markdown content for lesson with proper HTML structure
function generateLessonMarkdown(lessonData) {
  const date = new Date().toISOString().split('T')[0];
  const slug = generateSlug(lessonData.title);
  
  let markdown = `---
title: "${lessonData.title}"
description: ""
date: ${date}
draft: false
weight: 100
tags: ["bài-học"]
categories: ["bai-hoc"]
tableOfContents: true
---

<div style="display: flex; gap: 16px;">

  <div style="flex: 1; max-width: 50%;">
    <h2 style="text-align: center; font-weight: bold; font-size: 22px; margin-bottom: 12px;">
      Hình Bài Học
    </h2>
    <a href="\\" style="display: block; text-align: center;">
      <div style="border: 1px solid #fff; border-radius: 8px; padding: 8px; background: #fff;">
`;

  if (lessonData.image) {
    // Convert base64 to proper image URL if needed
    let imageUrl = lessonData.image;
    if (lessonData.image.startsWith('data:image/')) {
      // For now, use a placeholder - in real implementation, save the image file
      imageUrl = '/images/placeholder.png';
    }
    markdown += `        <img src="${imageUrl}" alt="${lessonData.title}"
             style="width: 100%; height: 200px; object-fit: contain; border-radius: 4px; padding:10px;">`;
  } else {
    markdown += `        <div style="width: 100%; height: 200px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666;">
          Đang trong quá trình xây dựng!
        </div>`;
  }

  markdown += `
      </div>
    </a>
  </div>

  <div style="flex: 1; max-width: 50%;">
    <h2 style="text-align: center; font-weight: bold; font-size: 22px; margin-bottom: 12px;">
      Khái Niệm
    </h2>
  <p style="text-align: left;">
`;

  if (lessonData.concept) {
    markdown += `\n${lessonData.concept}\n`;
  } else {
    markdown += `\nĐang trong quá trình xây dựng!\n`;
  }

  markdown += `  </p>
  </div>

</div>


<h2 style="text-align: center; font-weight: bold; font-size: 22px; margin-bottom: 12px;">
       Bài Học Liên Quan
    </h2>

<div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: flex-start;">`;

  // Section 2: Bài Học Liên Quan
  if (lessonData.relatedLessons && lessonData.relatedLessons.length > 0) {
    lessonData.relatedLessons.forEach(lesson => {
      if (lesson.image && lesson.link) {
        markdown += `
  <a href="${lesson.link}" style="flex: 1 1 calc(25% - 12px); max-width: calc(25% - 12px); text-align: center;">
    <div style="border: 1px solid #fff; border-radius: 8px; padding: 8px; background: #fff;">
      <img src="${lesson.image}" alt="Bài học liên quan"
           style="width: 100%; height: 200px; object-fit: contain; border-radius: 4px; padding:10px;">
    </div>
  </a>`;
      }
    });
  }

  markdown += `
</div>

<h2 style="text-align: center; font-weight: bold; font-size: 22px; margin-bottom: 12px;">
       Khái Niệm Liên Quan
</h2>

<table style="border-collapse: collapse; width: 100%; text-align: center; font-family: Arial, sans-serif;">
  <tr>`;

  // Section 3: Khái Niệm Liên Quan
  if (lessonData.relatedConcepts && lessonData.relatedConcepts.length > 0) {
    lessonData.relatedConcepts.forEach((concept, index) => {
      if (concept.key && concept.link) {
        if (index % 5 === 0 && index > 0) {
          markdown += `  </tr>
  <tr>`;
        }
        markdown += `
    <td style="border: 1px solid black; padding: 8px;">
      <a href="${concept.link}" style="text-decoration: none; color: blue; font-weight: bold;">${concept.key.toUpperCase()}</a>
    </td>`;
      }
    });
  } else {
    // Add placeholder concepts
    const placeholderConcepts = ['KHÁI NIỆM 1', 'KHÁI NIỆM 2', 'KHÁI NIỆM 3', 'KHÁI NIỆM 4', 'KHÁI NIỆM 5'];
    placeholderConcepts.forEach((concept, index) => {
      if (index % 5 === 0 && index > 0) {
        markdown += `  </tr>
  <tr>`;
      }
      markdown += `
    <td style="border: 1px solid black; padding: 8px;">
      <a href="\\" style="text-decoration: none; color: blue; font-weight: bold;">${concept}</a>
    </td>`;
    });
  }

  // Fill remaining cells if needed
  const totalCells = lessonData.relatedConcepts ? lessonData.relatedConcepts.length : 5;
  const remainingCells = 10 - totalCells;
  for (let i = 0; i < remainingCells; i++) {
    markdown += `
    <td style="border: 1px solid black; padding: 8px;"></td>`;
  }

  markdown += `
  </tr>
</table>


`;

  // Section 4: Mục (Trọng Điểm)
  if (lessonData.triThuc || lessonData.nhanThuc) {
    if (lessonData.triThuc) {
      markdown += `- [1.Trọng Điểm Tri Thức](${lessonData.triThuc})\n`;
    }
    if (lessonData.nhanThuc) {
      markdown += `- [2.Trọng Điểm Nhận Thức](${lessonData.nhanThuc})\n`;
    }
  } else {
    markdown += `- [1.Trọng Điểm Tri Thức](#)
- [2.Trọng Điểm Nhận Thức](#)`;
  }

  return markdown;
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
    const lessonData = JSON.parse(event.body);
    
    // Validate required fields
    if (!lessonData.title || lessonData.title.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'Tên bài học không được để trống'
        })
      };
    }
    
    // Generate slug and markdown
    const slug = generateSlug(lessonData.title);
    const markdownContent = generateLessonMarkdown(lessonData);
    
    console.log('📝 Generated markdown for lesson:', lessonData.title);
    console.log('🔗 Slug:', slug);
    
    // Create file on GitHub via API
    try {
      const filePath = `content/BAI-HOC/${slug}/_index.md`;
      const commitMessage = `feat: add lesson "${lessonData.title}" via Admin Panel`;
      
      console.log('🚀 Creating lesson file on GitHub via API...');
      const githubResult = await createOrUpdateFile(filePath, markdownContent, commitMessage);
      
      console.log('✅ Lesson file created on GitHub:', githubResult.path);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            title: lessonData.title,
            slug: slug,
            filePath: filePath,
            url: `/bai-hoc/${slug}/`,
            created: true,
            githubCommit: githubResult.commit.sha,
            githubUrl: githubResult.url,
            message: 'File đã được tạo và commit vào GitHub. Netlify sẽ tự động rebuild trong ~2-3 phút.'
          },
          message: 'Bài học đã được tạo thành công! Netlify đang rebuild...',
          url: `/bai-hoc/${slug}/`
        })
      };
    } catch (githubError) {
      console.error('❌ GitHub API Error:', githubError);
      
      // Fallback: Return content for manual commit
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            title: lessonData.title,
            slug: slug,
            filePath: `content/BAI-HOC/${slug}/_index.md`,
            fileContent: markdownContent,
            url: `/bai-hoc/${slug}/`,
            created: false,
            error: githubError.message,
            message: 'Không thể tạo file tự động. Vui lòng commit thủ công hoặc sử dụng local development.'
          },
          message: 'Đã tạo nội dung bài học. Vui lòng commit vào Git để hiển thị trên website.',
          url: `/bai-hoc/${slug}/`
        })
      };
    }
  } catch (error) {
    console.error('❌ Error creating lesson:', error);
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

