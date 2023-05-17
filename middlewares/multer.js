const multer = require('multer');

const upload = multer();

const configuredMulterMiddleware = upload.single('image');

module.exports = configuredMulterMiddleware;
