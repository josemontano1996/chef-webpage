const Product = require('../models/product.model');

function getOrders(req, res) {
  res.render('admin/orders/orders');
}

function getAccount(req, res) {
  res.render('admin/account/account');
}

async function getMenu(req, res, next) {
  let product;
  try {
    product = await Product.findAll();
  } catch (error) {
    return next(error);
  }

  res.render('admin/menu/menu', {
    starters: product.starters,
    mainDishes: product.mainDishes,
    sideDishes: product.sideDishes,
    desserts: product.desserts,
  });
}

function getNewProduct(req, res) {
  res.render('admin/menu/new-product');
}

async function addNewProduct(req, res, next) {
  const product = new Product(
    req.body.name,
    req.body.description,
    req.body.price,
    req.body.cuisine,
    req.body.type,
    req.body.minQuantity
  );

  try {
    await product.save();
  } catch (error) {
    return next(error);
  }

  res.redirect('/admin/menu');
}

module.exports = {
  getOrders: getOrders,
  getAccount: getAccount,
  getMenu: getMenu,
  getNewProduct: getNewProduct,
  addNewProduct: addNewProduct,
};
