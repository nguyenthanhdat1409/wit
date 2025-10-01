// Test pattern matching
const fs = require('fs');

const content = fs.readFileSync('content/TU-KHAINIEM/_index.md', 'utf8');

console.log('=== PATTERN TEST ===');
console.log('Last 300 characters:');
console.log(content.substring(content.length - 300));
console.log('\n=== TESTING PATTERNS ===');

// Test different patterns
const patterns = [
  { name: 'Pattern 1 (2 newlines)', regex: /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\s*\n\s*\n\s*<\/div>)/ },
  { name: 'Pattern 2 (1 newline)', regex: /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\s*\n\s*<\/div>)/ },
  { name: 'Pattern 3 (flexible)', regex: /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\s*\n\s*(<\/div>|<script>))/ },
  { name: 'Pattern 4 (any whitespace)', regex: /(\|\| \[.*?\]\(.*?\/\) \| .*? \|)(\s*<\/div>)/ }
];

patterns.forEach((pattern, index) => {
  const match = content.match(pattern.regex);
  console.log(`${index + 1}. ${pattern.name}: ${match ? 'FOUND' : 'NOT FOUND'}`);
  if (match) {
    console.log(`   Group 1: ${match[1]}`);
    console.log(`   Group 2: ${match[2]}`);
  }
});

// Find all table rows
console.log('\n=== ALL TABLE ROWS ===');
const allRows = content.match(/\|\| \[.*?\]\(.*?\/\) \| .*? \|/g);
console.log(`Total rows: ${allRows ? allRows.length : 0}`);
if (allRows && allRows.length > 0) {
  console.log('Last 5 rows:');
  allRows.slice(-5).forEach((row, i) => {
    console.log(`  ${allRows.length - 5 + i + 1}: ${row}`);
  });
}
