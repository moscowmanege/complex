exports.index = function(req, res) {
  req.session.destroy();
  res.clearCookie('session');
  res.redirect('/auth/login');
}