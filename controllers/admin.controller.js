function getOrders(req, res) {
  res.render('admin/orders/orders');
}

function getAccount(req, res) {
  res.render('admin/account/account');
}

module.exports = {
  getOrders: getOrders,
  getAccount: getAccount,
};
