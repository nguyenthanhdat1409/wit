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
    const diagramData = JSON.parse(event.body);
    
    const imageTitle = diagramData.imageTitle;
    const conceptLink = diagramData.conceptLink || '';
    const lessonLink = diagramData.lessonLink || '';
    const imageUrl = diagramData.imageUrl || '';
    
    // Validate required fields
    if (!imageTitle || imageTitle.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'Tên hình không được để trống'
        })
      };
    }
    
    if (!imageUrl || imageUrl.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'URL hình ảnh không được để trống'
        })
      };
    }
    
    // Generate slug for the diagram
    const slug = generateSlug(imageTitle);
    const date = new Date().toISOString().split('T')[0];
    
    // Create diagram markdown content
    const markdownContent = `---
title: "${imageTitle}"
description: ""
date: ${date}
draft: false
weight: 100
tags: ["hình-ảnh", "đồ-hình"]
categories: ["hinh"]
diagram:
  imageUrl: "${imageUrl}"
  conceptLink: "${conceptLink}"
  lessonLink: "${lessonLink}"
---

![${imageTitle}](${imageUrl})

${imageTitle}`;
    
    // ⚠️ QUAN TRỌNG: Trên Netlify, không thể ghi file trực tiếp
    // Thay vào đó, trả về thông tin để user có thể tạo PR hoặc commit thủ công
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          title: imageTitle,
          slug: slug,
          imageUrl: imageUrl,
          conceptLink: conceptLink,
          lessonLink: lessonLink,
          filePath: `content/HINH/${slug}.md`,
          fileContent: markdownContent,
          url: `/hinh/`,
          created: false, // Chưa tạo file trên server
          indexed: false,
          rebuilt: false,
          message: 'Vui lòng commit file thủ công hoặc sử dụng local development để tự động tạo file.'
        },
        message: 'Đã tạo nội dung đồ hình. Vui lòng commit vào Git để hiển thị trên website.'
      })
    };
  } catch (error) {
    console.error('Error creating diagram:', error);
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

