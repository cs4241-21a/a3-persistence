const staticDir  = "public",
      imagesDir = staticDir + "/images"

// Convert all images into other various sizes
const sharp = require('sharp'),
      fs = require('fs')

fs.readFileSync(imagesDir).forEach(file => {
  sharp(`${imagesDir}/${file}`)
    .resize(240, 240) // width, height
    .toFile(`${directory}/${file}-small.jpg`);
})