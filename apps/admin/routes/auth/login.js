module.exports = function(Model) {
	var module = {};

	var User = Model.User;


	module.index = function(req, res) {
		req.session.user_id && (req.session.status == 'User' || req.session.status == 'Admin')
			? res.redirect('/auth')
			: res.render('auth/login.jade');
	};


	module.form = function(req, res, next) {
		var post = req.body;

		User.findOne({ 'login': post.login }).exec(function (err, person) {
			if (err) return next(err);

			if (!person) return res.redirect('back');
			person.verifyPassword(post.password, function(err, isMatch) {
				if (err) return next(err);

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
	};


	return module;
};