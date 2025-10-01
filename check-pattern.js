const fs = require('fs');

try {
  const content = fs.readFileSync('content/TU-KHAINIEM/_index.md', 'utf8');
  
  // Test the pattern we're using
  const pattern = /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\n\n<\/div>)/;
  const match = content.match(pattern);
  
  if (match) {
    console.log('✅ Pattern matched successfully!');
    console.log('Last table row:', match[1]);
    console.log('After row:', match[2]);
    
    // Test adding a new entry
    const newEntry = '|| [Test Entry](test-entry/) | Test content... |';
    const updatedContent = content.replace(match[0], `${match[1]}\n${newEntry}${match[2]}`);
    
    // Write the updated content
    fs.writeFileSync('content/TU-KHAINIEM/_index.md', updatedContent, 'utf8');
    console.log('✅ Successfully added new entry to table!');
  } else {
    console.log('❌ Pattern did not match');
    console.log('Last 200 characters:');
    console.log(content.substring(content.length - 200));
  }
} catch (error) {
  console.error('Error:', error.message);
}