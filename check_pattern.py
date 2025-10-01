import re

# Read the file
with open('content/TU-KHAINIEM/_index.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Test the pattern
pattern = r'(\|\| \[.*?\]\(.*?/\) \| .*? \|)(\n\n</div>)'
match = re.search(pattern, content)

if match:
    print('✅ Pattern matched successfully!')
    print(f'Last table row: {match.group(1)}')
    print(f'After row: {match.group(2)}')
    
    # Test adding a new entry
    new_entry = '|| [Test Debug Entry](test-debug-entry/) | Đây là test... |'
    updated_content = content.replace(match.group(0), f'{match.group(1)}\n{new_entry}{match.group(2)}')
    
    # Write the updated content
    with open('content/TU-KHAINIEM/_index.md', 'w', encoding='utf-8') as f:
        f.write(updated_content)
    print('✅ Successfully added new entry to table!')
else:
    print('❌ Pattern did not match')
    print('Last 200 characters:')
    print(content[-200:])
