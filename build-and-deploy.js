#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 DEPLOYING HappyMarketDocs...');
console.log('========================================');
console.log('');

// Function để chạy command và hiển thị output
function runCommand(command, description) {
    console.log(`📋 ${description}...`);
    try {
        const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
        console.log(`✅ ${description} completed`);
        if (output.trim()) {
            console.log(`   ${output.trim()}`);
        }
        return true;
    } catch (error) {
        console.log(`❌ ${description} failed`);
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

// Function để kiểm tra file tồn tại
function checkFileExists(filePath) {
    return fs.existsSync(filePath);
}

// Main deployment process
async function deploy() {
    try {
        // 1. Kiểm tra Hugo
        if (!runCommand('hugo version', 'Checking Hugo installation')) {
            console.log('💡 Install Hugo with: choco install hugo-extended');
            process.exit(1);
        }

        // 2. Kiểm tra Node.js
        if (!runCommand('node --version', 'Checking Node.js installation')) {
            console.log('💡 Please install Node.js first');
            process.exit(1);
        }

        // 3. Clean previous build
        console.log('🧹 Cleaning previous build...');
        if (checkFileExists('public')) {
            fs.rmSync('public', { recursive: true, force: true });
            console.log('✅ Cleaned public directory');
        }
        if (checkFileExists('resources')) {
            fs.rmSync('resources', { recursive: true, force: true });
            console.log('✅ Cleaned resources directory');
        }

        // 4. Install dependencies
        if (!runCommand('npm install', 'Installing dependencies')) {
            process.exit(1);
        }

        // 5. Build Hugo site
        if (!runCommand('hugo --gc --minify', 'Building Hugo site')) {
            process.exit(1);
        }

        console.log('');
        console.log('✅ BUILD COMPLETED SUCCESSFULLY!');
        console.log('========================================');
        console.log('📁 Output directory: public/');
        console.log('');
        console.log('🌐 Next steps:');
        console.log('   1. Upload "public" folder to your hosting');
        console.log('   2. Or run: npm run deploy (if Netlify CLI installed)');
        console.log('   3. Or run: netlify deploy --prod --dir=public');
        console.log('');
        console.log('🎉 Happy Deploying!');

    } catch (error) {
        console.log('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

// Chạy deploy
deploy();
