const Tokens = require('csrf');

const tokens = new Tokens();

function createCSRFToken(req, res, next) {
  const secret = tokens.secretSync();
  req.session.csrfSecret = secret;

  const token = tokens.create(secret);

  res.locals.csrfToken = token;

  next();
}

function csrfTokenValidation(req, res, next) {
  const secret = req.session.csrfSecret;
  let token;

  if (req.headers['x-csrf-token']) {
    token = req.headers['x-csrf-token'];
  } else {
    token = req.body._csrf;
  }

  if (!tokens.verify(secret, token)) {
    res.status(403).render('shared/errors/403');
  } else {
    next();
  }
}

module.exports = {
  createCSRFToken: createCSRFToken,
  csrfTokenValidation: csrfTokenValidation,
};
