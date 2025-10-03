#!/usr/bin/env node

/**
 * Test Custom WordPress API trực tiếp
 */

async function testCustomAPI() {
  console.log('🚀 Testing Custom WordPress API...\n');
  
  const wordpressUrl = 'https://wit.convoi.com.vn';
  const customApiUrl = `${wordpressUrl}/wp-json/custom/v1/contents`;
  
  try {
    console.log(`📡 Fetching data from: ${customApiUrl}`);
    
    const response = await fetch(customApiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Custom API works!');
    console.log(`📊 Found ${data.contents.nodes.length} posts\n`);
    
    // Hiển thị chi tiết từng post
    data.contents.nodes.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}"`);
      console.log(`   ID: ${post.id}`);
      console.log(`   Link: ${post.link}`);
      console.log(`   Content length: ${post.content ? post.content.length : 0} chars`);
      
      if (post.content) {
        const preview = post.content.replace(/<[^>]*>/g, '').substring(0, 100);
        console.log(`   Preview: ${preview}...`);
      }
      console.log('');
    });
    
    // Tạo Hugo content files
    console.log('📝 Creating Hugo content files...\n');
    
    data.contents.nodes.forEach((post, index) => {
      if (post.title && post.title !== 'Elementor #5169') { // Skip empty posts
        createHugoContent(post, index + 1);
      }
    });
    
    return data;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

function createHugoContent(post, index) {
  const slug = post.link.split('/').filter(Boolean).pop() || `post-${post.id}`;
  const title = post.title;
  const content = post.content || 'No content available';
  
  const hugoContent = `---
title: "${title}"
date: ${new Date().toISOString()}
draft: false
tags: ["wordpress-import"]
categories: ["imported-content"]
weight: ${index}
type: "page"
tableOfContents: true
---

# ${title}

${content}

---
*Imported from WordPress: ${post.link}*
`;

  const filename = `content/BAI-HOC/wordpress-import-${slug}.md`;
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Tạo thư mục nếu chưa có
    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filename, hugoContent, 'utf8');
    console.log(`✅ Created: ${filename}`);
  } catch (error) {
    console.log(`❌ Failed to create ${filename}: ${error.message}`);
  }
}

// Chạy test
testCustomAPI().then((data) => {
  if (data) {
    console.log('\n🎉 Success! WordPress data imported to Hugo content.');
    console.log('📋 Next steps:');
    console.log('1. Check content/BAI-HOC/ folder for new files');
    console.log('2. Run: hugo server -D');
    console.log('3. View your imported content');
  } else {
    console.log('\n❌ Failed to import data');
  }
}).catch(console.error);
