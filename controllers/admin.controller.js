function getOrders(req, res) {
  res.render('admin/orders/orders');
}

function getAccount(req, res) {
  res.render('admin/account/account');
}

function getMenu(req, res) {
  res.render('admin/menu/menu');
}

function getNewProduct(req, res) {
  res.render('admin/menu/new-product');
}

module.exports = {
  getOrders: getOrders,
  getAccount: getAccount,
  getMenu: getMenu,
  getNewProduct: getNewProduct,
};
