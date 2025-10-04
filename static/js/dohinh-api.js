// API endpoint
const API_URL = 'https://admin.wikiw.vn/wp-json/custom/v1/dohinh-contents';

// Function để test API với CORS
async function testAPIWithCORS() {
  try {
    console.log('=== TESTING API WITH CORS ===');
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });
    
    console.log('CORS Response status:', response.status);
    console.log('CORS Response headers:', response.headers);
    
    const contentType = response.headers.get('content-type');
    console.log('CORS Content-Type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('CORS JSON data:', data);
    } else {
      const text = await response.text();
      console.log('CORS Text response:', text);
    }
  } catch (error) {
    console.error('CORS Test Error:', error);
  }
}

// Function để fetch dữ liệu từ API
async function loadDoHinhData() {
  try {
    console.log('Đang gọi API:', API_URL);
    const response = await fetch(API_URL);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Kiểm tra content-type trước khi parse JSON
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      // Nếu không phải JSON, lấy text để kiểm tra
      const text = await response.text();
      console.log('Response text (not JSON):', text);
      throw new Error(`API trả về ${contentType || 'unknown type'} thay vì JSON. Response: ${text.substring(0, 200)}...`);
    }
    
    const data = await response.json();
    console.log('Raw API response:', data);
    renderDoHinhCards(data);
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu đồ hình:', error);
    showErrorMessage();
  }
}

// Function để extract links từ HTML content
function extractLinksFromContent(content) {
  if (!content) return { imageLink: '', conceptLink: '', lessonLink: '' };
  
  // Tạo DOM element để parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  
  // Tìm các link trong content
  const links = doc.querySelectorAll('a[href]');
  let imageLink = '';
  let conceptLink = '';
  let lessonLink = '';
  
  // Tìm link đồ hình (thường chứa .png, .jpg, .jpeg)
  for (let link of links) {
    const href = link.getAttribute('href');
    if (href && (href.includes('.png') || href.includes('.jpg') || href.includes('.jpeg'))) {
      imageLink = href;
      break;
    }
  }
  
  // Tìm link khái niệm và bài học
  const paragraphs = doc.querySelectorAll('p');
  for (let p of paragraphs) {
    const text = p.textContent || '';
    const link = p.querySelector('a[href]');
    
    if (text.includes('Khái niệm:') && link) {
      conceptLink = link.getAttribute('href');
    } else if (text.includes('Bài học:') && link) {
      lessonLink = link.getAttribute('href');
    }
  }
  
  return { imageLink, conceptLink, lessonLink };
}

// Function để render các card đồ hình
function renderDoHinhCards(data) {
  const imageGrid = document.getElementById('imageGrid');
  
  // Debug: Log cấu trúc dữ liệu để kiểm tra
  console.log('Dữ liệu từ API:', data);
  console.log('Type of data:', typeof data);
  console.log('Is array:', Array.isArray(data));
  
  // Kiểm tra nếu data không phải array, thử lấy array từ các thuộc tính có thể
  let items = [];
  if (Array.isArray(data)) {
    items = data;
  } else if (data && typeof data === 'object') {
    // Thử các thuộc tính có thể chứa array
    if (data.data && data.data.contents && data.data.contents.nodes) {
      items = data.data.contents.nodes;
    } else if (data.data && Array.isArray(data.data)) {
      items = data.data;
    } else if (data.items && Array.isArray(data.items)) {
      items = data.items;
    } else if (data.results && Array.isArray(data.results)) {
      items = data.results;
    } else if (data.posts && Array.isArray(data.posts)) {
      items = data.posts;
    } else {
      // Nếu data là object đơn lẻ, chuyển thành array
      items = [data];
    }
  }
  
  if (!items || items.length === 0) {
    imageGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Không có dữ liệu đồ hình nào.</p>';
    return;
  }

  imageGrid.innerHTML = items.map(item => {
    // Debug: Log từng item để kiểm tra cấu trúc
    console.log('Item data:', item);
    
    // Lấy tên đồ hình từ title
    const tenDoHinh = item.title || 'Đồ hình';
    
    // Extract links từ content HTML
    const { imageLink, conceptLink, lessonLink } = extractLinksFromContent(item.content);
    
    // Fallback nếu không extract được từ content
    const linkDoHinh = imageLink || item.link_do_hinh || item.image_url || item.featured_image || '';
    const khaiNiemPath = conceptLink || item.khai_niem || item.concept_path || '/';
    const baiHocPath = lessonLink || item.bai_hoc || item.lesson_path || '/';

    return `
      <div class="image-card">
        <img src="${linkDoHinh}" alt="${tenDoHinh}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
        <p>${tenDoHinh}</p>
        <div class="buttons">
          <a href="${khaiNiemPath}" target="_blank">Khái Niệm</a>
          <a href="${baiHocPath}" target="_blank">Bài Học</a>
        </div>
      </div>
    `;
  }).join('');
}

// Function hiển thị thông báo lỗi
function showErrorMessage() {
  const imageGrid = document.getElementById('imageGrid');
  imageGrid.innerHTML = `
    <div style="text-align: center; color: #e74c3c; padding: 20px; grid-column: 1 / -1;">
      <p>Không thể tải dữ liệu đồ hình. Vui lòng thử lại sau.</p>
      <div style="margin-top: 15px;">
        <button onclick="loadDoHinhData()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px;">
          Thử lại
        </button>
        <button onclick="testAPI()" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px;">
          Test API
        </button>
        <button onclick="testAPIWithCORS()" style="background: #ffc107; color: black; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px;">
          Test CORS
        </button>
      </div>
    </div>
  `;
}

// Function để test API và hiển thị thông tin debug
async function testAPI() {
  try {
    console.log('=== TESTING API ===');
    console.log('API URL:', API_URL);
    
    const response = await fetch(API_URL);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    // Kiểm tra content-type
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    let data = null;
    let responseText = '';
    
    if (!contentType || !contentType.includes('application/json')) {
      // Nếu không phải JSON, lấy text
      responseText = await response.text();
      console.log('Response text (not JSON):', responseText);
    } else {
      // Nếu là JSON, parse như bình thường
      data = await response.json();
      console.log('=== API RESPONSE ===');
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Data keys:', data ? Object.keys(data) : 'No keys');
      console.log('Full data:', data);
    }
    
    // Hiển thị thông tin debug trên trang
    const imageGrid = document.getElementById('imageGrid');
    
    // Test extract links nếu có data
    let extractedInfo = '';
    if (data && data.data && data.data.contents && data.data.contents.nodes) {
      const firstItem = data.data.contents.nodes[0];
      if (firstItem && firstItem.content) {
        const extracted = extractLinksFromContent(firstItem.content);
        extractedInfo = `
          <h4>Extracted Links (from first item):</h4>
          <p><strong>Image Link:</strong> ${extracted.imageLink || 'Not found'}</p>
          <p><strong>Concept Link:</strong> ${extracted.conceptLink || 'Not found'}</p>
          <p><strong>Lesson Link:</strong> ${extracted.lessonLink || 'Not found'}</p>
        `;
      }
    }
    
    imageGrid.innerHTML = `
      <div style="text-align: left; background: #f8f9fa; padding: 20px; margin: 20px; border-radius: 8px; font-family: monospace; font-size: 12px;">
        <h3>API Debug Information:</h3>
        <p><strong>API URL:</strong> ${API_URL}</p>
        <p><strong>Response Status:</strong> ${response.status}</p>
        <p><strong>Content-Type:</strong> ${contentType || 'Not specified'}</p>
        ${extractedInfo}
        ${data ? `
          <p><strong>Data Type:</strong> ${typeof data}</p>
          <p><strong>Is Array:</strong> ${Array.isArray(data)}</p>
          <p><strong>Data Keys:</strong> ${Object.keys(data).join(', ')}</p>
          <p><strong>Raw Data:</strong></p>
          <pre style="background: #e9ecef; padding: 10px; border-radius: 4px; overflow-x: auto; max-height: 300px;">${JSON.stringify(data, null, 2)}</pre>
        ` : `
          <p><strong>Response Text:</strong></p>
          <pre style="background: #e9ecef; padding: 10px; border-radius: 4px; overflow-x: auto; max-height: 300px;">${responseText}</pre>
        `}
        <button onclick="loadDoHinhData()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
          Load Data
        </button>
      </div>
    `;
  } catch (error) {
    console.error('API Test Error:', error);
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = `
      <div style="text-align: center; color: #e74c3c; padding: 20px;">
        <p>API Test Error: ${error.message}</p>
        <button onclick="loadDoHinhData()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
          Thử lại
        </button>
      </div>
    `;
  }
}

// Load dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
  loadDoHinhData();
});
