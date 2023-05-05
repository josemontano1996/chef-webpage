const express = require('express');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get('/orders', adminController.getOrders);
router.get('/orders/:query', adminController.getQueryOrders);
router.get('/account', adminController.getAccount);
router.get('/config', adminController.getConfig);
router.get('/menu', adminController.getMenu);
router.get('/menu/new', adminController.getNewProduct);
router.get('/menu/:id', adminController.getUpdateProduct);
router.get('/schedule', adminController.getSchedule);

router.post('/menu/new', adminController.addNewProduct);
router.post('/menu/:id', adminController.updateProduct);
router.post('/config', adminController.updateConfig);
router.post('/schedule', adminController.postSchedule);
router.post('/holidays', adminController.postHolidays);

router.patch('/orders/status/:id', adminController.updateOrderStatus);

router.delete('/menu/:id', adminController.deleteProduct);

module.exports = router;
