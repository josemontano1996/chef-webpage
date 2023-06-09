//ENVIROMENTAL VARIABLES
require('dotenv').config();

//EXTERNAL PACKAGE IMPORTS
const path = require('path');
const express = require('express');
const expressSession = require('express-session');
const helmet = require('helmet');
const NodeCache = require('node-cache');

//INTERNAL PACKAGE IMPORTS
const createSessionConfig = require('./util/session-config');
const db = require('./data/database');

//MIDDLEWARES IMPORTS
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddeware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const storeConfigData = require('./middlewares/config-cache');
const updateCartPricesMiddleware = require('./middlewares/update-cart-middleware');


//ROUTES IMPORTS
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const customerRoutes = require('./routes/customer.routes');
const menuRoutes = require('./routes/menu.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    hsts: false,
    httpsRedirect: false,
  })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(cartMiddleware);
 app.use(updateCartPricesMiddleware); 

app.use(checkAuthStatusMiddleware);

//serving config files from cache
app.use(storeConfigData);

//UNPROTECTED ROUTES
app.use(baseRoutes);
app.use(menuRoutes);
app.use('/cart', cartRoutes);

//PROTECTED ROUTES\
app.use(protectRoutesMiddeware);
app.use('/admin', adminRoutes);
app.use('/customer', customerRoutes);
app.use('/orders', ordersRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(process.env.PORT);
  })
  .catch(function (error) {
    console.log('Failed to connect to db');
    console.log(error);
  });
