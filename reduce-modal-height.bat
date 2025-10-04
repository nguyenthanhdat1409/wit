@echo off
echo 📏 Reducing modal height for better display...

git add .
git commit -m "style: Reduce modal height for better user experience

- Desktop: height 700px → 500px, max-height 95vh → 80vh
- Tablet: height 80vh → 70vh, min-height 500px → 400px  
- Mobile: height 85vh → 75vh, min-height 400px → 350px
- Improve modal proportions and readability
- Better fit for different screen sizes"

echo ✅ Modal height reduction committed!
echo 🚀 Pushing changes...

git push

echo 🎉 Modal height reduced for better display!
echo 💡 Test the modal to see improved proportions
pause
