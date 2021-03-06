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
    mid.requiresSecure,
    ctrl.Account.changePassword,
  );

  // route premium status
  app.get(
    ROUTES.premiumStatus,
    mid.requiresLogin,
    ctrl.Account.getPremiumStatus,
  );

  // route premium toggle
  app.post(
    ROUTES.premiumStatus,
    mid.requiresLogin,
    mid.requiresSecure,
    ctrl.Account.togglePremium,
  );

  // route task list retrieval
  app.get(
    ROUTES._task,
    mid.requiresLogin,
    mid.requiresSecure,
    ctrl.Task.getTasks,
  );

  // route task creation
  app.post(
    ROUTES._task,
    mid.requiresLogin,
    mid.requiresSecure,
    ctrl.Task.createTask,
  );

  // route task deletion
  app.delete(
    ROUTES._task,
    mid.requiresLogin,
    mid.requiresSecure,
    ctrl.Task.deleteTask,
  );

  // route experience retrieval
  app.get(
    ROUTES._experience,
    mid.requiresLogin,
    mid.requiresSecure,
    ctrl.Account.getExperience,
  );

  // route experience update
  app.post(
    ROUTES._experience,
    mid.requiresLogin,
    mid.requiresSecure,
    ctrl.Account.updateExperience,
  );

  // route errors
  app.use((req, res) => {
    res.status(404).render('404');
  });

  app.use((err, req, res) => {
    console.log(err);
    res.status(500).render('500');
  });
};

module.exports = router;
