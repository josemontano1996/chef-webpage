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

  static async editUser(req, userId) {
    const mongoId = new mongodb.ObjectId(userId);

    const currentUser = await db
      .getDb()
      .collection('users')
      .findOne({ _id: mongoId });

    if (req.body.email !== currentUser.email) {
      const userExistsAlready = await db
        .getDb()
        .collection('users')
        .findOne({ email: req.body.email });

      if (userExistsAlready) {
        return { statusMessage: 'This email address is already being used.' };
      }
    }

    await db
      .getDb()
      .collection('users')
      .updateOne(
        { _id: mongoId },
        {
          $set: {
            email: req.body.email,
            name: req.body.fullname,
            phone: req.body.phone,
            address: {
              street: req.body.street ?? '',
              postal: req.body.postal ?? '',
              city: req.body.city ?? '',
              country: req.body.country ?? '',
            },
          },
        }
      );
    return { statusMessage: 'Your data was succesfully updated!' };
  }
}

module.exports = User;
