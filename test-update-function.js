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
    console.log('📄 [DEBUG] Last 500 characters of file:');
    console.log(indexContent.substring(indexContent.length - 500));
    
    // Extract content preview (first 10 characters)
    const contentPreview = vocabData.content.trim().substring(0, 10);
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
    console.log('🔍 [DEBUG] Pattern 1 result:', match ? 'FOUND' : 'NOT FOUND');
    if (match) console.log('🔍 [DEBUG] Pattern 1 match:', match[1]);
    
    // Pattern 2: Find last table row before <script>
    if (!match) {
      const pattern2 = /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\s*\n\s*<script>)/;
      match = indexContent.match(pattern2);
      console.log('🔍 [DEBUG] Pattern 2 result:', match ? 'FOUND' : 'NOT FOUND');
      if (match) console.log('🔍 [DEBUG] Pattern 2 match:', match[1]);
    }
    
    // Pattern 3: Find last table row before </div> or <script>
    if (!match) {
      const pattern3 = /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\s*\n\s*(<\/div>|<script>))/;
      match = indexContent.match(pattern3);
      console.log('🔍 [DEBUG] Pattern 3 result:', match ? 'FOUND' : 'NOT FOUND');
      if (match) console.log('🔍 [DEBUG] Pattern 3 match:', match[1]);
    }
    
    // Pattern 4: Find the very last table row (no matter what comes after)
    if (!match) {
      console.log('🔍 [DEBUG] Trying Pattern 4...');
      const allTableRows = indexContent.match(/\|\| \[.*?\]\(.*?\/\) \| .*? \|/g);
      console.log('🔍 [DEBUG] Found table rows:', allTableRows ? allTableRows.length : 0);
      if (allTableRows && allTableRows.length > 0) {
        const lastRow = allTableRows[allTableRows.length - 1];
        console.log('🔍 [DEBUG] Last table row:', lastRow);
        const lastRowIndex = indexContent.lastIndexOf(lastRow);
        const afterLastRow = indexContent.substring(lastRowIndex + lastRow.length);
        console.log('🔍 [DEBUG] After last table row:', afterLastRow.substring(0, 100));
        
        // Create a simple replacement pattern
        const simplePattern = new RegExp(`(${lastRow.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(.*)$`);
        match = indexContent.match(simplePattern);
        console.log('🔍 [DEBUG] Simple pattern match:', match ? 'FOUND' : 'NOT FOUND');
        if (match) console.log('🔍 [DEBUG] Pattern 4 match:', match[1]);
      }
    }
    console.log('🔍 [DEBUG] Regex match result:', match ? 'FOUND' : 'NOT FOUND');
    
    if (match) {
      console.log('✅ [DEBUG] Found matching pattern, updating file...');
      console.log('✅ [DEBUG] Match groups:', match[1], '|', match[2]);
      // Add new entry after the last row
      const updatedContent = indexContent.replace(match[0], `${match[1]}\n${newEntry}${match[2]}`);
      console.log('✅ [DEBUG] Updated content preview (last 200 chars):');
      console.log(updatedContent.substring(updatedContent.length - 200));
      
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
        
        // Try to manually add the entry
        console.log('🔍 [DEBUG] Attempting manual insertion...');
        const lastRow = allTableRows[allTableRows.length - 1];
        const lastRowIndex = indexContent.lastIndexOf(lastRow);
        const beforeLastRow = indexContent.substring(0, lastRowIndex + lastRow.length);
        const afterLastRow = indexContent.substring(lastRowIndex + lastRow.length);
        
        const updatedContent = beforeLastRow + '\n' + newEntry + afterLastRow;
        await fs.writeFile(indexPath, updatedContent, 'utf8');
        console.log('✅ [DEBUG] Manually added entry:', newEntry);
      }
    }
  } catch (error) {
    console.warn('⚠️ Failed to update tu-khainiem index:', error.message);
    console.error('❌ [DEBUG] Full error:', error);
    console.error('❌ [DEBUG] Error stack:', error.stack);
  }
}

// Test function
async function test() {
  const testData = {
    title: "Test Debug Function",
    content: "Đây là test debug để xem log function",
    slug: "test-debug-function"
  };
  
  console.log('🧪 Testing updateTuKhaiNiemIndex function...');
  await updateTuKhaiNiemIndex(testData);
  console.log('✅ Test completed!');
}

test().catch(console.error);
