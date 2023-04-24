const mongodb = require('mongodb');

const db = require('../data/database');

class Config {
  constructor(
    webname,
    email,
    phone,
    pickup,
    street,
    postal,
    city,
    country,
    facebook,
    instagram,
    id
  ) {
    this.webname = webname;
    this.email = email;
    this.phone = phone;
    this.pickup = pickup;
    this.address = {
      street: street,
      postal: postal,
      city: city,
      country: country,
    };
    this.social = {
      facebook: facebook,
      instagram: instagram,
    };
    this._id = id;
  }

  static getConfig() {
    return db.getDb().collection('config').findOne({});
  }

  async save() {
    if (this._id) {
      const mongoId = new mongodb.ObjectId(this._id);

      await db
        .getDb()
        .collection('config')
        .updateOne(
          { _id: mongoId },
          {
            $set: {
              webname: this.webname,
              email: this.email,
              phone: this.phone,
              pickup: this.pickup,
              address: this.address,
              social: this.social,
            },
          }
        );
    } else {
      await db.getDb().collection('config').insertOne({
        webname: this.webname,
        email: this.email,
        phone: this.phone,
        pickup: this.pickup,
        address: this.address,
        social: this.social,
      });
    }
  }
}

module.exports = Config;
