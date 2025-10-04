@echo off
echo 🔧 Fixing MTW7 iframe title cutoff issue...

git add .
git commit -m "fix: Apply same iframe title cutoff fix to MTW7 lessons

- Update content/bai-hoc-mtw7/_index.md with aggressive CSS resets for iframe content
- Set iframe transform to translateY(0px) and height to 100% in JS and CSS
- Update themes/happymarket-theme/layouts/mtw7-lessons.html with corresponding iframe CSS
- Apply same WordPress optimization approach as Đào tạo nội tâm
- Ensure MTW7 title displays correctly without orange line cutoff"

echo ✅ MTW7 iframe title cutoff fix committed!
echo 🚀 Pushing changes...

git push

echo 🎉 MTW7 iframe title should now display correctly!
echo 💡 Both MTW7 and Đào tạo nội tâm now have consistent iframe handling
pause
