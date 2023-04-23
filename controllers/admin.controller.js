const sessionFlash = require('../util/session-flash');
const inputValidation = require('../util/input-validation');

const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Admin = require('../models/admin.model');

async function getOrders(req, res) {
  try {
    const orders = await Order.findForQuery('Pending');

    res.render('admin/orders/pending', { orders: orders });
  } catch (error) {
    return next(error);
  }
}

async function getQueryOrders(req, res) {
  let query = req.params.query;

  if (query === 'CancelRequest') {
    query = 'Cancellation Requested';
  }

  try {
    const orders = await Order.findForQuery(query);

    res.render('admin/orders/pending', { orders: orders });
  } catch (error) {
    return next(error);
  }
}

async function getAccount(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      name: '',
      phone: '',
      street: '',
      postal: '',
      city: '',
      country: '',
      facebook: '',
      instagram: '',
    };
  }

  try {
    const userid = res.locals.userid;
    const userData = await Admin.getAccountInfo(userid);

    res.render('admin/account/account', {
      user: userData,
      inputData: sessionData,
    });
  } catch (error) {
    return next(error);
  }
}

async function getMenu(req, res, next) {
  let product;
  try {
    product = await Product.findAll();
    res.render('admin/menu/menu', {
      starters: product.starters,
      mainDishes: product.mainDishes,
      sideDishes: product.sideDishes,
      desserts: product.desserts,
    });
  } catch (error) {
    return next(error);
  }
}

function getNewProduct(req, res) {
  res.render('admin/menu/new-product', { req: req });
}

async function addNewProduct(req, res, next) {
  const product = new Product(
    req.body.name,
    req.body.description,
    req.body.price,
    req.body.cuisine,
    req.body.type,
    req.body.minQuantity,
    req.params.id // this is just passed to we have an id to find the product in our model
  );

  try {
    await product.save();
  } catch (error) {
    return next(error);
  }

  res.redirect('/admin/menu');
}

async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render('admin/menu/edit-product', { product: product });
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  const product = new Product(
    req.body.name,
    req.body.description,
    req.body.price,
    req.body.cuisine,
    req.body.type,
    req.body.minQuantity,
    req.params.id
  );

  try {
    await product.save();
  } catch (error) {
    return next(error);
  }

  res.redirect('/admin/menu');
}

async function updateOrderStatus(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ statusMessage: 'Order succesfully updated!' });
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    await product.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: 'Deleted product!' });
}

module.exports = {
  getOrders: getOrders,
  getAccount: getAccount,
  getMenu: getMenu,
  getNewProduct: getNewProduct,
  addNewProduct: addNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  updateOrderStatus: updateOrderStatus,
  getQueryOrders: getQueryOrders,
};
