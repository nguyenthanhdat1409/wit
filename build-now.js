#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 BUILDING HappyMarketDocs NOW...');
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

// Function để xóa thư mục
function removeDirectory(dirPath) {
    if (checkFileExists(dirPath)) {
        try {
            fs.rmSync(dirPath, { recursive: true, force: true });
            console.log(`🧹 Cleaned ${dirPath} directory`);
            return true;
        } catch (error) {
            console.log(`❌ Failed to clean ${dirPath}: ${error.message}`);
            return false;
        }
    }
    return true;
}

// Main build process
async function build() {
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

        console.log('');
        console.log('🔧 Building project...');
        console.log('========================================');

        // 3. Clean previous build
        removeDirectory('public');
        removeDirectory('resources');

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
        console.log(`📊 Build completed at: ${new Date().toLocaleString()}`);
        console.log('');

        // 6. Kiểm tra kích thước thư mục public
        if (checkFileExists('public')) {
            try {
                const stats = fs.statSync('public');
                console.log('📊 Build statistics:');
                console.log(`   📁 Public directory created`);
                console.log(`   📅 Last modified: ${stats.mtime.toLocaleString()}`);
                
                // Đếm số file trong public
                const files = fs.readdirSync('public', { recursive: true });
                const fileCount = files.filter(file => fs.statSync(path.join('public', file)).isFile()).length;
                console.log(`   📄 Total files: ${fileCount}`);
            } catch (error) {
                console.log('   ⚠️  Could not get build statistics');
            }
        }

        console.log('');
        console.log('🌐 Next steps:');
        console.log('   1. Upload "public" folder to your hosting');
        console.log('   2. Or run: deploy-direct-netlify.bat');
        console.log('   3. Or run: netlify deploy --prod --dir=public');
        console.log('');
        console.log('🎉 Happy Building!');

    } catch (error) {
        console.log('❌ Build failed:', error.message);
        process.exit(1);
    }
}

// Chạy build
build();
