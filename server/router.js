const ctrl = require('./controllers');
const mid = require('./middleware');
const { ROUTES } = require('./routes');

const router = (app) => {
  // route token request utility
  app.get(
    ROUTES._getToken,
    mid.requiresSecure,
    ctrl.Account.getToken,
  );

  // route login page
  app.get(
    ROUTES.login,
    mid.requiresSecure,
    mid.requiresLogout,
    ctrl.Account.loginPage,
  );

  // route user login action
  app.post(
    ROUTES.login,
    mid.requiresSecure,
    mid.requiresLogout,
    ctrl.Account.login,
  );

  // route user signup action
  app.post(
    ROUTES.signup,
    mid.requiresSecure,
    mid.requiresLogout,
    ctrl.Account.signup,
  );

  // route user logout action
  app.get(
    ROUTES.logout,
    mid.requiresLogin,
    ctrl.Account.logout,
  );

  // route root page to login page or home page depending on if the user is logged out
  app.get(
    ROUTES.root,
    mid.requiresSecure,
    mid.requiresLogout,
    ctrl.Account.loginPage,
  );

  // route home page
  app.get(
    ROUTES.home,
    mid.requiresLogin,
    ctrl.App.page,
  );

  // route password confirm for password reset
  app.post(
    ROUTES.passwordChange,
    mid.requiresLogin,
    ctrl.Account.changePassword,
  );
};

module.exports = router;
