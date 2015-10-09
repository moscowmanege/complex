module.exports = function(User) {
  var module = {};


  module.index = function(req, res) {
    if (req.session.status == 'Admin') {
      res.render('admin/users/add.jade');
    } else {
      res.redirect('back');
    }
  }

  module.form = function(req, res) {
    var post = req.body;

    var user = new User();

    user.login = post.login;
    user.password = post.password;
    user.email = post.email;
    user.status = post.status;

    user.save(function(err, user) {
      res.redirect('/admin/users');
    });
  }


  return module;
}