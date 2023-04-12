const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/database');

class User {
  constructor(email, password, name, phone, street, postal, city, country) {
    (this.email = email),
      (this.password = password),
      (this.name = name),
      (this.phone = phone),
      (this.address = {
        street: street,
        postal: postal,
        city: city,
        country: country,
      });
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection('users').insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      phone: this.phone,
      address: this.address,
    });
  }

  static getUserWithSameId(id) {
    const mongoId = new mongodb.ObjectId(id);
    return db
      .getDb()
      .collection('users')
      .findOne({ _id: mongoId }, { projection: { password: 0 } });
  }

  getUserWithSameEmail() {
    return db.getDb().collection('users').findOne({ email: this.email });
  }

  async userExistsAlready() {
    const existingUser = await this.getUserWithSameEmail();

    if (existingUser) {
      return true;
    } else {
      return false;
    }
  }

  comparePassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
