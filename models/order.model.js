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
    deliveryAddress = {},
    orderDate,
    orderId,
    chefMessage = ''
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
    console.log(query);
    const ordersArray = await db
      .getDb()
      .collection('orders')
      .find({ status: query.toString() })
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
        o.deliveryAddress,
        o.orderDate,
        (o.orderId = o._id.toString()),
        o.chefMessage
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
      order.chefMessage
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
      order.status === 'Cancelled' ||
      order.status === 'Fulfilled'
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
