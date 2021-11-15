const models = require('../models');

const { App } = models;

const appPage = (req, res) => {
  App.AppModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

module.exports.page = appPage;
