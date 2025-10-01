const fs = require('fs');

// Read the file
const content = fs.readFileSync('content/TU-KHAINIEM/_index.md', 'utf8');

console.log('=== TESTING PATTERN MATCHING ===');

// Test the exact pattern from the file
const testPattern = /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\n\n<\/div>)/;
const match = content.match(testPattern);

console.log('Pattern test result:', match ? 'FOUND' : 'NOT FOUND');

if (match) {
  console.log('✅ SUCCESS! Pattern matched');
  console.log('Group 1 (last table row):', match[1]);
  console.log('Group 2 (newlines + </div>):', match[2]);
  
  // Test replacement
  const newEntry = '|| [Test Entry](test-entry/) | Test content... |';
  const updatedContent = content.replace(match[0], `${match[1]}\n${newEntry}${match[2]}`);
  
  console.log('\n=== REPLACEMENT TEST ===');
  console.log('Last 200 characters after replacement:');
  console.log(updatedContent.substring(updatedContent.length - 200));
} else {
  console.log('❌ FAILED! Pattern did not match');
  
  // Show the actual structure
  console.log('\n=== ACTUAL STRUCTURE ===');
  console.log('Last 200 characters:');
  console.log(content.substring(content.length - 200));
  
  // Find all table rows
  const allRows = content.match(/\|\| \[.*?\]\(.*?\/\) \| .*? \|/g);
  console.log('\nTotal table rows:', allRows ? allRows.length : 0);
  if (allRows && allRows.length > 0) {
    console.log('Last row:', allRows[allRows.length - 1]);
  }
}
