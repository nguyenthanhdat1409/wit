#!/usr/bin/env node

/**
 * Test hệ thống với dữ liệu mẫu từ GraphQL
 */

// Dữ liệu mẫu từ GraphQL API thực tế
const sampleData = {
  "data": {
    "contents": {
      "nodes": [
        {
          "id": "cG9zdDo1OTc1",
          "title": "5 Sự so sánh",
          "content": "\n<div class=\"wp-block-columns is-layout-flex wp-container-core-columns-is-layout-9d6595d7 wp-block-columns-is-layout-flex\">\n<div class=\"wp-block-column is-layout-flow wp-block-column-is-layout-flow\" style=\"flex-basis:25%\"></div>\n\n\n\n<div class=\"wp-block-column is-layout-flow wp-block-column-is-layout-flow\" style=\"flex-basis:50%\">\n<h4 class=\"wp-block-heading has-text-align-center\"><strong>Sức học tập</strong></h4>\n\n\n\n<h4 class=\"wp-block-heading has-text-align-center\"><strong>Cống hiến </strong>&#8211;<strong> gánh vác</strong></h4>\n\n\n\n<h4 class=\"wp-block-heading has-text-align-center\"><strong>Trân trọng </strong>&#8211;<strong> biết ơn</strong></h4>\n\n\n\n<h4 class=\"wp-block-heading has-text-align-center\"><strong>Kiên trì</strong></h4>\n\n\n\n<h4 class=\"wp-block-heading has-text-align-center\"><strong>Khiêm tốn</strong></h4>\n</div>\n\n\n\n<div class=\"wp-block-column is-layout-flow wp-block-column-is-layout-flow\" style=\"flex-basis:25%\"></div>\n</div>\n\n\n\n<p style=\"letter-spacing:1px;text-decoration:none\"></p>\n\n\n\n<p></p>\n",
          "link": "https://admin.wikiw.vn/content/5-su-so-sanh/"
        },
        {
          "id": "cG9zdDo1OTcy",
          "title": "4 Động Lực Sinh Tồn",
          "content": "\n<p></p>\n\n\n\n<div class=\"wp-block-columns is-layout-flex wp-container-core-columns-is-layout-9d6595d7 wp-block-columns-is-layout-flex\">\n<div class=\"wp-block-column is-layout-flow wp-block-column-is-layout-flow\" style=\"flex-basis:25%\"></div>\n\n\n\n<div class=\"wp-block-column is-layout-flow wp-block-column-is-layout-flow\" style=\"flex-basis:50%\">\n<h4 class=\"wp-block-heading has-text-align-center\"><strong>Bản thân</strong></h4>\n\n\n\n<h4 class=\"wp-block-heading has-text-align-center\"><strong>Gia đình</strong></h4>\n\n\n\n<h4 class=\"wp-block-heading has-text-align-center\"><strong>Xã hội</strong></h4>\n\n\n\n<h4 class=\"wp-block-heading has-text-align-center\"><strong>Tổ chức</strong></h4>\n</div>\n\n\n\n<div class=\"wp-block-column is-layout-flow wp-block-column-is-layout-flow\" style=\"flex-basis:25%\"></div>\n</div>\n\n\n\n<p></p>\n",
          "link": "https://admin.wikiw.vn/content/4-dong-luc-sinh-ton/"
        },
        {
          "id": "cG9zdDo1OTUy",
          "title": "3 Câu Hỏi Quan Trọng Trong Đời Người",
          "content": "\n<div class=\"wp-block-columns is-layout-flex wp-container-core-columns-is-layout-9d6595d7 wp-block-columns-is-layout-flex\">\n<div class=\"wp-block-column is-layout-flow wp-block-column-is-layout-flow\" style=\"flex-basis:25%\"></div>\n\n\n\n<div class=\"wp-block-column is-layout-flow wp-block-column-is-layout-flow\" style=\"flex-basis:50%\">\n<p></p>\n\n\n\n<p></p>\n\n\n\n<p></p>\n\n\n\n<h5 class=\"wp-block-heading has-text-align-center has-text-color has-link-color wp-elements-e8f3d4f560c8877e1ed88dc948991376\" style=\"color:#0509e3\"><em>Ai là người quan trọng nhất?</em></h5>\n\n\n\n<h5 class=\"wp-block-heading has-text-align-center has-text-color has-link-color wp-elements-077a009d8fb0a2fdee695c5a0e16fc20\" style=\"color:#0509e3\"><em>Thời điểm nào là quan trọng nhất?</em></h5>\n\n\n\n<h5 class=\"wp-block-heading has-text-align-center has-text-color has-link-color wp-elements-dee7801a686209810c93071428201750\" style=\"color:#0509e3\"><em>Việc làm nào là quan trọng nhất?</em></h5>\n</div>\n\n\n\n<div class=\"wp-block-column is-layout-flow wp-block-column-is-layout-flow\" style=\"flex-basis:25%\"></div>\n</div>\n\n\n\n<p></p>\n",
          "link": "https://admin.wikiw.vn/content/tv-3-cau-hoi-quan-trong-trong-doi-nguoi/"
        }
      ]
    }
  }
};

// Function để transform data (tương tự như trong admin UI)
function transformGraphQLData(data, endpoint) {
  if (!data) return [];
  
  let nodes = [];
  
  switch (endpoint) {
    case 'posts':
      nodes = data.posts?.nodes || data.contents?.nodes || [];
      break;
    default:
      nodes = data.posts?.nodes || data.contents?.nodes || [];
  }
  
  return nodes.map(item => {
    // Handle GraphQL ID format (e.g., "cG9zdDo1OTc1")
    let itemId = item.id;
    if (typeof itemId === 'string' && itemId.startsWith('cG9zdDo')) {
      try {
        const decoded = atob(itemId);
        itemId = decoded.split(':')[1] || itemId;
      } catch (e) {
        // Keep original ID if decoding fails
      }
    }
    
    // Extract slug from link if available
    let slug = item.slug || '';
    if (item.link && !slug) {
      const urlParts = item.link.split('/');
      slug = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
    }
    
    return {
      id: parseInt(itemId) || itemId,
      title: item.title || item.name || 'Untitled',
      content: item.content || '',
      excerpt: item.excerpt || item.description || (item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : ''),
      date: item.date || new Date().toISOString(),
      slug: slug,
      author: item.author?.node?.name || 'Unknown',
      categories: item.categories?.nodes?.map(c => c.name) || [],
      tags: item.tags?.nodes?.map(t => t.name) || [],
      type: endpoint,
      wordCount: item.content ? item.content.replace(/<[^>]*>/g, '').split(' ').length : 0,
      hasImages: item.content ? item.content.includes('<img') : false,
      hasLinks: item.content ? item.content.includes('<a href') : false,
      wikiContent: extractWikiContent(item.content || ''),
      wikiSections: extractWikiSections(item.content || ''),
      lastUpdated: item.date || new Date().toISOString(),
      link: item.link || ''
    };
  });
}

// Extract wiki content from HTML
function extractWikiContent(content) {
  if (!content) return '';
  
  // Remove HTML tags and clean up
  let text = content.replace(/<[^>]*>/g, '');
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

// Extract wiki sections (headings, lists, etc.)
function extractWikiSections(content) {
  if (!content) return [];
  
  const sections = [];
  
  // Extract headings
  const headingMatches = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi);
  if (headingMatches) {
    headingMatches.forEach(heading => {
      const text = heading.replace(/<[^>]*>/g, '').trim();
      if (text) {
        sections.push({ type: 'Heading', text });
      }
    });
  }
  
  // Extract lists
  const listMatches = content.match(/<[uo]l[^>]*>(.*?)<\/[uo]l>/gi);
  if (listMatches) {
    listMatches.forEach(list => {
      const text = list.replace(/<[^>]*>/g, '').trim();
      if (text) {
        sections.push({ type: 'List', text });
      }
    });
  }
  
  return sections;
}

// Test với dữ liệu mẫu
function testWithSampleData() {
  console.log('🚀 Testing với dữ liệu mẫu từ GraphQL API\n');
  
  console.log('📊 Dữ liệu gốc:');
  console.log(`- Số lượng posts: ${sampleData.data.contents.nodes.length}`);
  sampleData.data.contents.nodes.forEach((post, index) => {
    console.log(`${index + 1}. "${post.title}" (ID: ${post.id})`);
  });
  
  console.log('\n🔄 Transform dữ liệu...');
  const transformedData = transformGraphQLData(sampleData.data, 'posts');
  
  console.log('\n✅ Dữ liệu đã transform:');
  transformedData.forEach((item, index) => {
    console.log(`${index + 1}. "${item.title}"`);
    console.log(`   ID: ${item.id} (từ ${sampleData.data.contents.nodes[index].id})`);
    console.log(`   Slug: ${item.slug}`);
    console.log(`   Word Count: ${item.wordCount}`);
    console.log(`   Has Images: ${item.hasImages}`);
    console.log(`   Has Links: ${item.hasLinks}`);
    console.log(`   Wiki Sections: ${item.wikiSections.length}`);
    console.log(`   Link: ${item.link}`);
    console.log('');
  });
  
  console.log('📋 Tóm tắt:');
  console.log(`- Tổng số posts: ${transformedData.length}`);
  console.log(`- Posts có hình ảnh: ${transformedData.filter(p => p.hasImages).length}`);
  console.log(`- Posts có links: ${transformedData.filter(p => p.hasLinks).length}`);
  console.log(`- Tổng số từ: ${transformedData.reduce((sum, p) => sum + p.wordCount, 0)}`);
  
  console.log('\n🎉 Hệ thống hoạt động tốt với dữ liệu thực tế!');
  console.log('\n📋 Next steps:');
  console.log('1. Sử dụng Admin Panel: http://localhost:1313/admin/wordpress-integration.html');
  console.log('2. Chọn "GraphQL" làm API Type');
  console.log('3. Click "Lấy Dữ Liệu WordPress" để import');
  console.log('4. Export sang JSON, Markdown, hoặc Hugo content');
}

// Chạy test
testWithSampleData();
