const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017',
    databaseName: 'chef-webpage',
    collection: 'sessions',
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 100,
    },
  };
}

module.exports = createSessionConfig;
