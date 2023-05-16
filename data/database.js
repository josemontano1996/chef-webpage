const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.DATABASE_URI);
  database = client.db(process.env.DATABASE_NAME);
}

function getDb() {
  if (!database) {
    throw new Error('Not connected to db');
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
