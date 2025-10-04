@echo off
echo 🔧 Fixing menu to show "Bài học đào tạo nội tâm"...

git add .
git commit -m "fix: Add Bài học đào tạo nội tâm to dropdown menu

- Update themes/happymarket-theme/layouts/_default/baseof.html
- Add menu item to both desktop and mobile dropdown
- Use 🧘 icon for đào tạo nội tâm
- Fix config.yaml menu structure"

echo ✅ Menu fix committed!
echo 🚀 Pushing changes...

git push

echo 🎉 Menu should now show "Bài học đào tạo nội tâm" in dropdown!
echo 💡 Restart Hugo server to see changes: hugo server -D
pause
