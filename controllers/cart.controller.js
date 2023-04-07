const Product = require('../models/product.model');

function getCart(req, res) {
  res.render('customer/cart/cart');
}

async function addCartItem(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (error) {
    return next(error);
  }
  const cart = res.locals.cart;
  cart.addItem(product);
  req.session.cart = cart; //overwriting cart in the session
  res.status(201).json({
    message: 'Cart updated',
    newTotalItems: cart.totalQuantity,
    newTotalPrice: cart.totalPrice,
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
};
