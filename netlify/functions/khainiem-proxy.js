exports.handler = async (event, context) => {
  // Chỉ cho phép từ localhost trong development
  const origin = event.headers.origin || event.headers.Origin;
  const isLocalhost = origin && (
    origin.includes('localhost') || 
    origin.includes('127.0.0.1') ||
    origin.includes('http://localhost') ||
    origin.includes('http://127.0.0.1')
  );

  // Trong production, chỉ cho phép từ wikiw.vn
  const isProduction = origin && origin.includes('wikiw.vn');

  if (!isLocalhost && !isProduction) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'CORS not allowed' })
    };
  }

  try {
    const response = await fetch('https://admin.wikiw.vn/wp-json/custom/v1/khainiem-contents', {
      headers: {
        'User-Agent': 'Wikiw-Proxy/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Proxy failed', 
        message: error.message 
      })
    };
  }
};
