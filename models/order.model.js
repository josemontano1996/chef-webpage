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
    orderId
  ) {
    this.productData = productData;
    this.userData = userData;
    this.status = status;
    this.deliveryDate = new Date(deliveryDate).toLocaleDateString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    this.pickup = pickup;
    this.request = request;
    this.orderDate = orderDate;
    this.id = orderId;
  }

  async save() {
    if (this.id) {
    } else {
      const orderDocument = {
        productData: this.productData,
        userData: this.userData,
        status: this.status,
        deliveryDate: this.deliveryDate,
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
