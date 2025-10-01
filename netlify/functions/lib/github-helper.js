/**
 * GitHub API Helper
 * Tạo/Update files trực tiếp trên GitHub repository
 */

// ⚠️ QUAN TRỌNG: Các giá trị này PHẢI được set trong Netlify Environment Variables
// Không hardcode token vào code vì lý do bảo mật!
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'nguyenthanhdat1409';
const GITHUB_REPO = process.env.GITHUB_REPO || 'wit';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

// Validate token exists
if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN environment variable is not set!');
  console.error('📋 Please set it in Netlify Dashboard:');
  console.error('   https://app.netlify.com/sites/YOUR_SITE/settings/deploys#environment');
}

/**
 * Create or update a file on GitHub
 * @param {string} filePath - Path to file (e.g., 'content/TU-KHAINIEM/test/_index.md')
 * @param {string} content - File content
 * @param {string} commitMessage - Commit message
 * @returns {Promise<Object>} GitHub API response
 */
async function createOrUpdateFile(filePath, content, commitMessage) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
  
  console.log('📡 GitHub API URL:', url);
  console.log('📝 Creating/Updating file:', filePath);
  
  try {
    // 1. Check if file exists (get SHA for update)
    let sha = null;
    try {
      const checkResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'HappyMarketDocs-Netlify-Function'
        }
      });
      
      if (checkResponse.ok) {
        const existing = await checkResponse.json();
        sha = existing.sha;
        console.log('📄 File exists, SHA:', sha);
      }
    } catch (checkError) {
      console.log('📄 File does not exist, will create new');
    }
    
    // 2. Encode content to base64
    const contentBase64 = Buffer.from(content, 'utf-8').toString('base64');
    
    // 3. Create or update file
    const payload = {
      message: commitMessage,
      content: contentBase64,
      branch: GITHUB_BRANCH
    };
    
    if (sha) {
      payload.sha = sha; // Include SHA for update
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'HappyMarketDocs-Netlify-Function'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ GitHub API Error:', error);
      throw new Error(`GitHub API Error: ${error.message || response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ File created/updated on GitHub:', result.content.path);
    
    return {
      success: true,
      sha: result.content.sha,
      path: result.content.path,
      url: result.content.html_url,
      commit: result.commit
    };
    
  } catch (error) {
    console.error('❌ Error creating/updating file on GitHub:', error);
    throw error;
  }
}

/**
 * Trigger Netlify build (optional)
 * Netlify tự động rebuild khi có commit mới, nhưng có thể trigger thủ công
 */
async function triggerNetlifyBuild(buildHookUrl) {
  if (!buildHookUrl) {
    console.log('ℹ️ No build hook URL provided, skipping manual trigger');
    return { message: 'Netlify will auto-rebuild on git push' };
  }
  
  try {
    const response = await fetch(buildHookUrl, {
      method: 'POST'
    });
    
    if (response.ok) {
      console.log('✅ Netlify build triggered');
      return { success: true, message: 'Build triggered' };
    } else {
      console.warn('⚠️ Failed to trigger Netlify build');
      return { success: false, message: 'Failed to trigger build' };
    }
  } catch (error) {
    console.error('❌ Error triggering Netlify build:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  createOrUpdateFile,
  triggerNetlifyBuild,
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_BRANCH
};

