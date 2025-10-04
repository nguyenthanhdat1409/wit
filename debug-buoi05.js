// Debug chi tiết Buổi 05 để xem tại sao có nhiều bài con
const https = require('https');

function debugBuoi05() {
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
                
                // Tìm Buổi 05
                const buoi05 = posts.find(post => post.title.includes('Buổi 05'));
                
                if (buoi05) {
                    console.log('🔍 Buổi 05 Analysis:');
                    console.log('Title:', buoi05.title);
                    console.log('Link:', buoi05.link);
                    console.log('Content length:', buoi05.content.length);
                    
                    // Kiểm tra xem content có chứa HTML của các buổi khác không
                    const otherBuoi = ['Buổi 01', 'Buổi 02', 'Buổi 03', 'Buổi 04', 'Buổi 06', 'Buổi 07', 'Buổi 08', 'Buổi 09', 'Buổi 10'];
                    
                    console.log('\n🔍 Checking for nested content:');
                    otherBuoi.forEach(buoi => {
                        const count = (buoi05.content.match(new RegExp(buoi, 'g')) || []).length;
                        if (count > 0) {
                            console.log(`⚠️  Found "${buoi}" ${count} times in Buổi 05 content!`);
                        }
                    });
                    
                    // Kiểm tra xem có phải content bị lồng nhau không
                    if (buoi05.content.includes('<h4') && buoi05.content.includes('Buổi')) {
                        console.log('\n⚠️  WARNING: Content contains <h4> tags with "Buổi" - likely nested HTML!');
                        
                        // Tìm tất cả các thẻ h4 chứa "Buổi"
                        const h4Matches = buoi05.content.match(/<h4[^>]*>.*?Buổi.*?<\/h4>/g);
                        if (h4Matches) {
                            console.log('\n📋 Found H4 tags with "Buổi":');
                            h4Matches.forEach((match, index) => {
                                console.log(`${index + 1}. ${match}`);
                            });
                        }
                    }
                    
                    // Hiển thị một phần content để debug
                    console.log('\n📄 Content preview (first 1000 chars):');
                    console.log(buoi05.content.substring(0, 1000));
                    
                } else {
                    console.log('❌ Không tìm thấy Buổi 05');
                }
            } catch (error) {
                console.error('❌ Error:', error.message);
            }
        });
    }).on('error', (error) => {
        console.error('❌ Request error:', error.message);
    });
}

debugBuoi05();
