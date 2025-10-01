const fs = require('fs');

const content = fs.readFileSync('content/TU-KHAINIEM/_index.md', 'utf8');

// Test pattern
const pattern = /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\n\n<\/div>)/;
const match = content.match(pattern);

if (match) {
  console.log('SUCCESS: Pattern matched!');
  console.log('Last row:', match[1]);
  console.log('After row:', match[2]);
} else {
  console.log('FAILED: Pattern did not match');
  console.log('Last 200 chars:');
  console.log(content.substring(content.length - 200));
}
