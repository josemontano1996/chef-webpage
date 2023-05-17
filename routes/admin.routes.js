const express = require('express');
const adminController = require('../controllers/admin.controller');

const csrfMiddleware = require('../middlewares/csrf');

const multerUtil = require('../util/multer');
const cloudinaryUploadUtil = require('../util/cloudinary');

const router = express.Router();

router.get(
  '/orders',
  csrfMiddleware.generateCsrfToken,
  adminController.getOrders
);
router.get(
  '/orders/:query',
  csrfMiddleware.generateCsrfToken,
  adminController.getQueryOrders
);
router.get(
  '/account',
  csrfMiddleware.generateCsrfToken,
  adminController.getAccount
);
router.get(
  '/config',
  csrfMiddleware.generateCsrfToken,
  adminController.getConfig
);
router.get('/menu', csrfMiddleware.generateCsrfToken, adminController.getMenu);
router.get(
  '/menu/new',
  csrfMiddleware.generateCsrfToken,
  adminController.getNewProduct
);
router.get(
  '/menu/:id',
  csrfMiddleware.generateCsrfToken,
  adminController.getUpdateProduct
);
router.get(
  '/schedule',
  csrfMiddleware.generateCsrfToken,
  adminController.getSchedule
);

router.post(
  '/menu',
  multerUtil,
  cloudinaryUploadUtil,
  csrfMiddleware.validateCsrfToken,
  adminController.addNewProduct
);
router.post(
  '/menu/:id',
  csrfMiddleware.validateCsrfToken,
  adminController.updateProduct
);
router.post(
  '/config',
  csrfMiddleware.validateCsrfToken,
  adminController.updateConfig
);
router.post(
  '/schedule',
  csrfMiddleware.validateCsrfToken,
  adminController.postSchedule
);
router.post(
  '/holidays',
  csrfMiddleware.validateCsrfToken,
  adminController.postHolidays
);
router.post(
  '/holidays/delete/:holidayId',
  csrfMiddleware.validateCsrfToken,
  adminController.deleteHolidays
);

router.patch(
  '/orders/status/:id',
  csrfMiddleware.validateCsrfToken,
  adminController.updateOrderStatus
);

router.delete(
  '/menu/:productId/:csrf',
  csrfMiddleware.validateCsrfToken,
  adminController.deleteProduct
);

module.exports = router;
