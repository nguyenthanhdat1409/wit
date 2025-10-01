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

// Generate markdown content for lesson
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
---

# ${lessonData.title}

`;

  // Section 1: Hình & Khái Niệm (2 columns)
  markdown += `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  <div>
    <h2>Hình Bài Học</h2>
`;

  if (lessonData.image) {
    markdown += `    ![${lessonData.title}](${lessonData.image})\n`;
  } else {
    markdown += `    <p class="text-gray-500 italic">Đang trong quá trình xây dựng!</p>\n`;
  }

  markdown += `  </div>
  <div>
    <h2>Khái Niệm</h2>
`;

  if (lessonData.concept) {
    markdown += `    <div class="bg-gray-50 p-4 rounded-lg">\n${lessonData.concept}\n    </div>\n`;
  } else {
    markdown += `    <p class="text-gray-500 italic">Đang trong quá trình xây dựng!</p>\n`;
  }

  markdown += `  </div>
</div>

`;

  // Section 2: Bài Học Liên Quan
  if (lessonData.relatedLessons && lessonData.relatedLessons.length > 0) {
    markdown += `## Bài Học Liên Quan

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
`;
    lessonData.relatedLessons.forEach(lesson => {
      if (lesson.image && lesson.link) {
        markdown += `  <a href="${lesson.link}" class="block hover:opacity-80">
    <img src="${lesson.image}" alt="Bài học liên quan" class="w-full rounded-lg shadow-md">
  </a>
`;
      }
    });
    markdown += `</div>

`;
  }

  // Section 3: Khái Niệm Liên Quan
  if (lessonData.relatedConcepts && lessonData.relatedConcepts.length > 0) {
    markdown += `## Khái Niệm Liên Quan

| Từ Khóa | Link |
|---------|------|
`;
    lessonData.relatedConcepts.forEach(concept => {
      if (concept.key && concept.link) {
        markdown += `| ${concept.key} | [${concept.link}](${concept.link}) |\n`;
      }
    });
    markdown += `\n`;
  }

  // Section 4: Mục (Trọng Điểm)
  const hasTrongDiem = lessonData.triThuc || lessonData.nhanThuc;
  if (hasTrongDiem) {
    markdown += `## Mục

`;
    if (lessonData.triThuc) {
      markdown += `1. [Trọng Điểm Tri Thức](${lessonData.triThuc})\n`;
    }
    if (lessonData.nhanThuc) {
      markdown += `2. [Trọng Điểm Nhận Thức](${lessonData.nhanThuc})\n`;
    }
    markdown += `\n`;
  }

  // Footer
  markdown += `---

*Bài học được tạo tự động từ HappyMarketDocs Admin*
`;

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

