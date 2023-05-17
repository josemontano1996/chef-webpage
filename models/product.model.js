const db = require('../data/database');
const mongodb = require('mongodb'); //we import it for building objects id for mongodb

class Product {
  constructor(
    name,
    imageUrl,
    description,
    price,
    cuisine,
    type,
    minQuantity = null,
    _id = null
  ) {
    (this.name = name),
      (this.imageUrl = imageUrl),
      (this.description = description),
      (this.price = +price),
      (this.cuisine = cuisine),
      (this.type = type),
      (this.minQuantity = +minQuantity),
      (this.id = _id);
  }

  static async findMultiple(ids) {
    const productIds = ids.map(function (id) {
      return new mongodb.ObjectId(id);
    });
    const products = await db
      .getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (product) {
      return new Product(
        product.name,
        product.imageUrl,
        product.description,
        product.price,
        product.cuisine,
        product.type,
        product.minQuantity,
        product._id.toString()
      );
    });
  }

  static async findById(productId, exception = null) {
    const objectId = new mongodb.ObjectId(productId);
    let product;

    try {
      if (exception) {
        product = await db
          .getDb()
          .collection('products')
          .findOne({ _id: objectId }, { projection: { exception: 0 } });
        if (!product) {
          const error = new Error('Could not find product with provided id.');
          error.code = 404;
          throw error;
        }

        return new Product(
          product.name,
          null,
          null,
          product.price,
          null,
          null,
          product.minQuantity,
          product._id.toString()
        );
      } else {
        product = await db
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
          product.imageUrl,
          product.description,
          product.price,
          product.cuisine,
          product.type,
          product.minQuantity,
          product._id.toString()
        );
      }
    } catch (error) {
      error.code = 404;
      throw error;
    }
  }

  static async findAll() {
    const dishesArray = await db
      .getDb()
      .collection('products')
      .find()
      .sort({ name: 1 })
      .toArray();

    let startersArray = [];
    let mainDishesArray = [];
    let sideDishesArray = [];
    let dessertsArray = [];

    for (const dish of dishesArray) {
      if (dish.type === 'starter') {
        startersArray.push(dish);
      }
      if (dish.type === 'main') {
        mainDishesArray.push(dish);
      }
      if (dish.type === 'side') {
        sideDishesArray.push(dish);
      }
      if (dish.type === 'dessert') {
        dessertsArray.push(dish);
      }
    }

    const starters = startersArray.map(function (p) {
      return new Product(
        p.name,
        p.imageUrl,
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
        p.imageUrl,
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
        p.imageUrl,
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
        p.imageUrl,
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
      imageUrl: this.imageUrl,
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
              name: this.name.charAt(0).toUpperCase() + this.name.slice(1),
              imageUrl: this.imageUrl,
              description:
                this.description.charAt(0).toUpperCase() +
                this.description.slice(1),
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
