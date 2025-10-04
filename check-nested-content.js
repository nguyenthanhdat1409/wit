// Kiểm tra xem có phải content bị lồng nhau không
const https = require('https');

function checkNestedContent() {
    const apiUrl = 'https://wit.convoi.com.vn/wp-json/custom/v1/mtw7-contents';
    
    https.get(apiUrl, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                const posts = jsonData.data.contents.nodes;
                
                console.log('🔍 Checking all posts for nested content...\n');
                
                posts.forEach((post, index) => {
                    const title = post.title.replace(/TVHL\.?\s*/g, '').replace(/&#8211;/g, '–');
                    console.log(`--- ${title} ---`);
                    console.log(`Content length: ${post.content.length}`);
                    
                    // Kiểm tra xem có chứa HTML của các buổi khác không
                    const otherBuoi = ['Buổi 01', 'Buổi 02', 'Buổi 03', 'Buổi 04', 'Buổi 06', 'Buổi 07', 'Buổi 08', 'Buổi 09', 'Buổi 10'];
                    let hasNestedContent = false;
                    
                    otherBuoi.forEach(buoi => {
                        if (post.content.includes(buoi) && !post.title.includes(buoi)) {
                            console.log(`⚠️  Contains "${buoi}" in content!`);
                            hasNestedContent = true;
                        }
                    });
                    
                    if (!hasNestedContent) {
                        console.log('✅ No nested content detected');
                    }
                    
                    console.log(''); // Empty line
                });
                
            } catch (error) {
                console.error('❌ Error:', error.message);
            }
        });
    }).on('error', (error) => {
        console.error('❌ Request error:', error.message);
    });
}

checkNestedContent();
