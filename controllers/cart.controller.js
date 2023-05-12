const Product = require('../models/product.model');

function getCart(req, res) {
  res.render('customer/cart/cart');
}

function flashCart(req, res, next) {
  try {
    res.json({
      locals: res.locals,
    });
  } catch (error) {
    return next(error);
  }
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
    locals: res.locals,
  });
}

function updateCartItem(req, res) {
  const cart = res.locals.cart;

  const updatedItemData = cart.updateItem(
    req.body.productId,
    +req.body.quantity
  );

  req.session.cart = cart;

  res.json({
    message: 'Item updated',
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice,
    },
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateCartItem: updateCartItem,
  flashCart: flashCart,
};
