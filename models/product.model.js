const db = require('../data/database');
const mongodb = require('mongodb'); //we import it for building objects id for mongodb

class Product {
  constructor(
    name,
    description,
    price,
    cuisine,
    type,
    minQuantity = null,
    _id = null
  ) {
    (this.name = name.charAt(0).toUpperCase() + name.slice(1)),
      (this.description =
        description.charAt(0).toUpperCase() + description.slice(1)),
      (this.price = price),
      (this.cuisine = cuisine),
      (this.type = type),
      (this.minQuantity = minQuantity),
      (this.id = _id);
  }

  static async findById(productId) {
    let objectId;
    try {
      objectId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db
      .getDb()
      .collection('products')
      .findOne({ _id: objectId });

    if (!product) {
      const error = new Error('Could not find product with provided id.');
      error.code = 404;
      throw error;
    }

    return new Product(
      product.name,
      product.description,
      product.price,
      product.cuisine,
      product.type,
      product.minQuantity,
      product._id.toString()
    );
  }

  static async findAll() {
    const startersArray = await db
      .getDb()
      .collection('products')
      .find({ type: 'starter' })
      .sort({ name: 1 }) // sort by name in ascending order
      .toArray();
    const mainDishesArray = await db
      .getDb()
      .collection('products')
      .find({ type: 'main' })
      .sort({ name: 1 })
      .toArray();
    const sideDishesArray = await db
      .getDb()
      .collection('products')
      .find({ type: 'side' })
      .sort({ name: 1 })
      .toArray();
    const dessertsArray = await db
      .getDb()
      .collection('products')
      .find({ type: 'dessert' })
      .sort({ name: 1 })
      .toArray();

    const starters = startersArray.map(function (p) {
      return new Product(
        p.name,
        p.description,
        p.price,
        p.cuisine,
        p.type,
        p.minQuantity,
        p._id.toString()
      );
    });
    const mainDishes = mainDishesArray.map(function (p) {
      return new Product(
        p.name,
        p.description,
        p.price,
        p.cuisine,
        p.type,
        p.minQuantity,
        p._id.toString()
      );
    });
    const sideDishes = sideDishesArray.map(function (p) {
      return new Product(
        p.name,
        p.description,
        p.price,
        p.cuisine,
        p.type,
        p.minQuantity,
        p._id.toString()
      );
    });
    const desserts = dessertsArray.map(function (p) {
      return new Product(
        p.name,
        p.description,
        p.price,
        p.cuisine,
        p.type,
        p.minQuantity,
        p._id.toString()
      );
    });

    return {
      starters,
      mainDishes,
      sideDishes,
      desserts,
    };
  }

  async save() {
    const productData = {
      name: this.name,
      description: this.description,
      cuisine: this.cuisine,
      type: this.type,
      minQuantity: this.minQuantity,
      price: this.price,
    };

    if (this.id) {
      //if the product already exists then update the info
      const mongoId = new mongodb.ObjectId(this.id);
      await db
        .getDb()
        .collection('products')
        .updateOne(
          { _id: mongoId },
          {
            $set: {
              name: this.name,
              description: this.description,
              cuisine: this.cuisine,
              type: this.type,
              minQuantity: this.minQuantity,
              price: this.price,
            },
          }
        );
    } else {
      //if it doesnt exist, create a new one
      await db.getDb().collection('products').insertOne(productData);
    }
  }

  async remove() {
    const mongoId = new mongodb.ObjectId(this.id);
    await db.getDb().collection('products').deleteOne({ _id: mongoId });
  }
}

module.exports = Product;
