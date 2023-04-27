const mongodb = require('mongodb');

const db = require('../data/database');
const { query } = require('express');

class Order {
  //status => Pending, Accepted, Fullfilled, Cancellation Requested, Cancelled
  constructor(
    productData,
    userData,
    status = 'pending',
    deliveryDate,
    pickup = false,
    request,
    deliveryAddress = {},
    orderDate,
    orderId,
    chefMessage = '',
    commented
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
    this.deliveryAddress = { ...deliveryAddress };
    this.orderDate = orderDate;
    this.id = orderId;
    if (chefMessage) {
      this.chefMessage = [new Date(), chefMessage];
    } else {
      this.chefMessage = '';
    }
    this.commented = commented;
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
        o.deliveryAddress,
        o.orderDate,
        (o.orderId = o._id.toString()),
        o.chefMessage
      );
    });

    return orders;
  }

  static async findForQuery(query) {
    const ordersArray = await db
      .getDb()
      .collection('orders')
      .find({ status: query })
      .sort({ deliveryDate: -1 })
      .toArray();

    const orders = ordersArray.map((o) => {
      return new Order(
        o.productData,
        o.userData,
        o.status,
        o.deliveryDate,
        o.pickup,
        o.request,
        o.deliveryAddress,
        o.orderDate,
        (o.orderId = o._id.toString()),
        o.chefMessage,
        o.commented
      );
    });

    return orders;
  }

  static async findForMultipleQueries(userid, queryArray) {
    const ordersArray = await db
      .getDb()
      .collection('orders')
      .find({ 'userData._id': userid, status: { $in: queryArray } })
      .sort({ deliveryDate: -1 })
      .toArray();
    
    const orders = ordersArray.map((o) => {
      return new Order(
        o.productData,
        o.userData,
        o.status,
        o.deliveryDate,
        o.pickup,
        o.request,
        o.deliveryAddress,
        o.orderDate,
        (o.orderId = o._id.toString()),
        o.chefMessage,
        o.commented
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
        o.deliveryAddress,
        o.orderDate,
        (o.orderId = o._id.toString()),
        o.chefMessage,
        o.commented
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
      order.deliveryAddress,
      order.orderDate,
      order._id.toString(),
      order.chefMessage,
      order.commented
    );
  }

  async editStatus() {
    const mongoId = new mongodb.ObjectId(this.id);

    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: mongoId });

    if (
      order.status === this.status ||
      order.status === 'cancelled' ||
      order.status === 'fullfilled'
    ) {
      return;
    }

    return await db
      .getDb()
      .collection('orders')
      .updateOne({ _id: mongoId }, { $set: { status: this.status } });
  }

  async save() {
    if (this.id) {
      const mongoId = new mongodb.ObjectId(this.id);
      return await db
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
        deliveryAddress: this.deliveryAddress,
        orderDate: new Date().toLocaleDateString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          weekday: 'short',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };

      return await db.getDb().collection('orders').insertOne(orderDocument);
    }
  }

  async remove() {
    const mongoId = new mongodb.ObjectId(this.id);
    await db.getDb().collection('orders').deleteOne({ _id: mongoId });
  }
}

module.exports = Order;
