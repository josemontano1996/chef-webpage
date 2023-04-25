const mongodb = require('mongodb');

const db = require('../data/database');

class Config {
  constructor(
    webname,
    email,
    phone,
    street,
    postal,
    city,
    country,
    pickup,
    pickupMessage,
    pickupStreet,
    pickupPostal,
    pickupCity,
    pickupCountry,
    facebook,
    instagram,
    id
  ) {
    this.webname = webname;
    this.email = email;
    this.phone = phone;
    this.address = {
      street: street,
      postal: postal,
      city: city,
      country: country,
    };
    this.pickup = pickup;
    this.pickupMessage = pickupMessage;
    this.pickupAddress = {
      pickupStreet: pickupStreet,
      pickupPostal: pickupPostal,
      pickupCity: pickupCity,
      pickupCountry: pickupCountry,
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
              address: this.address,
              pickup: this.pickup,
              pickupMessage: this.pickupMessage,
              pickupAddress: this.pickupAddress,
              social: this.social,
            },
          }
        );
    } else {
      await db.getDb().collection('config').insertOne({
        webname: this.webname,
        email: this.email,
        phone: this.phone,
        address: this.address,
        pickup: this.pickup,
        pickupMessage: this.pickupMessage,
        pickupAddress: this.pickupAddress,
        social: this.social,
      });
    }
  }
}

module.exports = Config;
