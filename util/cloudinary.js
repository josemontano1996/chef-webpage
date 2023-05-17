const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const os = require('os');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function calculateCompression(req) {
  // calculating how much compression would be necessary to set the file to 300kb
  if (req.file.size <= 300 * 1024) {
    return 100;
  } else {
    const desiredPhotoSize = 300 * 1024;
    return (desiredPhotoSize / req.file.size) * 100;
  }
}

async function uploadImage(req, res, next) {
  if (!req.file) {
    next();
  } else {
    const tempFilePath = path.join(os.tmpdir(), req.file.originalname);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    await cloudinary.uploader.upload(
      tempFilePath,
      {
        resource_type: 'image',
        width: 2560,
        height: 1920,
        crop: 'scale',
        quality: calculateCompression(req),
      },
      (error, result) => {
        fs.unlinkSync(tempFilePath); // remove the temporary file

        if (error) {
          console.error('Error uploading image:', error);
          return res.status(500).json({ error: 'Image upload failed' });
        }

        res.locals.imageUrl = result.secure_url;
      }
    );
    next();
  }
}

module.exports = uploadImage;
