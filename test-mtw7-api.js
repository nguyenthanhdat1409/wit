// Test MTW7 API để debug vấn đề hiển thị
const https = require('https');

function testMTW7API() {
    const apiUrl = 'https://wit.convoi.com.vn/wp-json/custom/v1/mtw7-contents';
    
    console.log('🔍 Testing MTW7 API...');
    console.log('URL:', apiUrl);
    
    https.get(apiUrl, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('\n📊 API Response Structure:');
                console.log('Keys:', Object.keys(jsonData));
                
                if (jsonData.data && jsonData.data.contents && jsonData.data.contents.nodes) {
                    const posts = jsonData.data.contents.nodes;
                    console.log(`\n📚 Found ${posts.length} posts:`);
                    
                    posts.forEach((post, index) => {
                        console.log(`\n--- Post ${index + 1} ---`);
                        console.log('Title:', post.title);
                        console.log('Link:', post.link);
                        console.log('Content length:', post.content ? post.content.length : 0);
                        console.log('Content preview:', post.content ? post.content.substring(0, 100) + '...' : 'No content');
                        
                        // Kiểm tra xem có phải nested content không
                        if (post.content && post.content.includes('Buổi')) {
                            console.log('⚠️  WARNING: Content contains "Buổi" - might be nested!');
                        }
                    });
                } else {
                    console.log('❌ Unexpected data structure:');
                    console.log(JSON.stringify(jsonData, null, 2));
                }
            } catch (error) {
                console.error('❌ Error parsing JSON:', error.message);
                console.log('Raw response:', data.substring(0, 500));
            }
        });
    }).on('error', (error) => {
        console.error('❌ Request error:', error.message);
    });
}

testMTW7API();
