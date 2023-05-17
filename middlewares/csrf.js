const Token = require('csrf');
const tokens = new Token();

function generateCsrfToken(req, res, next) {
  const secret = tokens.secretSync();
  req.session.csrfSecret = secret;

  const token = tokens.create(secret);
  res.locals.csrfToken = token;

  next();
}

function validateCsrfToken(req, res, next) {
  const secret = req.session.csrfSecret;

  let token;
  console.log(req.params);

  if (req.body._csrf) {
    token = req.body._csrf;
  } else {
    token = req.params.csrf;
  }

  if (!tokens.verify(secret, token)) {
    return res.status(403).render('shared/errors/403');
  }

  next();
}

module.exports = {
  generateCsrfToken: generateCsrfToken,
  validateCsrfToken: validateCsrfToken,
};
