const inputValidation = require('../util/input-validation');
const sessionFlash = require('../util/session-flash');

const User = require('../models/user.model');
const Order = require('../models/order.model');

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findForMultipleQueries(res.locals.userid, [
      'pending',
      'cancelreq',
      'accepted',
    ]);

    res.render('customer/account/orders/active', { orders: orders });
  } catch (error) {
    return next(error);
  }
}

async function getOrderForQueries(req, res, next) {
  //active pending, cancelreq, accepted\
  //inactive cancelled, fullfilled
  //fullfilled fullfilled: orders free for commenting
  let queriesArray;
  let path;

  if (req.params.query === 'active') {
    queriesArray = ['accepted', 'pending', 'cancelreq'];
    path = 'active';
  }
  if (req.params.query === 'inactive') {
    queriesArray = ['fullfilled', 'cancelled'];
    path = 'inactive';
  }
  if (req.params.query === 'fullfilled') {
    queriesArray = ['fullfilled'];
    path = 'comment';
  }
  if (!queriesArray) {
    return res.status(404).render('shared/errors/404');
  }

  try {
    const orders = await Order.findForMultipleQueries(
      res.locals.userid,
      queriesArray
    );

    return res.render('customer/account/orders/' + path, { orders: orders });
  } catch (error) {
    return next(error);
  }
}

async function checkOut(req, res, next) {
  // TODO I HAVE TO ADD THE DATE VALIDATION!!
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

    let saveData = false;
    if (!userData.name || !userData.phone) {
      saveData = true;
    }
    if (res.locals.configData.pickup !== 'only' && !userData.address.street) {
      saveData = true;
    }

    res.render('customer/cart/checkout', {
      user: userData,
      inputData: sessionData,
      saveData: saveData,
    });
  } catch (error) {
    return next(error);
  }
}

async function placeOrder(req, res, next) {
  const cart = res.locals.cart;
  const userId = res.locals.userid;
  let deliveryAddress;

  if (res.locals.configData.pickup === 'only' || req.body.pickup) {
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
    //Saving user Data in the database if it is incompleted and user checked the ckebox
    if (req.body.saveData) {
      await User.editUser(req, userId);
    }

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

    //deleting order from session and user database
    req.session.cart = null;
    await Order.deleteUserDbCart(res);

    res.redirect('/orders');
  } catch (error) {
    return next(error);
  }
}

async function cancelRequest(req, res, next) {
  try {
    const cancellationOrder = new Order();
    cancellationOrder.id = req.params.id;
    cancellationOrder.status = 'cancelreq';

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
  getOrderForQueries: getOrderForQueries,
};
