const fs = require('fs');
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

// Extract content preview (first 10 characters)
function getContentPreview(content) {
  if (!content || content.trim().length === 0) {
    return '';
  }
  const preview = content.trim().substring(0, 10);
  return preview ? preview + '...' : '';
}

// Read vocabulary files and generate table
async function generateVocabularyTable() {
  try {
    const vocabDir = path.join(process.cwd(), 'content', 'TU-KHAINIEM');
    const entries = [];
    
    // Read all directories in TU-KHAINIEM
    const items = await fs.promises.readdir(vocabDir, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isDirectory() && item.name !== '_index') {
        const indexPath = path.join(vocabDir, item.name, '_index.md');
        
        try {
          const content = await fs.promises.readFile(indexPath, 'utf8');
          
          // Extract title and content from frontmatter and content
          const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
          const contentMatch = content.match(/---\s*\n[\s\S]*?\n---\s*\n([\s\S]*)/);
          
          if (titleMatch) {
            const title = titleMatch[1];
            const fullContent = contentMatch ? contentMatch[1].trim() : '';
            const preview = getContentPreview(fullContent);
            
            entries.push({
              title: title,
              slug: item.name,
              preview: preview
            });
          }
        } catch (error) {
          console.warn(`Warning: Could not read ${indexPath}:`, error.message);
        }
      }
    }
    
    // Sort entries by title
    entries.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    
    // Generate HTML table
    let tableHTML = `<div id="table-container">
  <table>
    <thead>
      <tr>
        <th>Từ vựng</th>
        <th>Khái niệm</th>
      </tr>
    </thead>
    <tbody>`;
    
    entries.forEach(entry => {
      tableHTML += `
      <tr>
        <td><a href="/tu-khainiem/${entry.slug}/">${entry.title}</a></td>
        <td>${entry.preview}</td>
      </tr>`;
    });
    
    tableHTML += `
    </tbody>
  </table>
</div>`;
    
    // Write to file
    const outputPath = path.join(process.cwd(), 'vocabulary-table.html');
    await fs.promises.writeFile(outputPath, tableHTML, 'utf8');
    
    console.log(`✅ Generated vocabulary table with ${entries.length} entries`);
    console.log(`📁 Output file: ${outputPath}`);
    
    // Also generate markdown format
    let markdownTable = `| Từ vựng | Khái niệm |\n|---------|----------|\n`;
    entries.forEach(entry => {
      markdownTable += `| [${entry.title}](/tu-khainiem/${entry.slug}/) | ${entry.preview} |\n`;
    });
    
    const markdownPath = path.join(process.cwd(), 'vocabulary-table.md');
    await fs.promises.writeFile(markdownPath, markdownTable, 'utf8');
    
    console.log(`📁 Markdown file: ${markdownPath}`);
    
  } catch (error) {
    console.error('❌ Error generating vocabulary table:', error);
  }
}

// Run the function
generateVocabularyTable();
