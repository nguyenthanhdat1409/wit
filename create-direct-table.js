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
async function createDirectTable() {
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
</div>

<style>
#table-container table {
  width: 100%;
  border-collapse: collapse;
}

#table-container th,
#table-container td {
  border: 1px solid #ddd;
  padding: 8px;
  vertical-align: top;
}

#table-container th:first-child,
#table-container td:first-child {
  width: 220px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

#table-container th:last-child,
#table-container td:last-child {
  width: auto;
}
</style>`;
    
    // Read current _index.md
    const indexPath = path.join(process.cwd(), 'content', 'TU-KHAINIEM', '_index.md');
    let indexContent = await fs.promises.readFile(indexPath, 'utf8');
    
    // Replace the partial with direct table
    const updatedContent = indexContent.replace(
      '{{ partial "vocabulary-table.html" . }}',
      tableHTML
    );
    
    // Write updated content
    await fs.promises.writeFile(indexPath, updatedContent, 'utf8');
    
    console.log(`✅ Created direct table with ${entries.length} entries`);
    console.log(`📁 Updated: ${indexPath}`);
    
  } catch (error) {
    console.error('❌ Error creating direct table:', error);
  }
}

// Run the function
createDirectTable();
