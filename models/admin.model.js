const mongodb = require('mongodb');

const db = require('../data/database');

class Admin {
  constructor(
    name,
    email,
    phone,
    street,
    postal,
    city,
    country,
    facebook,
    instagram
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
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
  }

  static getAccountInfo(id) {
    const mongoId = new mongodb.ObjectId(id);
    return db
      .getDb()
      .collection('users')
      .findOne({ _id: mongoId }, { projection: { password: 0 } });
  }

  async pushAdmin() {
    await db.getDb().collection('admin').insertOne({
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      social: this.social,
    });

  }
}

module.exports = Admin;
