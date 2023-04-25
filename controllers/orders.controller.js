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
  //I HAVE TO ADD THE DATE VALIDATION!!
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
    };
  }

  try {
    const userid = res.locals.userid;
    const userData = await User.getUserWithSameId(userid);

    const orderDataFlash = new Order();
    //I use the orderDataFlash to create a new Order instance
    //and pass to the template the Pickup Address data.

    res.render('customer/cart/checkout', {
      user: userData,
      inputData: sessionData,
      orderDataFlash: orderDataFlash,
    });
  } catch (error) {
    return next(error);
  }
}

async function placeOrder(req, res, next) {
  const cart = res.locals.cart;
  const userId = res.locals.userid;
  let deliveryAddress;

  if (res.locals.configData.pickup || req.body.pickup) {
    const address = res.locals.configData.pickupAddress;
    deliveryAddress = {
      street: address.pickupStreet,
      postal: address.pickupPostal,
      city: address.pickupCity,
      country: address.pickupCountry,
    };
  } else {
    deliveryAddress = {
      street: req.body.street,
      postal: req.body.postal,
      city: req.body.city,
      country: req.body.country,
    };
  }
  
  const validationData = {
    name: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone,
    street: deliveryAddress.street,
    postal: deliveryAddress.postal,
    city: deliveryAddress.city,
    country: deliveryAddress.country,
    deliveryDate: req.body.deliveryDate,
  };
  if (
    !inputValidation.orderDetailsAreValid(
      req.body.fullname,
      req.body.email,
      req.body.phone,
      deliveryAddress.street,
      deliveryAddress.postal,
      deliveryAddress.city,
      deliveryAddress.country,
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
        email: req.body.email,
        phone: req.body.phone,
      },
      'pending',
      req.body.deliveryDate,
      req.body.pickup,
      req.body.request,
      deliveryAddress
    );

    await order.save();
  } catch (error) {
    return next(error);
  }

  req.session.cart = null;

  res.redirect('/orders');
}

async function cancelRequest(req, res, next) {
  try {
    const cancellationOrder = new Order(
      undefined,
      undefined,
      'cancelreq',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      req.params.id,
      undefined
    );
    await cancellationOrder.editStatus();
  } catch (error) {
    return next(error);
  }

  res.json({ message: 'Cancellation process started' });
}

module.exports = {
  placeOrder: placeOrder,
  checkOut: checkOut,
  getOrders: getOrders,
  cancelRequest: cancelRequest,
};
