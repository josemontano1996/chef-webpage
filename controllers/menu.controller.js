const Product = require('../models/product.model');

async function getMenu(req, res, next) {
  let product;
  try {
    product = await Product.findAll();
    res.render('customer/menu/menu', {
      starters: product.starters,
      mainDishes: product.mainDishes,
      sideDishes: product.sideDishes,
      desserts: product.desserts,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMenu: getMenu,
};
