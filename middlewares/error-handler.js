function handleErrors(error, req, res, next) {
  console.log(error);
  
  res.status(500).render('shared/errors/500');
}

module.exports = handleErrors;
