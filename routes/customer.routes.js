const express = require('express');

const customerController = require('../controllers/customer.controller');

const csrfMiddleware = require('../middlewares/csrf');

const router = express.Router();

router.get(
  '/account',
  csrfMiddleware.generateCsrfToken,
  customerController.getAccount
);

router.patch(
  '/account',
  csrfMiddleware.validateCsrfToken,
  customerController.updateUserData
);

module.exports = router;
