const Tokens = require('csrf');

const tokens = new Tokens();

function createCSRFToken(req, res, next) {
  if (req.method !== 'GET') {
    return next();
  }
  const secret = tokens.secretSync();
  req.session.csrfSecret = secret;

  const token = tokens.create(secret);
  res.locals.csrfToken = token;

  next();
}

function csrfTokenValidation(req, res, next) {
  if (req.method === 'GET') {
    return next();
  }
  const secret = req.session.csrfSecret;
  let token;

  if (req.body._csrf) {
    token = req.body._csrf;
  } else {
    token = req.params.csrf;
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
