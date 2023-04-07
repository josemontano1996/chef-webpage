//EXTERNAL PACKAGE IMPORTS
const path = require('path');
const express = require('express');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

//INTERNAL PACKAGE IMPORTS
const createSessionConfig = require('./util/session-config');
const db = require('./data/database');

//MIDDLEWARES IMPORTS
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddeware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');

/* const csrfProtection = require('./middlewares/customs-csrf-protection'); */

//ROUTES IMPORTS
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const customerRoutes = require('./routes/customer.routes');
const menuRoutes = require('./routes/menu.routes');
const cartRoutes = require('./routes/cart.routes');

const app = express();
app.use(helmet());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//creating a session
app.use(
  cookieParser('super-secret', {
    httpOnly: true,
  })
);
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

//here goes the csrf protection
/* app.use(csrfProtection); */

app.use(cartMiddleware);

app.use(checkAuthStatusMiddleware);

//UNPROTECTED ROUTES
app.use(baseRoutes);
app.use(menuRoutes);
app.use('/cart', cartRoutes);

//PROTECTED ROUTES\
app.use(protectRoutesMiddeware);
app.use('/admin', adminRoutes);
app.use('/customer', customerRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log('Failed to connect to db');
    console.log(error);
  });
