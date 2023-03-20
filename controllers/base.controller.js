function getIndex(req, res) {
  res.render('./index');
}

function getAbout(req, res) {
  res.render('./about');
}

function getMenu(req, res) {
  res.render('./menu');
}

function getAuth(req, res) {
  res.render('./auth');
}

module.exports = {
  getIndex: getIndex,
  getAbout: getAbout,
  getMenu: getMenu,
  getAuth: getAuth,
};
