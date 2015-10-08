var User = require(__app_root + '/models/main.js').User;


exports.index = function(req, res) {
  res.render('auth/login.jade');
}


exports.form = function(req, res) {
  var post = req.body;

  User.findOne({ 'login': post.login }).exec(function (err, person) {
    if (!person) return res.redirect('back');
    person.verifyPassword(post.password, function(err, isMatch) {
      if (isMatch) {
        req.session.user_id = person._id;
        req.session.status = person.status;
        req.session.login = person.login;
        res.redirect('/auth');
      }
      else {
        res.redirect('back');
      }
    });
  });
}