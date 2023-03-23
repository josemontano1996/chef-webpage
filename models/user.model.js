const bcrypt = require('bcryptjs');

const db = require('../data/database');

class User {
  constructor(email, password, phone, name, street, postal, city, country) {
    (this.email = email),
      (this.password = password),
      (this.phone = phone),
      (this.name = name),
      (this.address = {
        street: street,
        postal: postal,
        city: city,
        contry: country,
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
