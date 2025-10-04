@echo off
echo 🔧 Fixing iframe title cutoff issue...

git add .
git commit -m "fix: Resolve iframe title cutoff by optimizing WordPress and local CSS

- Update content/bai-hoc-dao-tao-noi-tam/_index.md with aggressive CSS resets for iframe content
- Set iframe transform to translateY(0px) and height to 100% in JS and CSS
- Update themes/happymarket-theme/layouts/daotao-lessons.html with corresponding iframe CSS
- Provide recommendations for WordPress-side style.css and functions.php adjustments
- Ensure full title visibility and proper content positioning"

echo ✅ Iframe title cutoff fix committed!
echo 🚀 Pushing changes...

git push

echo 🎉 Iframe title should now display correctly!
echo 💡 Remember to apply WordPress-side changes and restart Hugo server to see full effect.
pause
