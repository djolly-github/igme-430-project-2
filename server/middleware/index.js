const { ROUTES } = require('../routes');

/**
 * Middleware for a route that requires the user to be logged in
 * @param {*} req Request object
 * @param {*} res Response object
 * @param {*} next Next function to call
 * @returns next or redirect to root
 */
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect(ROUTES.root);
  }
  return next();
};

/**
 * Middleware for a route that requires the user to be logged out
 * @param {*} req Request object
 * @param {*} res Response object
 * @param {*} next Next function to call
 * @returns next or redirect to home
 */
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect(ROUTES.home);
  }
  return next();
};

/**
 * Middleware for a route that requires https
 * @param {*} req Request object
 * @param {*} res Response object
 * @param {*} next Next function to call
 * @returns next or redirect to https
 */
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

/**
 * Replacement for requiresSecure if in the development environment
 * @param {*} req Request object
 * @param {*} res Response object
 * @param {*} next Next function to call
 * @returns next
 */
const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// enforce https on production, bypass in development
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
