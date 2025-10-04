@echo off
echo 🔧 Fixing title position in Đào tạo nội tâm iframe...

git add .
git commit -m "fix: Adjust iframe positioning to prevent title cutoff

- Reduce iframe transform from -80px to -40px
- Set body margin-top to 0px instead of 60px
- Add specific CSS for entry-title positioning
- Ensure full title visibility in modal
- Fix mobile responsive positioning"

echo ✅ Title position fix committed!
echo 🚀 Pushing changes...

git push

echo 🎉 Title should now display fully without cutoff!
echo 💡 Refresh the page and test the modal
pause
