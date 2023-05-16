const mongodb = require('mongodb');

const db = require('../data/database');

const Product = require('./product.model');

class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = +totalQuantity;
    this.totalPrice = +totalPrice;
  }

  static async saveCartinDb(res) {
    const mongoId = new mongodb.ObjectId(res.locals.userid);
    await db
      .getDb()
      .collection('users')
      .updateOne({ _id: mongoId }, { $set: { cart: res.locals.cart } });
  }

  async updatePrices() {
    const productIds = this.items.map(function (item) {
      return item.product.id;
    });

    const products = await Product.findMultiple(productIds);

    const deletableCartItemProductIds = [];

    for (const cartItem of this.items) {
      const product = products.find(function (prod) {
        return prod.id === cartItem.product.id;
      });

      if (!product) {
        // product was deleted!
        // "schedule" for removal from cart
        deletableCartItemProductIds.push(cartItem.product.id);
        continue;
      }

      // product was not deleted
      // set product data and total price to latest price from database
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    if (deletableCartItemProductIds.length > 0) {
      this.items = this.items.filter(function (item) {
        return deletableCartItemProductIds.indexOf(item.product.id) < 0;
      });
    }

    // re-calculate cart totals
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) {
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
  }

  addItem(product, quantity) {
    const cartItem = {
      product: product,
      quantity: +quantity,
      totalPrice: product.price * quantity,
    };

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product.id === product.id) {
        cartItem.quantity += item.quantity;
        cartItem.totalPrice += item.totalPrice;
        this.items[i] = cartItem;

        this.totalQuantity += quantity;
        this.totalPrice += product.price * quantity;
        return;
      }
    }

    this.items.push(cartItem);
    this.totalQuantity += quantity;
    this.totalPrice += product.price * quantity;
  }

  updateItem(productId, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product.id === productId && newQuantity > 0) {
        const cartItem = { ...item };
        const quantityChange = +newQuantity - item.quantity;
        cartItem.quantity = +newQuantity;
        cartItem.totalPrice = newQuantity * item.product.price;
        this.items[i] = cartItem;

        this.totalQuantity = +this.totalQuantity + quantityChange;
        this.totalPrice += quantityChange * item.product.price;
        return { updatedItemPrice: cartItem.totalPrice };
      } else if (item.product.id === productId && newQuantity <= 0) {
        this.items.splice(i, 1);
        this.totalQuantity = this.totalQuantity - item.quantity;
        this.totalPrice -= item.totalPrice;
        return { updatedItemPrice: 0 };
      }
    }
  }
}

module.exports = Cart;
