module.exports = function(Model, Params) {
	var module = {};

	var User = Model.User;

	var msg = Params.msg;

	module.index = function(req, res) {
		req.session.user_id
			? res.redirect('/auth')
			: res.render('auth/registr.jade');
	};


	module.form = function(req, res, next) {
		var post = req.body;

		if (!post.login || !post.password || !post.email) return res.redirect('/auth/registr' + msg('Все поля должны быть заполнены!'));

		User.findOne({ $or: [ {'login': post.login}, {'email': post.email} ] }).exec(function(err, person) {
			if (err) return next('err');
			if (person) return res.redirect('/auth/registr' + msg('Пользователь с таким логином или Email уже существует!'));

			var user = new User({
				login: post.login,
				password: post.password,
				email: post.email
			});

			user.save(function(err, user) {
				if (err) return next('err');

				res.redirect('/auth');
			});
		});
	};


	return module;
};