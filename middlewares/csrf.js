const Tokens = require('csrf');

const tokens = new Tokens();

function csrfMiddleware(req, res, next) {
  
    if (req.method === 'GET') {
      const secret = tokens.secretSync();
      req.session.csrfSecret = secret;

      const token = tokens.create(secret);
      res.locals.csrfToken = token;
    } else {
      const secret = req.session.csrfSecret;
      let token;

      if (req.body._csrf) {
        token = req.body._csrf;
      } else {
        token = req.params.csrf;
      }

      if (!tokens.verify(secret, token)) {
        return res.status(403).render('shared/errors/403');
      }
    }
    next();
  
}

module.exports = csrfMiddleware;
