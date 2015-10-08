var User = require(__app_root + '/models/main.js').User;


exports.index = function(req, res) {
  if (!req.session.user_id)
    res.render('auth/registr.jade');
  else
    res.redirect('/');
}


exports.form = function(req, res) {
  var post = req.body;

  var user = new User({
    login: post.login,
    password: post.password,
    email: post.email
  });

  user.save(function(err, user) {
    if (err) return res.redirect('back');

    req.session.user_id = user._id;
    req.session.login = user.login;
    req.session.status = user.status;
    res.redirect('/auth');
  });
}