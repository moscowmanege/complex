module.exports = function(User) {
  var module = {};


  module.index = function(req, res) {
    var id = req.params.id;

    User.findById(id).exec(function(err, user) {
      res.render('admin/users/edit.jade', {user: user});
    });
  }

  module.form = function(req, res) {
    var post = req.body;
    var id = req.params.id;

    User.findById(id).exec(function(err, user) {

      user.login = post.login;
      if (post.password != '') {
        user.password = post.password;
      }
      user.email = post.email;
      user.status = post.status;

      user.save(function(err, user) {
        res.redirect('/admin/users');
      });
    });
  }


  return module;
}