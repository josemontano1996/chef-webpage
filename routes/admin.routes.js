const express = require('express');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get('/orders', adminController.getOrders);
router.get('/account', adminController.getAccount);
router.get('/menu', adminController.getMenu);
router.get('/menu/new', adminController.getNewProduct);
router.get('/menu/:id', adminController.getUpdateProduct);

router.post('/menu/new', adminController.addNewProduct);
router.post('/menu/:id', adminController.updateProduct);

router.delete('/menu/:id', adminController.deleteProduct);

module.exports = router;
