const mongodb = require('mongodb');

const db = require('../data/database');

class Order {
  //status => pending, accepted, fulfilled, cancelled
  constructor(
    productData,
    userData,
    status = 'pending',
    deliveryDate,
    pickup = false,
    request = '',
    orderDate,
    orderId,
    chefMessage = ''
  ) {
    this.productData = productData;
    this.userData = userData;
    this.status = status;
    this.deliveryDate = deliveryDate;
    this.pickup = pickup;
    this.request = request;
    this.orderDate = orderDate;
    this.id = orderId;
    this.chefMessage = chefMessage;
  }

  static async findAll() {
    const ordersArray = await db
      .getDb()
      .collection('orders')
      .find()
      .sort({ _id: -1 })
      .toArray();

    const orders = ordersArray.map((o) => {
      return new Order(
        o.productData,
        o.userData,
        o.status,
        o.deliveryDate,
        o.pickup,
        o.request,
        o.orderDate,
        o.orderId,
        o.chefMessage
      );
    });

    return orders;
  }

  static async findAllForUser(userId) {
    const ordersArray = await db
      .getDb()
      .collection('orders')
      .find({ 'userData._id': userId })
      .toArray();

    const orders = ordersArray.map((o) => {
      return new Order(
        o.productData,
        o.userData,
        o.status,
        o.deliveryDate,
        o.pickup,
        o.request,
        o.orderDate,
        o.orderId,
        o.chefMessage
      );
    });
    
    return orders;
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  async save() {
    if (this.id) {
      const mongoId = new mongodb.ObjectId(this.id);
      return db
        .getDb()
        .collection('orders')
        .updateOne(
          { _id: mongoId },
          {
            $set: {
              status: this.status,
              deliveryDate: this.deliveryDate,
              chefMessage: this.chefMessage,
            },
          }
        );
    } else {
      const orderDocument = {
        productData: this.productData,
        userData: this.userData,
        status: this.status,
        deliveryDate: new Date(this.deliveryDate).toLocaleDateString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          weekday: 'short',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        pickup: this.pickup,
        request: this.request,
        orderDate: new Date().toLocaleDateString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          weekday: 'short',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };

      return db.getDb().collection('orders').insertOne(orderDocument);
    }
  }
}

module.exports = Order;
