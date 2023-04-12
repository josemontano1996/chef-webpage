class Order {
  //status => pending, accepted, fulfilled, cancelled
  constructor(cart, userData, status = 'pending', date, orderId) {}
}

module.exports = Order;
