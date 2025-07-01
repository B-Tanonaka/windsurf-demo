#!/bin/bash

# Navigate to the build directory
cd build || exit 1

# Update paths in HTML, JS, and CSS files
find . -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" \) -exec sed -i '' 's|/static/|/Windsurf-Demo/static/|g' {} \;
find . -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" \) -exec sed -i '' 's|"/manifest.json"|"/Windsurf-Demo/manifest.json"|g' {} \;
find . -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" \) -exec sed -i '' "s|'/manifest.json'|'/Windsurf-Demo/manifest.json'|g" {} \;

# Update base href in index.html
sed -i '' 's|<base href="/"|<base href="/Windsurf-Demo/"|' index.html

echo "Paths updated successfully!"
