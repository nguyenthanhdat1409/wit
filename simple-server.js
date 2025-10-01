const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

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

// Trigger Hugo rebuild
async function triggerHugoRebuild() {
  try {
    console.log('🔄 [DEBUG] Triggering Hugo rebuild...');
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    // Run Hugo build command
    await execPromise('hugo --quiet');
    console.log('✅ [DEBUG] Hugo rebuild completed successfully');
  } catch (error) {
    console.warn('⚠️ [DEBUG] Hugo rebuild failed:', error.message);
    // Don't throw error, just log warning
  }
}

// Update HINH index
async function updateHinhIndex(diagramData) {
  try {
    console.log('🔍 [DEBUG] Starting updateHinhIndex for:', diagramData.title);
    const indexPath = path.join(process.cwd(), 'content', 'HINH', '_index.md');
    console.log('📁 [DEBUG] HINH Index file path:', indexPath);
    
    // Read current index file
    let indexContent = await fs.readFile(indexPath, 'utf8');
    console.log('📄 [DEBUG] Index file size:', indexContent.length, 'characters');
    
    // Generate new image card HTML
    const newImageCard = `
  <div class="image-card">
    <img src="${diagramData.imageUrl}" alt="${diagramData.title}">
    <p>${diagramData.title}</p>
    <div class="buttons">
      <a href="${diagramData.conceptLink || '/'}">Khái Niệm</a>
      <a href="${diagramData.lessonLink || '/'}">Bài Học</a>
    </div>
  </div>`;
    
    // Find the closing div tag and add new card before it
    const closingDivPattern = /<\/div>\s*$/;
    if (closingDivPattern.test(indexContent)) {
      indexContent = indexContent.replace(closingDivPattern, `${newImageCard}\n</div>`);
    } else {
      // If no closing div found, add before the last </div>
      const lastDivIndex = indexContent.lastIndexOf('</div>');
      if (lastDivIndex !== -1) {
        indexContent = indexContent.substring(0, lastDivIndex) + 
                      newImageCard + '\n' + 
                      indexContent.substring(lastDivIndex);
      } else {
        // Fallback: add at the end
        indexContent += newImageCard;
      }
    }
    
    // Write updated content
    await fs.writeFile(indexPath, indexContent, 'utf8');
    console.log('✅ Updated HINH index with new diagram:', diagramData.title);
  } catch (error) {
    console.warn('⚠️ Failed to update HINH index:', error.message);
    console.error('❌ [DEBUG] Full error:', error);
    // Don't throw error, just log warning
  }
}

// Update main tu-khainiem index
async function updateTuKhaiNiemIndex(vocabData) {
  try {
    console.log('🔍 [DEBUG] Starting updateTuKhaiNiemIndex for:', vocabData.title);
    console.log('🔍 [DEBUG] Full vocabData:', JSON.stringify(vocabData, null, 2));
    const indexPath = path.join(process.cwd(), 'content', 'TU-KHAINIEM', '_index.md');
    console.log('📁 [DEBUG] Index file path:', indexPath);
    
    // Read current index file
    let indexContent = await fs.readFile(indexPath, 'utf8');
    console.log('📄 [DEBUG] Index file size:', indexContent.length, 'characters');
    
    // Extract content preview (first 50 characters)
    const contentPreview = vocabData.content.trim().substring(0, 50);
    const previewText = contentPreview ? contentPreview + '...' : '';
    console.log('📝 [DEBUG] Content preview:', previewText);
    
    // Generate slug if not provided
    const slug = vocabData.slug || generateSlug(vocabData.title);
    console.log('🔗 [DEBUG] Using slug:', slug);
    
    // Create new entry
    const newEntry = `|| [${vocabData.title}](${slug}/) | ${previewText} |`;
    console.log('➕ [DEBUG] New entry to add:', newEntry);
    
    // Find the last table row and add new entry
    // Look for the pattern: || [Some Title](some-slug/) | Some content... |
    // Try multiple patterns to find the right location
    let match = null;
    
    // Pattern 1: Find the very last table row (most flexible)
    const pattern1 = /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\s*\n\s*<\/div>)/;
    match = indexContent.match(pattern1);
    
    // Pattern 2: Find last table row before <script>
    if (!match) {
      const pattern2 = /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\s*\n\s*<script>)/;
      match = indexContent.match(pattern2);
    }
    
    // Pattern 3: Find last table row before </div> or <script>
    if (!match) {
      const pattern3 = /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\s*\n\s*(<\/div>|<script>))/;
      match = indexContent.match(pattern3);
    }
    
    // Pattern 4: Find the very last table row (no matter what comes after)
    if (!match) {
      const allTableRows = indexContent.match(/\|\| \[.*?\]\(.*?\/\) \| .*? \|/g);
      if (allTableRows && allTableRows.length > 0) {
        const lastRow = allTableRows[allTableRows.length - 1];
        const lastRowIndex = indexContent.lastIndexOf(lastRow);
        const afterLastRow = indexContent.substring(lastRowIndex + lastRow.length);
        console.log('🔍 [DEBUG] After last table row:', afterLastRow.substring(0, 100));
        
        // Create a simple replacement pattern
        const simplePattern = new RegExp(`(${lastRow.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(.*)$`);
        match = indexContent.match(simplePattern);
        console.log('🔍 [DEBUG] Simple pattern match:', match ? 'FOUND' : 'NOT FOUND');
      }
    }
    console.log('🔍 [DEBUG] Regex match result:', match ? 'FOUND' : 'NOT FOUND');
    
    if (match) {
      console.log('✅ [DEBUG] Found matching pattern, updating file...');
      // Add new entry after the last row
      const updatedContent = indexContent.replace(lastRowRegex, `$1\n${newEntry}$2`);
      
      // Write updated content
      await fs.writeFile(indexPath, updatedContent, 'utf8');
      console.log('✅ Updated tu-khainiem index:', newEntry);
    } else {
      console.warn('⚠️ Could not find table pattern in tu-khainiem index');
      console.log('🔍 [DEBUG] Last 200 characters of file:');
      console.log(indexContent.substring(indexContent.length - 200));
      console.log('🔍 [DEBUG] Looking for pattern: || [Title](slug/) | content |');
      
      // Find all table rows to understand the structure
      const allTableRows = indexContent.match(/\|\| \[.*?\]\(.*?\/\) \| .*? \|/g);
      console.log('🔍 [DEBUG] Found table rows:', allTableRows ? allTableRows.length : 0);
      if (allTableRows && allTableRows.length > 0) {
        console.log('🔍 [DEBUG] Last 3 table rows:');
        allTableRows.slice(-3).forEach((row, index) => {
          console.log(`  ${allTableRows.length - 3 + index + 1}: ${row}`);
        });
      }
      
      // Try to find where the table ends
      const tableEndPatterns = [
        /<\/div>/g,
        /<script>/g,
        /<style>/g
      ];
      
      tableEndPatterns.forEach((pattern, index) => {
        const matches = [...indexContent.matchAll(pattern)];
        console.log(`🔍 [DEBUG] Pattern ${index + 1} matches:`, matches.length);
        if (matches.length > 0) {
          console.log(`🔍 [DEBUG] Last match position:`, matches[matches.length - 1].index);
        }
      });
    }
  } catch (error) {
    console.warn('⚠️ Failed to update tu-khainiem index:', error.message);
    console.error('❌ [DEBUG] Full error:', error);
    // Don't throw error, just log warning
  }
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

const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  
  // Health check endpoint
  if (parsedUrl.pathname === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'OK', message: 'API server is running' }));
    return;
  }

  // Get vocabulary data endpoint
  if (parsedUrl.pathname.startsWith('/api/get-vocabulary/') && req.method === 'GET') {
    try {
      const slug = parsedUrl.pathname.split('/').pop();
      
      if (!slug) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: 'Slug is required' }));
        return;
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
        
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: vocabularyData
        }));
      } catch (error) {
        console.error('Error reading vocabulary file:', error);
        res.writeHead(404);
        res.end(JSON.stringify({
          success: false,
          error: 'Vocabulary not found'
        }));
      }
    } catch (error) {
      console.error('Error handling request:', error);
      res.writeHead(500);
      res.end(JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      }));
    }
  }
  // Update vocabulary endpoint
  else if (parsedUrl.pathname === '/api/update-vocabulary' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const vocabData = JSON.parse(body);
          
          // Validate data
          if (!vocabData.slug) {
            res.writeHead(400);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Slug is required'
            }));
            return;
          }
          
          if (!vocabData.title || vocabData.title.trim().length === 0) {
            res.writeHead(400);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Tiêu đề không được để trống'
            }));
            return;
          }
          
          if (!vocabData.content || vocabData.content.trim().length === 0) {
            res.writeHead(400);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Nội dung không được để trống'
            }));
            return;
          }
          
          const slug = vocabData.slug;
          const date = new Date().toISOString().split('T')[0];
          
          // Check if vocabulary exists
          const vocabPath = path.join(process.cwd(), 'content', 'TU-KHAINIEM', slug, '_index.md');
          try {
            await fs.access(vocabPath);
          } catch (error) {
            res.writeHead(404);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Vocabulary not found'
            }));
            return;
          }
          
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
          
          // Write file
          await fs.writeFile(vocabPath, markdownContent, { encoding: 'utf8' });
          console.log('✅ Updated vocabulary file:', vocabPath);
          
          // Auto commit and push to Git
          const { exec } = require('child_process');
          const util = require('util');
          const execPromise = util.promisify(exec);
          
          try {
            // Add file to git
            await execPromise(`git add "${vocabPath}"`);
            console.log('✅ Git add:', vocabPath);
            
            // Commit
            const commitMessage = `feat: update vocabulary "${vocabData.title}"`;
            await execPromise(`git commit -m "${commitMessage}"`);
            console.log('✅ Git commit:', commitMessage);
            
            // Push
            await execPromise('git push');
            console.log('✅ Git push: pushed to remote');
          } catch (gitError) {
            console.warn('⚠️ Git operation failed:', gitError.message);
            // Continue even if git fails
          }
          
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            data: {
              title: vocabData.title,
              slug: slug,
              filePath: `content/TU-KHAINIEM/${slug}/_index.md`,
              url: `/tu-khainiem/${slug}/`
            },
            message: 'Từ vựng đã được cập nhật thành công!'
          }));
        } catch (error) {
          console.error('Error updating vocabulary:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ 
            success: false,
            error: 'Lỗi server',
            message: error.message
          }));
        }
      });
    } catch (error) {
      console.error('Error handling request:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ 
        success: false,
        error: 'Lỗi server',
        message: error.message
      }));
    }
  }
  // Create vocabulary endpoint
  else if (parsedUrl.pathname === '/api/create-vocabulary' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const vocabData = JSON.parse(body);
          
          // Validate data
          if (!vocabData.title || vocabData.title.trim().length === 0) {
            res.writeHead(400);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Tiêu đề không được để trống'
            }));
            return;
          }
          
          if (!vocabData.content || vocabData.content.trim().length === 0) {
            res.writeHead(400);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Nội dung không được để trống'
            }));
            return;
          }

          // Generate slug
          const slug = generateSlug(vocabData.title);
          const date = new Date().toISOString().split('T')[0];
          
          // Check if vocabulary already exists
          const vocabPath = path.join(process.cwd(), 'content', 'TU-KHAINIEM', slug, '_index.md');
          try {
            await fs.access(vocabPath);
            res.writeHead(409);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Từ vựng đã tồn tại',
              slug: slug
            }));
            return;
          } catch (error) {
            // File doesn't exist, continue
          }
          
          // Create directory
          const dirPath = path.join(process.cwd(), 'content', 'TU-KHAINIEM', slug);
          await fs.mkdir(dirPath, { recursive: true });
          console.log('✅ Created directory:', dirPath);
          
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
          
          // Write file with UTF-8 encoding (no BOM)
          await fs.writeFile(vocabPath, markdownContent, { encoding: 'utf8' });
          console.log('✅ Created vocabulary file:', vocabPath);
          
          // Update main tu-khainiem index
          console.log('🔄 [DEBUG] About to call updateTuKhaiNiemIndex...');
          await updateTuKhaiNiemIndex(vocabData);
          console.log('✅ [DEBUG] updateTuKhaiNiemIndex completed');
          
          // Trigger Hugo rebuild
          await triggerHugoRebuild();
          
          // Auto commit and push to Git
          const { exec } = require('child_process');
          const util = require('util');
          const execPromise = util.promisify(exec);
          
          try {
            // Add file to git
            await execPromise(`git add "${vocabPath}"`);
            console.log('✅ Git add:', vocabPath);
            
            // Commit
            const commitMessage = `feat: add vocabulary "${vocabData.title}"`;
            await execPromise(`git commit -m "${commitMessage}"`);
            console.log('✅ Git commit:', commitMessage);
            
            // Push
            await execPromise('git push');
            console.log('✅ Git push: pushed to remote');
          } catch (gitError) {
            console.warn('⚠️ Git operation failed:', gitError.message);
            // Continue even if git fails
          }
          
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            data: {
              title: vocabData.title,
              slug: slug,
              filePath: `content/TU-KHAINIEM/${slug}/_index.md`,
              url: `/tu-khainiem/${slug}/`
            },
            message: 'Từ vựng đã được tạo và commit vào Git thành công!'
          }));
        } catch (error) {
          console.error('Error creating vocabulary:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ 
            success: false,
            error: 'Lỗi server',
            message: error.message
          }));
        }
      });
    } catch (error) {
      console.error('Error handling request:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ 
        success: false,
        error: 'Lỗi server',
        message: error.message
      }));
    }
  }
  // Create lesson endpoint
  else if (parsedUrl.pathname === '/api/create-lesson' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const lessonData = JSON.parse(body);
          
          // Validate data
          const validationErrors = validateLessonData(lessonData);
          if (validationErrors.length > 0) {
            res.writeHead(400);
            res.end(JSON.stringify({ 
              error: 'Validation failed',
              details: validationErrors
            }));
            return;
          }

          // Generate slug
          const slug = generateSlug(lessonData.title);
          
          // Check if lesson already exists
          const lessonPath = path.join(process.cwd(), 'content', 'BAI-HOC', slug, 'index.md');
          try {
            await fs.access(lessonPath);
            res.writeHead(409);
            res.end(JSON.stringify({ 
              error: 'Lesson already exists',
              slug: slug
            }));
            return;
          } catch (error) {
            // File doesn't exist, continue
          }
          
          // Create lesson file
          const result = await createLessonFile(slug, lessonData);
          
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            slug: slug,
            url: `/bai-hoc/${slug}/`,
            message: 'Bài học đã được tạo thành công!'
          }));
        } catch (error) {
          console.error('Error creating lesson:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ 
            error: 'Internal server error',
            message: error.message
          }));
        }
      });
    } catch (error) {
      console.error('Error handling request:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      }));
    }
  }
  // Create diagram endpoint
  else if (parsedUrl.pathname === '/api/create-diagram' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          console.log('🔍 [DEBUG] Raw body:', body);
          
          // Parse JSON data (simplified version without formidable)
          const diagramData = JSON.parse(body);
          console.log('🔍 [DEBUG] Parsed data:', diagramData);
          
          const imageTitle = diagramData.imageTitle;
          const conceptLink = diagramData.conceptLink || '';
          const lessonLink = diagramData.lessonLink || '';
          const imageUrl = diagramData.imageUrl || '';
          
          // Validate required fields
          if (!imageTitle || imageTitle.trim().length === 0) {
            res.writeHead(400);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Tên hình không được để trống'
            }));
            return;
          }
          
          if (!imageUrl || imageUrl.trim().length === 0) {
            res.writeHead(400);
            res.end(JSON.stringify({ 
              success: false,
              error: 'URL hình ảnh không được để trống'
            }));
            return;
          }
          
          // Generate slug for the diagram
          const slug = generateSlug(imageTitle);
          const date = new Date().toISOString().split('T')[0];
          
          console.log('🔍 [DEBUG] Creating diagram with slug:', slug);
          
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
          
          // Create diagram file
          const diagramPath = path.join(process.cwd(), 'content', 'HINH', `${slug}.md`);
          console.log('📝 [DEBUG] Creating file at:', diagramPath);
          await fs.writeFile(diagramPath, markdownContent, { encoding: 'utf8' });
          console.log('✅ [SUCCESS] Created diagram file:', diagramPath);
          
          // Update HINH index
          console.log('🔄 [DEBUG] Updating HINH index...');
          await updateHinhIndex({
            title: imageTitle,
            slug: slug,
            imageUrl: imageUrl,
            conceptLink: conceptLink,
            lessonLink: lessonLink
          });
          console.log('✅ [SUCCESS] Updated HINH index');
          
          // Trigger Hugo rebuild
          console.log('🔨 [DEBUG] Triggering Hugo rebuild...');
          await triggerHugoRebuild();
          console.log('✅ [SUCCESS] Hugo rebuild completed');
          
          // Auto commit and push to Git
          const { exec } = require('child_process');
          const util = require('util');
          const execPromise = util.promisify(exec);
          
          try {
            await execPromise(`git add "${diagramPath}"`);
            console.log('✅ Git add: added diagram file');
            
            // Commit
            const commitMessage = `feat: add diagram "${imageTitle}"`;
            await execPromise(`git commit -m "${commitMessage}"`);
            console.log('✅ Git commit:', commitMessage);
            
            // Push
            await execPromise('git push');
            console.log('✅ Git push: pushed to remote');
          } catch (gitError) {
            console.warn('⚠️ Git operation failed:', gitError.message);
            // Continue even if git fails
          }
          
          const responseData = {
            success: true,
            data: {
              title: imageTitle,
              slug: slug,
              imageUrl: imageUrl,
              conceptLink: conceptLink,
              lessonLink: lessonLink,
              filePath: `content/HINH/${slug}.md`,
              url: `/hinh/`,
              created: true,
              indexed: true,
              rebuilt: true
            },
            message: 'Đồ hình đã được tạo thành công!'
          };
          
          console.log('📤 [DEBUG] Sending response:', responseData);
          res.writeHead(200);
          res.end(JSON.stringify(responseData));
        } catch (error) {
          console.error('Error creating diagram:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ 
            success: false,
            error: 'Lỗi server',
            message: error.message
          }));
        }
      });
    } catch (error) {
      console.error('Error handling request:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ 
        success: false,
        error: 'Lỗi server',
        message: error.message
      }));
    }
  }
  // Create lesson new endpoint
  else if (parsedUrl.pathname === '/api/create-lesson-new' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const lessonData = JSON.parse(body);
          
          // Validate required fields
          if (!lessonData.title || lessonData.title.trim().length === 0) {
            res.writeHead(400);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Tên bài học không được để trống'
            }));
            return;
          }
          
          // Generate slug and markdown
          const slug = generateSlug(lessonData.title);
          const date = new Date().toISOString().split('T')[0];
          
          // Generate markdown content with proper HTML structure
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

          // Create file
          const lessonPath = path.join(process.cwd(), 'content', 'BAI-HOC', slug, '_index.md');
          const dirPath = path.dirname(lessonPath);
          await fs.mkdir(dirPath, { recursive: true });
          await fs.writeFile(lessonPath, markdown, { encoding: 'utf8' });
          console.log('✅ Created lesson file:', lessonPath);
          
          // Trigger Hugo rebuild
          await triggerHugoRebuild();
          
          // Auto commit and push to Git
          const { exec } = require('child_process');
          const util = require('util');
          const execPromise = util.promisify(exec);
          
          try {
            await execPromise(`git add "${lessonPath}"`);
            console.log('✅ Git add:', lessonPath);
            
            const commitMessage = `feat: add lesson "${lessonData.title}"`;
            await execPromise(`git commit -m "${commitMessage}"`);
            console.log('✅ Git commit:', commitMessage);
            
            await execPromise('git push');
            console.log('✅ Git push: pushed to remote');
          } catch (gitError) {
            console.warn('⚠️ Git operation failed:', gitError.message);
          }
          
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            data: {
              title: lessonData.title,
              slug: slug,
              filePath: `content/BAI-HOC/${slug}/_index.md`,
              url: `/bai-hoc/${slug}/`,
              created: true
            },
            message: 'Bài học đã được tạo thành công!',
            url: `/bai-hoc/${slug}/`
          }));
        } catch (error) {
          console.error('Error creating lesson:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ 
            success: false,
            error: 'Lỗi server',
            message: error.message
          }));
        }
      });
    } catch (error) {
      console.error('Error handling request:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ 
        success: false,
        error: 'Lỗi server',
        message: error.message
      }));
    }
  } else if (parsedUrl.pathname === '/api/delete-diagram' && req.method === 'POST') {
    // Delete diagram endpoint
    try {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const { id } = JSON.parse(body);
          
          if (!id) {
            res.writeHead(400);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Thiếu ID đồ hình'
            }));
            return;
          }

          // Find and delete diagram file
          const diagramPath = `content/HINH/${id}.md`;
          const fullPath = path.join(__dirname, diagramPath);
          
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`✅ Deleted diagram file: ${fullPath}`);
            
            // Trigger Hugo rebuild
            console.log('🔄 [DEBUG] Triggering Hugo rebuild...');
            try {
              const { exec } = require('child_process');
              exec('hugo', { cwd: __dirname }, (error, stdout, stderr) => {
                if (error) {
                  console.error('❌ Hugo rebuild failed:', error);
                } else {
                  console.log('✅ [DEBUG] Hugo rebuild completed successfully');
                }
              });
            } catch (hugoError) {
              console.error('❌ Hugo rebuild error:', hugoError);
            }

            // Git operations
            try {
              const { exec } = require('child_process');
              exec(`git add ${diagramPath}`, { cwd: __dirname }, (error, stdout, stderr) => {
                if (error) {
                  console.error('⚠️ Git add failed:', error);
                } else {
                  console.log(`✅ Git add: ${fullPath}`);
                }
              });
              
              exec(`git commit -m "feat: delete diagram \\"${id}\\""`, { cwd: __dirname }, (error, stdout, stderr) => {
                if (error) {
                  console.error('⚠️ Git commit failed:', error);
                } else {
                  console.log('✅ Git commit successful');
                }
              });
            } catch (gitError) {
              console.error('⚠️ Git operation failed:', gitError);
            }

            res.writeHead(200);
            res.end(JSON.stringify({ 
              success: true,
              message: 'Đồ hình đã được xóa thành công!',
              deleted: id
            }));
          } else {
            res.writeHead(404);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Không tìm thấy đồ hình'
            }));
          }
        } catch (error) {
          console.error('Error deleting diagram:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ 
            success: false,
            error: 'Lỗi server',
            message: error.message
          }));
        }
      });
    } catch (error) {
      console.error('Error handling delete diagram request:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ 
        success: false,
        error: 'Lỗi server',
        message: error.message
      }));
    }
  } else if (parsedUrl.pathname === '/api/delete-lesson' && req.method === 'POST') {
    // Delete lesson endpoint
    try {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const { id } = JSON.parse(body);
          
          if (!id) {
            res.writeHead(400);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Thiếu ID bài học'
            }));
            return;
          }

          // Find and delete lesson directory
          const lessonPath = `content/BAI-HOC/${id}`;
          const fullPath = path.join(__dirname, lessonPath);
          
          if (fs.existsSync(fullPath)) {
            // Remove directory recursively
            fs.rmSync(fullPath, { recursive: true, force: true });
            console.log(`✅ Deleted lesson directory: ${fullPath}`);
            
            // Trigger Hugo rebuild
            console.log('🔄 [DEBUG] Triggering Hugo rebuild...');
            try {
              const { exec } = require('child_process');
              exec('hugo', { cwd: __dirname }, (error, stdout, stderr) => {
                if (error) {
                  console.error('❌ Hugo rebuild failed:', error);
                } else {
                  console.log('✅ [DEBUG] Hugo rebuild completed successfully');
                }
              });
            } catch (hugoError) {
              console.error('❌ Hugo rebuild error:', hugoError);
            }

            // Git operations
            try {
              const { exec } = require('child_process');
              exec(`git add ${lessonPath}`, { cwd: __dirname }, (error, stdout, stderr) => {
                if (error) {
                  console.error('⚠️ Git add failed:', error);
                } else {
                  console.log(`✅ Git add: ${fullPath}`);
                }
              });
              
              exec(`git commit -m "feat: delete lesson \\"${id}\\""`, { cwd: __dirname }, (error, stdout, stderr) => {
                if (error) {
                  console.error('⚠️ Git commit failed:', error);
                } else {
                  console.log('✅ Git commit successful');
                }
              });
            } catch (gitError) {
              console.error('⚠️ Git operation failed:', gitError);
            }

            res.writeHead(200);
            res.end(JSON.stringify({ 
              success: true,
              message: 'Bài học đã được xóa thành công!',
              deleted: id
            }));
          } else {
            res.writeHead(404);
            res.end(JSON.stringify({ 
              success: false,
              error: 'Không tìm thấy bài học'
            }));
          }
        } catch (error) {
          console.error('Error deleting lesson:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ 
            success: false,
            error: 'Lỗi server',
            message: error.message
          }));
        }
      });
    } catch (error) {
      console.error('Error handling delete lesson request:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ 
        success: false,
        error: 'Lỗi server',
        message: error.message
      }));
    }
  } else if (parsedUrl.pathname === '/api/list-lessons' && req.method === 'GET') {
    // List all lessons
    try {
      const lessonsDir = path.join(__dirname, 'content/BAI-HOC');
      const lessons = [];
      
      if (fs.existsSync(lessonsDir)) {
        const dirs = fs.readdirSync(lessonsDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);
        
        for (const dir of dirs) {
          const indexPath = path.join(lessonsDir, dir, '_index.md');
          if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf8');
            const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
            const dateMatch = content.match(/date:\s*([^\n]+)/);
            
            lessons.push({
              id: dir,
              title: titleMatch ? titleMatch[1] : dir,
              date: dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0],
              status: 'published'
            });
          }
        }
      }
      
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, lessons }));
    } catch (error) {
      console.error('Error listing lessons:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  } else if (parsedUrl.pathname === '/api/list-diagrams' && req.method === 'GET') {
    // List all diagrams
    try {
      const diagramsDir = path.join(__dirname, 'content/HINH');
      const diagrams = [];
      
      if (fs.existsSync(diagramsDir)) {
        const files = fs.readdirSync(diagramsDir)
          .filter(file => file.endsWith('.md') && file !== '_index.md');
        
        for (const file of files) {
          const filePath = path.join(diagramsDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
          const dateMatch = content.match(/date:\s*([^\n]+)/);
          
          diagrams.push({
            id: file.replace('.md', ''),
            title: titleMatch ? titleMatch[1] : file.replace('.md', ''),
            date: dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0]
          });
        }
      }
      
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, diagrams }));
    } catch (error) {
      console.error('Error listing diagrams:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Create diagram: http://localhost:${PORT}/api/create-diagram`);
  console.log(`\nServer is ready to receive requests!\n`);
});
