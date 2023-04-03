const uuid = require('uuid');

// middleware anti-CSRF
async function csrfMiddleware(req, res, next) {
  const tokenName = 'csrf_token';
  const csrfToken = uuid.v4();

  // establece la cookie del token CSRF
  res.cookie(tokenName, csrfToken, {
    httpOnly: true,
    maxAge: 86400000,
  });
  // agrega el token CSRF a la variable local para el motor de vistas
  res.locals.csrfToken = csrfToken;

  console.log(res.locals.csrfToken);
  console.log(req.body.csrfToken);
  console.log(req.headers['x-csrf-token']);
  // verifica que el token CSRF enviado por el cliente sea válido
  if (
    req.method !== 'GET' &&
    req.method !== 'HEAD' &&
    req.method !== 'OPTIONS'
  ) {
    const clientCsrfToken = req.body.csrfToken || req.headers['x-csrf-token'];

    if (!clientCsrfToken || clientCsrfToken !== csrfToken) {
      return res.sendStatus(403); // se deniega el acceso
    }
  }

  next();
}

module.exports = csrfMiddleware;
