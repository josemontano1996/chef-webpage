const db = require('../data/database');
const NodeCache = require('node-cache');

async function storeConfigData(req, res, next) {
  let configData;

  let configCache = new NodeCache({ stdTTL: 86400, checkperiod: 0 });

  // set up the change stream outside the middleware function
  const configCollection = db.getDb().collection('config');

  configData = configCache.get('configData');
  if (!configData) {
    configData = await configCollection.findOne({});
    configCache.set('configData', configData);
  }

  res.locals.configData = configData;
  console.log(configData);
  next();
}

module.exports = storeConfigData;
