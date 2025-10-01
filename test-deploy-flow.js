const http = require('http');

// Test data
const testData = {
  title: 'Test Deploy Flow',
  content: 'Đây là test để kiểm tra quy trình deploy tự động',
  tags: ['test', 'deploy'],
  categories: ['test']
};

// Make API call
const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/create-vocabulary',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🚀 Testing Deploy Flow...');
console.log('📝 Test Data:', testData);
console.log('🌐 API Endpoint: http://localhost:3001/api/create-vocabulary');
console.log('');

const req = http.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📄 Response:', data);
    
    try {
      const response = JSON.parse(data);
      if (response.success) {
        console.log('');
        console.log('✅ SUCCESS! Deploy flow completed:');
        console.log(`   📁 File created: ${response.data.filePath}`);
        console.log(`   🔗 URL: ${response.data.url}`);
        console.log(`   📝 Message: ${response.message}`);
        console.log('');
        console.log('🔄 Next steps:');
        console.log('   1. Check Git repository for new commit');
        console.log('   2. Wait 2-3 minutes for auto-deploy');
        console.log('   3. Check website for updated table');
      } else {
        console.log('❌ FAILED:', response.error);
      }
    } catch (e) {
      console.log('❌ Failed to parse response:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Problem with request: ${e.message}`);
  console.log('');
  console.log('🔧 Troubleshooting:');
  console.log('   1. Make sure API server is running: node simple-server.js');
  console.log('   2. Check if port 3001 is available');
  console.log('   3. Check network connection');
});

req.write(postData);
req.end();
