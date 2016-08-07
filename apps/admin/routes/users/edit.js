module.exports = function(Model) {
  var module = {};

  var User = Model.User;


  module.index = function(req, res, next) {
    var id = req.params.id;

    User.findById(id).exec(function(err, user) {
      if (err) return next(err);

      res.render('users/edit.jade', {user: user});
    });
  };

  module.form = function(req, res, next) {
    var post = req.body;
    var id = req.params.id;

    User.findById(id).exec(function(err, user) {
      if (err) return next(err);

      user.login = post.login;
      if (post.password !== '') {
        user.password = post.password;
      }
      user.email = post.email;
      user.status = post.status;

      user.save(function(err, user) {
        if (err) return next(err);

        res.redirect('/users');
      });
    });
  };


  return module;
};