const { Account } = require('../models');
const { ROUTES } = require('../routes');

/**
 * Renders the login page with csrf token
 * @param {*} request request object
 * @param {*} response response object
 */
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

/**
 * Handler for user logout
 * @param {*} request request object
 * @param {*} response response object
 */
const logout = (req, res) => {
  req.session.destroy();
  res.redirect(ROUTES.root);
};

/**
 * Handler for user login
 * @param {*} request request object
 * @param {*} response response object
 * @returns response.status().json() depending on request parameters
 */
const login = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to guarentee valid types
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // handle missing fields
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // return result of account authentication attempt
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    // handle incorrect fields
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    // set account session
    req.session.account = Account.AccountModel.toAPI(account);

    // reroute to home
    return res.json({ redirect: ROUTES.home });
  });
};

/**
 * Handler for user signup
 * @param {*} request request object
 * @param {*} response response object
 * @returns response.status().json() depending on request parameters
 */
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to guarentee valid types
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // handle missing fields
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // handle passwords not matching
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // return result of account generation attempt
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    // create account and reroute to home
    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: ROUTES.home });
    });

    savePromise.catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);

      // handle existing username
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      // handle any other errors
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

/**
 * Gets CSRF token from request and returns csrf in json on response
 * @param {*} request request object
 * @param {*} response response object
 */
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
