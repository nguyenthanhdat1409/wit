#!/usr/bin/env node

/**
 * WordPress to Hugo Content Converter
 * 
 * Script này sẽ:
 * 1. Lấy dữ liệu từ WordPress API
 * 2. Trích xuất wiki content
 * 3. Tạo Hugo content files
 * 4. Tự động commit và push
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Cấu hình
const CONFIG = {
  wordpressUrl: process.env.WORDPRESS_URL || '',
  outputDir: './content/wordpress-import',
  endpoint: 'posts',
  perPage: 20,
  categories: [], // Array of category IDs
  tags: [], // Array of tag IDs
  searchQuery: '', // Search query
  dryRun: false // Set to true to preview without creating files
};

/**
 * Fetch data from WordPress API
 */
async function fetchWordPressData() {
  if (!CONFIG.wordpressUrl) {
    throw new Error('WORDPRESS_URL environment variable is required');
  }

  console.log(`🔍 Fetching data from WordPress: ${CONFIG.wordpressUrl}`);
  
  const baseUrl = CONFIG.wordpressUrl.endsWith('/') ? CONFIG.wordpressUrl : `${CONFIG.wordpressUrl}/`;
  const apiUrl = `${baseUrl}wp-json/wp/v2/${CONFIG.endpoint}`;
  
  // Build query parameters
  const params = new URLSearchParams({
    per_page: CONFIG.perPage.toString(),
    ...(CONFIG.categories.length > 0 && { categories: CONFIG.categories.join(',') }),
    ...(CONFIG.tags.length > 0 && { tags: CONFIG.tags.join(',') }),
    ...(CONFIG.searchQuery && { search: CONFIG.searchQuery })
  });

  const url = `${apiUrl}?${params.toString()}`;
  console.log(`📡 API URL: ${url}`);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.length} items from WordPress`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching WordPress data:', error.message);
    throw error;
  }
}

/**
 * Process WordPress data to extract wiki content
 */
function processWikiContent(data) {
  return data.map(post => {
    // Extract main content
    const content = extractWikiContent(post.content?.rendered || '');
    
    // Extract metadata
    const metadata = {
      id: post.id,
      title: post.title?.rendered || '',
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      author: post.author,
      categories: post.categories || [],
      tags: post.tags || [],
      featured_media: post.featured_media,
      excerpt: post.excerpt?.rendered || '',
      status: post.status,
      type: post.type
    };

    // Extract wiki sections
    const wikiSections = extractWikiSections(content);

    return {
      ...metadata,
      wikiContent: content,
      wikiSections,
      wordCount: content.length,
      hasImages: content.includes('<img'),
      hasLinks: content.includes('<a href'),
      lastUpdated: new Date().toISOString()
    };
  });
}

/**
 * Extract wiki content from HTML
 */
function extractWikiContent(htmlContent) {
  if (!htmlContent) return '';
  
  // Remove script and style tags
  let content = htmlContent
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Decode HTML entities
  content = content
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  return content;
}

/**
 * Extract wiki sections from content
 */
function extractWikiSections(content) {
  const sections = [];
  
  // Find heading patterns
  const headingPatterns = [
    /^# (.+)$/gm, // Markdown H1
    /^## (.+)$/gm, // Markdown H2
    /^### (.+)$/gm, // Markdown H3
    /^#### (.+)$/gm, // Markdown H4
    /<h1[^>]*>(.+?)<\/h1>/gi, // HTML H1
    /<h2[^>]*>(.+?)<\/h2>/gi, // HTML H2
    /<h3[^>]*>(.+?)<\/h3>/gi, // HTML H3
    /<h4[^>]*>(.+?)<\/h4>/gi  // HTML H4
  ];

  headingPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      sections.push({
        type: 'heading',
        text: match[1].replace(/<[^>]+>/g, '').trim(),
        level: pattern.source.includes('h1') ? 1 : 
               pattern.source.includes('h2') ? 2 :
               pattern.source.includes('h3') ? 3 : 4
      });
    }
  });

  // Find list items
  const listPattern = /^[\*\-\+]\s+(.+)$/gm;
  let match;
  while ((match = listPattern.exec(content)) !== null) {
    sections.push({
      type: 'list_item',
      text: match[1].trim()
    });
  }

  // Find important paragraphs
  const importantKeywords = ['định nghĩa', 'khái niệm', 'nguyên lý', 'quy luật', 'công thức', 'phương pháp'];
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  
  paragraphs.forEach(paragraph => {
    if (importantKeywords.some(keyword => paragraph.toLowerCase().includes(keyword))) {
      sections.push({
        type: 'important_paragraph',
        text: paragraph.trim(),
        keywords: importantKeywords.filter(keyword => 
          paragraph.toLowerCase().includes(keyword)
        )
      });
    }
  });

  return sections;
}

/**
 * Create Hugo content file
 */
async function createHugoContentFile(item, outputDir) {
  const filename = `${item.slug}.md`;
  const filepath = path.join(outputDir, filename);

  // Create front matter
  const frontMatter = `---
title: "${item.title.replace(/"/g, '\\"')}"
description: "${item.excerpt.replace(/"/g, '\\"').replace(/\n/g, ' ')}"
date: ${item.date}
modified: ${item.modified}
draft: false
tags: [${item.tags.join(', ')}]
categories: [${item.categories.join(', ')}]
author: ${item.author}
slug: ${item.slug}
type: "wordpress-import"
source: "wordpress"
source_url: "${CONFIG.wordpressUrl}/wp-json/wp/v2/posts/${item.id}"
word_count: ${item.wordCount}
has_images: ${item.hasImages}
has_links: ${item.hasLinks}
last_updated: ${item.lastUpdated}
---

# ${item.title}

${item.wikiContent}

${item.wikiSections.length > 0 ? `
## Các Section Trích Xuất

${item.wikiSections.map(section => `### ${section.type}

${section.text}`).join('\n\n')}
` : ''}

---
*Nội dung được trích xuất từ WordPress tại ${CONFIG.wordpressUrl}*
`;

  await fs.writeFile(filepath, frontMatter, 'utf8');
  console.log(`📝 Created: ${filename}`);
  
  return filepath;
}

/**
 * Create index file for WordPress import section
 */
async function createIndexFile(data, outputDir) {
  const indexContent = `---
title: "WordPress Import"
description: "Nội dung được trích xuất từ WordPress"
date: ${new Date().toISOString()}
draft: false
type: "section"
---

# WordPress Import

Tổng cộng ${data.length} bài viết đã được trích xuất từ WordPress.

## Thống kê

- **Tổng số bài:** ${data.length}
- **Tổng số từ:** ${data.reduce((sum, item) => sum + item.wordCount, 0)}
- **Có hình ảnh:** ${data.filter(item => item.hasImages).length}
- **Có liên kết:** ${data.filter(item => item.hasLinks).length}

## Danh sách bài viết

${data.map(item => `- [${item.title}](./${item.slug}) - ${new Date(item.date).toLocaleDateString('vi-VN')}`).join('\n')}

---
*Cập nhật lần cuối: ${new Date().toLocaleString('vi-VN')}*
`;

  const indexPath = path.join(outputDir, '_index.md');
  await fs.writeFile(indexPath, indexContent, 'utf8');
  console.log(`📝 Created: _index.md`);
}

/**
 * Git operations
 */
async function gitOperations() {
  if (CONFIG.dryRun) {
    console.log('🔍 Dry run mode - skipping git operations');
    return;
  }

  try {
    // Add files
    console.log('📦 Adding files to git...');
    execSync('git add .', { stdio: 'inherit' });

    // Commit
    const commitMessage = `feat: Import WordPress content - ${new Date().toISOString()}`;
    console.log(`💾 Committing: ${commitMessage}`);
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

    // Push
    console.log('🚀 Pushing to remote...');
    execSync('git push', { stdio: 'inherit' });

    console.log('✅ Git operations completed successfully');
  } catch (error) {
    console.error('❌ Git operations failed:', error.message);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 WordPress to Hugo Content Converter');
  console.log('=====================================');

  try {
    // Create output directory
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    console.log(`📁 Output directory: ${CONFIG.outputDir}`);

    // Fetch WordPress data
    const rawData = await fetchWordPressData();
    
    // Process data
    const processedData = processWikiContent(rawData);
    console.log(`🔄 Processed ${processedData.length} items`);

    // Create Hugo content files
    const createdFiles = [];
    for (const item of processedData) {
      const filepath = await createHugoContentFile(item, CONFIG.outputDir);
      createdFiles.push(filepath);
    }

    // Create index file
    await createIndexFile(processedData, CONFIG.outputDir);

    // Git operations
    await gitOperations();

    console.log('✅ WordPress to Hugo conversion completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Total files created: ${createdFiles.length + 1}`);
    console.log(`   - Output directory: ${CONFIG.outputDir}`);
    console.log(`   - Git operations: ${CONFIG.dryRun ? 'Skipped (dry run)' : 'Completed'}`);

  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url':
        CONFIG.wordpressUrl = args[++i];
        break;
      case '--endpoint':
        CONFIG.endpoint = args[++i];
        break;
      case '--per-page':
        CONFIG.perPage = parseInt(args[++i]);
        break;
      case '--categories':
        CONFIG.categories = args[++i].split(',').map(id => parseInt(id.trim()));
        break;
      case '--tags':
        CONFIG.tags = args[++i].split(',').map(id => parseInt(id.trim()));
        break;
      case '--search':
        CONFIG.searchQuery = args[++i];
        break;
      case '--output':
        CONFIG.outputDir = args[++i];
        break;
      case '--dry-run':
        CONFIG.dryRun = true;
        break;
      case '--help':
        console.log(`
WordPress to Hugo Content Converter

Usage: node wordpress-to-hugo.js [options]

Options:
  --url <url>           WordPress site URL (required)
  --endpoint <type>     API endpoint (default: posts)
  --per-page <number>   Items per page (default: 20)
  --categories <ids>    Comma-separated category IDs
  --tags <ids>          Comma-separated tag IDs
  --search <query>      Search query
  --output <dir>        Output directory (default: ./content/wordpress-import)
  --dry-run             Preview without creating files
  --help                Show this help

Examples:
  node wordpress-to-hugo.js --url https://example.com
  node wordpress-to-hugo.js --url https://example.com --categories 1,2,3 --per-page 50
  node wordpress-to-hugo.js --url https://example.com --search "tutorial" --dry-run
        `);
        process.exit(0);
    }
  }

  // Validate required parameters
  if (!CONFIG.wordpressUrl) {
    console.error('❌ Error: WordPress URL is required');
    console.error('Use --url <url> or set WORDPRESS_URL environment variable');
    process.exit(1);
  }

  main();
}

module.exports = {
  fetchWordPressData,
  processWikiContent,
  createHugoContentFile,
  gitOperations
};
