// Debug chi tiết content của Buổi 05
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
                    console.log('🔍 Buổi 05 Content Analysis:');
                    console.log('Title:', buoi05.title);
                    console.log('Content length:', buoi05.content.length);
                    console.log('\n📄 Full content:');
                    console.log(buoi05.content);
                    
                    // Kiểm tra xem có chứa HTML của các buổi khác không
                    const otherBuoi = ['Buổi 01', 'Buổi 02', 'Buổi 03', 'Buổi 04'];
                    otherBuoi.forEach(buoi => {
                        if (buoi05.content.includes(buoi)) {
                            console.log(`\n⚠️  FOUND "${buoi}" in Buổi 05 content!`);
                        }
                    });
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
