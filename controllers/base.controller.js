function getIndex(req, res) {
  res.render('./index');
}

function getAbout(req, res) {
  res.render('./about');
}

module.exports = {
  getIndex: getIndex,
  getAbout: getAbout,
};
