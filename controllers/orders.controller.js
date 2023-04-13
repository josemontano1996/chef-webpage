const inputValidation = require('../util/input-validation');
const sessionFlash = require('../util/session-flash');

const User = require('../models/user.model');
const Order = require('../models/order.model');

async function getOrders(req, res, next) {
 
  try {
    const orders = await Order.findAllForUser(res.locals.userid);
    
    res.render('customer/orders/orders', { orders: orders });
  } catch (error) {
    return next(error);
  }
}

async function checkOut(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      street: '',
      postal: '',
      city: '',
      country: '',
    };
  }

  try {
    const userid = res.locals.userid;
    const userData = await User.getUserWithSameId(userid);

    res.render('customer/cart/checkout', {
      user: userData,
      inputData: sessionData,
    });
  } catch (error) {
    return next(error);
  }
}

async function placeOrder(req, res, next) {
  const cart = res.locals.cart;
  const userId = res.locals.userid;

  const validationData = {
    name: req.body.fullname,
    phone: req.body.phone,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
    country: req.body.country,
    deliveryDate: req.body.deliveryDate,
  };
  if (
    !inputValidation.orderDetailsAreValid(
      req.body.fullname,
      req.body.phone,
      req.body.street,
      req.body.postal,
      req.body.city,
      req.body.country,
      req.body.deliveryDate
    )
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: 'Data provides is invalid, please check your data again.',
        ...validationData,
      },
      () => {
        res.redirect('/orders/checkout');
      }
    );
    return;
  }
  try {
    const order = new Order(
      cart,
      {
        _id: userId,
        fullname: req.body.fullname,
        phone: req.body.phone,
        street: req.body.street,
        postal: req.body.postal,
        city: req.body.city,
        country: req.body.country,
      },
      'pending',
      req.body.deliveryDate,
      req.body.pickup,
      req.body.request
    );

    await order.save();
  } catch (error) {
    return next(error);
  }

  req.session.cart = null;

  res.redirect('/orders');
}

module.exports = {
  placeOrder: placeOrder,
  checkOut: checkOut,
  getOrders: getOrders,
};
