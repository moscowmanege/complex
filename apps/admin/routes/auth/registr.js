module.exports = function(Model) {
	var User = Model.User;
	var module = {};


	module.index = function(req, res) {
		req.session.user_id
			? res.redirect('/auth')
			: res.render('auth/registr.jade');
	}


	module.form = function(req, res) {
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


	return module;
}