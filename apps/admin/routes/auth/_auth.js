var express = require('express');

var Model = require(__app_root + '/models/main.js');
var Params = {
	msg: function(text) { return '/?message=' + encodeURIComponent(text); }
}

var auth = {
	login: require('./login.js')(Model, Params),
	registr: require('./registr.js')(Model, Params),
	logout: require('./logout.js')(),
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(function(req, res) {
			req.session.user_id && (req.session.status == 'User' || req.session.status == 'Admin')
				? res.redirect('/')
				: res.redirect('/auth/login');
		});

	router.route('/login')
		.get(auth.login.index)
		.post(auth.login.form);

	router.route('/logout')
		.get(auth.logout.index);

	router.route('/registr')
		.get(auth.registr.index)
		.post(auth.registr.form);

	return router;
})();