//EXTERNAL PACKAGE IMPORTS
const path = require('path');
const express = require('express');
const expressSession = require('express-session');

//INTERNAL PACKAGE IMPORTS
const createSessionConfig = require('./util/session-config');
const db = require('./data/database');

//MIDDLEWARES IMPORTS
const errorHandlerMiddleware = require('./middlewares/error-handler');

//ROUTES IMPORTS
const baseRoutes = require('./routes/base.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false })); //form submision

//creating a session
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig))

//here goes the csrf protection

app.use(baseRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log('Failed to connect to db');
    console.log(error);
  });
