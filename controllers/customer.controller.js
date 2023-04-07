function getOrders(req, res) {
  res.render('customer/orders/orders');
}

function getAccount(req, res) {
  res.render('customer/account/account');
}

module.exports = {
  getOrders: getOrders,
  getAccount: getAccount,
};
