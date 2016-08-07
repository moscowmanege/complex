module.exports = function(Model) {
  var module = {};

  var User = Model.User;


  module.index = function(req, res) {
    if (req.session.status == 'Admin') {
      res.render('users/add.jade');
    } else {
      res.redirect('back');
    }
  };

  module.form = function(req, res, next) {
    var post = req.body;

    var user = new User();

    user.login = post.login;
    user.password = post.password;
    user.email = post.email;
    user.status = post.status;

    user.save(function(err, user) {
      if (err) return next(err);

      res.redirect('/users');
    });
  };


  return module;
};