const multer = require('multer');

const upload = multer();

const multerUtil = upload.single('image');

module.exports = multerUtil;

