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

function extractPublicId(url) {
  const publicIdRegex = /\/v\d+\/(.*)\./;
  const match = url.match(publicIdRegex);
  if (match && match.length > 1) {
    return match[1];
  } else {
    throw new Error('Invalid Cloudinary URL');
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

async function updateImage(req, res, next) {
  if (!req.file) {
    next();
  } else {
    const tempFilePath = path.join(os.tmpdir(), req.file.originalname);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    try {
      // Delete the old image from Cloudinary
      const publicId = extractPublicId(req.body.imageUrl); //req.body.imageUrl contains the public_id of the old image
      await cloudinary.uploader.destroy(publicId);

      // Upload the new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: 'image',
        width: 2560,
        height: 1920,
        crop: 'scale',
        quality: calculateCompression(req),
      });

      fs.unlinkSync(tempFilePath); // remove the temporary file

      // Retrieve the secure URL of the new image
      res.locals.imageUrl = uploadResult.secure_url;
    } catch (error) {
      console.error('Error updating image:', error);
      return res.status(500).json({ error: 'Image update failed' });
    }

    next();
  }
}

module.exports = {
  uploadImage: uploadImage,
  updateImage: updateImage,
};
