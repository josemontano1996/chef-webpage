const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageBuffer = req.file.buffer

const imageConfig = {
  resource_type: 'image',
  width: 2560,
  height: 1920,
  crop: scale,
};

function uploadImage(req, res, next) {
  if (!req.file) {
    next();
  } else {
    cloudinary.uploader.upload(
      imageBuffer,
      imageConfig,
      (error, result) => {
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

module.exports = {
  uploadImage: uploadImage,
};
