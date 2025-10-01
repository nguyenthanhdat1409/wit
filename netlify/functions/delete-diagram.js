const { createOrUpdateFile } = require('./lib/github-helper');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { id } = JSON.parse(event.body);
    
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'Thiếu ID đồ hình'
        })
      };
    }

    // Delete diagram file from GitHub
    const diagramPath = `content/HINH/${id}.md`;
    
    try {
      await createOrUpdateFile(diagramPath, '', 'feat: delete diagram "' + id + '"', 'delete');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Đồ hình đã được xóa thành công!',
          deleted: id
        })
      };
    } catch (githubError) {
      console.error('GitHub delete error:', githubError);
      
      if (githubError.status === 404) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ 
            success: false,
            error: 'Không tìm thấy đồ hình'
          })
        };
      }
      
      throw githubError;
    }
  } catch (error) {
    console.error('Error deleting diagram:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: 'Lỗi server',
        message: error.message
      })
    };
  }
};
