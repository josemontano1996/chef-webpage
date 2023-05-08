const express = require('express');
const adminController = require('../controllers/admin.controller');

const csrfMiddleware = require('../middlewares/csrf');

const router = express.Router();

router.get(
  '/orders',
  csrfMiddleware.createCSRFToken,
  adminController.getOrders
);
router.get(
  '/orders/:query',
  csrfMiddleware.createCSRFToken,
  adminController.getQueryOrders
);
router.get(
  '/account',
  csrfMiddleware.createCSRFToken,
  adminController.getAccount
);
router.get(
  '/config',
  csrfMiddleware.createCSRFToken,
  adminController.getConfig
);
router.get('/menu', csrfMiddleware.createCSRFToken, adminController.getMenu);
router.get(
  '/menu/new',
  csrfMiddleware.createCSRFToken,
  adminController.getNewProduct
);
router.get(
  '/menu/:id',
  csrfMiddleware.createCSRFToken,
  adminController.getUpdateProduct
);
router.get(
  '/schedule',
  csrfMiddleware.createCSRFToken,
  adminController.getSchedule
);

router.post('/menu/new', adminController.addNewProduct);
router.post('/menu/:id', adminController.updateProduct);
router.post('/config', adminController.updateConfig);
router.post('/schedule', adminController.postSchedule);
router.post('/holidays', adminController.postHolidays);

router.patch('/orders/status/:id', adminController.updateOrderStatus);

//DELETION ROUTES
router.delete('/menu/:id', adminController.deleteProduct);
router.post('/holidays/delete/:holidayId', adminController.deleteHolidays);

module.exports = router;
