# Script to update all KHAI-NIEM-NGUON pages
$basePath = "content/KHAI-NIEM-NGUON"

# Get all _index.md files in subdirectories
$files = Get-ChildItem -Path $basePath -Recurse -Name "_index.md"

foreach ($file in $files) {
    $fullPath = Join-Path $basePath $file
    Write-Host "Processing: $fullPath"
    
    # Read the file
    $content = Get-Content $fullPath -Raw -Encoding UTF8
    
    # Extract front matter and keep it, replace everything else
    if ($content -match "(---.*?---)(.*)") {
        $frontMatter = $matches[1]
        $rest = $matches[2]
        
        # Extract title from front matter
        $titleMatch = [regex]::Match($frontMatter, 'title:\s*"([^"]*)"')
        $title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value } else { "Khái niệm" }
        
        # Extract icon from title if it exists
        $icon = ""
        if ($title -match "^([^\s]+)\s") {
            $icon = $matches[1] + " "
        }
        
        # Create new content
        $newContent = $frontMatter + "`n`n" + 
                     "# " + $icon + $title + "`n`n" +
                     "***Đang trong quá trình xây dựng và phát triển!***`n`n" +
                     "## 🔗 Liên kết`n`n" +
                     "- [Quay lại Khái niệm nguồn](/khai-niem-nguon/)`n" +
                     "- [Xem tất cả khái niệm](/khai-niem/)`n`n" +
                     "---`n`n" +
                     "*Cập nhật lần cuối: 07/10/2025*`n"
        
        # Write back to file
        Set-Content -Path $fullPath -Value $newContent -Encoding UTF8
        Write-Host "Updated: $fullPath"
    }
}

Write-Host "All files updated successfully!"
