const passport = require('passport');

exports.login = (req, res, next) =>
   passport.authenticate('local', (error, user, info) => {
    if (error) return res.status(400).json({ message: info });
    if (user) return res.status(200).json({ message: info });
    return res.status(401).json({ message: info });
  })(req, res, next);

exports.logout = (req, res) => {
  req.logout();
  res.status(200).send();
};
