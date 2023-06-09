const sessionFlash = require('../util/session-flash');

const NodeCache = require('node-cache');
const { v4: uuidv4 } = require('uuid');

const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Config = require('../models/config.model');
const User = require('../models/user.model');
const Schedule = require('../models/schedule.model');

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findForQuery('pending');

    res.render('admin/orders/pending', { orders: orders });
  } catch (error) {
    return next(error);
  }
}

async function getSchedule(req, res, next) {
  try {
    const schedule = await Schedule.getSchedule();

    return res.render('admin/account/schedule', { schedule: schedule });
  } catch (error) {
    return next(error);
  }
}

async function postSchedule(req, res, next) {
  try {
    const r = req.body;
    const schedule = new Schedule(r.clockIn, r.clockOut, [
      r.monday,
      r.tuesday,
      r.wednesday,
      r.thursday,
      r.friday,
      r.saturday,
      r.sunday,
    ]);

    await schedule.saveSchedule();

    res.redirect('/admin/schedule');
  } catch (error) {
    return next(error);
  }
}

async function postHolidays(req, res, next) {
  try {
    const r = req.body;
    const holiday = new Schedule(
      null,
      null,
      null,
      uuidv4(),
      r.holidayFrom,
      r.holidayTo
    );

    await holiday.saveHoliday();
    res.redirect('/admin/schedule');
  } catch (error) {
    return next(error);
  }
}

async function deleteHolidays(req, res, next) {
  try {
    const holidayId = req.params.holidayId;
    Schedule.deleteHolidays(holidayId);

    res.redirect('/admin/schedule');
  } catch (error) {
    return next(error);
  }
}

async function getQueryOrders(req, res) {
  let query = req.params.query;

  try {
    const orders = await Order.findForQuery(query);

    res.render('admin/orders/' + query, { orders: orders });
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
    const userData = await User.getUserWithSameId(userid);

    res.render('admin/account/account', {
      user: userData,
      inputData: sessionData,
    });
  } catch (error) {
    return next(error);
  }
}

async function getConfig(req, res, next) {
  try {
    const config = await Config.getConfig();
    res.render('admin/account/web-configuration', {
      config: config,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateConfig(req, res, next) {
  try {
    const admin = new Config(
      req.body.webname,
      req.body.email,
      req.body.phone,
      req.body.street,
      req.body.postal,
      req.body.city,
      req.body.country,
      req.body.pickup,
      req.body.pickupMessage,
      req.body.pickupStreet,
      req.body.pickupPostal,
      req.body.pickupCity,
      req.body.pickupCountry,
      req.body.minDelivery,
      req.body.deliveryPrice,
      req.body.freeDelivery,
      req.body.facebook,
      req.body.instagram,
      req.body._id
    );

    const configData = await admin.save();

    const configCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

    configCache.set('configData', configData);
  } catch (error) {
    return next(error);
  }

  return res.redirect('/admin/config');
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
    res.locals.imageUrl,
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
    res.locals.imageUrl,
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
    product = await Product.findById(req.params.productId);
   
    await product.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: 'Deleted product!' });
}

module.exports = {
  getOrders: getOrders,
  getSchedule: getSchedule,
  postSchedule: postSchedule,
  postHolidays: postHolidays,
  deleteHolidays: deleteHolidays,
  getAccount: getAccount,
  getMenu: getMenu,
  getNewProduct: getNewProduct,
  addNewProduct: addNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  updateOrderStatus: updateOrderStatus,
  getQueryOrders: getQueryOrders,
  getConfig: getConfig,
  updateConfig: updateConfig,
};
