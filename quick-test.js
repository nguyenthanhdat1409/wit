// Quick test to see if the pattern matches
const fs = require('fs');

try {
  const content = fs.readFileSync('content/TU-KHAINIEM/_index.md', 'utf8');
  
  console.log('📄 Last 200 characters:');
  console.log(content.substring(content.length - 200));
  
  // Test pattern
  const pattern = /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\s*\n\s*\n\s*<\/div>)/;
  const match = content.match(pattern);
  
  console.log('\n🔍 Pattern match result:', match ? 'FOUND' : 'NOT FOUND');
  if (match) {
    console.log('✅ Match found!');
    console.log('Group 1:', match[1]);
    console.log('Group 2:', match[2]);
  } else {
    console.log('❌ No match found');
    
    // Try to find all table rows
    const allRows = content.match(/\|\| \[.*?\]\(.*?\/\) \| .*? \|/g);
    console.log('📊 Total table rows found:', allRows ? allRows.length : 0);
    if (allRows && allRows.length > 0) {
      console.log('📋 Last 3 rows:');
      allRows.slice(-3).forEach((row, i) => {
        console.log(`  ${allRows.length - 3 + i + 1}: ${row}`);
      });
    }
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
