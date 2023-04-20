const mongodb = require('mongodb');

const db = require('../data/database');

class Order {
  //status => Pending, Accepted, Fulfilled, Cancellation Requested, Cancelled
  constructor(
    productData,
    userData,
    status = 'pending',
    deliveryDate,
    pickup = false,
    request,
    orderDate,
    orderId,
    chefMessage = '',
    pickupAddress = {
      street: '2 Rue Genistre',
      postal: '1623',
      city: 'Luxembourg',
      country: 'Luxembourg',
    }
  ) {
    this.productData = productData;
    this.userData = userData;
    this.status = status;
    this.deliveryDate = deliveryDate;
    this.pickup = pickup;
    if (request) {
      this.request = [new Date(), request];
    } else {
      this.request = '';
    }
    this.orderDate = orderDate;
    this.id = orderId;
    if (chefMessage) {
      this.chefMessage = [new Date(), chefMessage];
    } else {
      this.chefMessage = '';
    }
    this.pickupAddress = pickupAddress;
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
        (o.orderId = o._id.toString()),
        o.chefMessage,
        o.pickupAddress
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
        (o.orderId = o._id.toString()),
        o.chefMessage,
        o.pickupAddress
      );
    });

    return orders;
  }

  static async findById(orderId) {
    let objectId;
    try {
      objectId = new mongodb.ObjectId(orderId);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: objectId });

    if (!order) {
      const error = new Error('Could not find order');
      error.code = 404;
      throw error;
    }

    return new Order(
      order.productData,
      order.userData,
      order.status,
      order.deliveryDate,
      order.pickup,
      order.request,
      order.orderDate,
      order._id.toString(),
      order.chefMessage,
      order.pickupAddress
    );
  }

  async editStatus() {
    const mongoId = new mongodb.ObjectId(this.id);

    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: mongoId });

    if (order.status === 'Cancelled' || order.status === 'Fulfilled') {
      return;
    }

    return db
      .getDb()
      .collection('orders')
      .updateOne({ _id: mongoId }, { $set: { status: this.status } });
  }

  async save() {
    //EDIT THIS CODE LATER
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

  async remove() {
    const mongoId = new mongodb.ObjectId(this.id);
    await db.getDb().collection('orders').deleteOne({ _id: mongoId });
  }
}

module.exports = Order;
