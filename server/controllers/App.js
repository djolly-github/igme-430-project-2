const appPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });

module.exports.page = appPage;
