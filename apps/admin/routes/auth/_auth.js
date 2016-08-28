var express = require('express');

var Model = require(__app_root + '/models/main.js');
var Params = {
	msg: require('../_params/auth').msg,
	validateEmail: require('../_params/auth').validateEmail
};

var auth = {
	login: require('./login.js')(Model, Params),
	registr: require('./registr.js')(Model, Params),
	logout: require('./logout.js')(),
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(function(req, res) {
			req.session.user_id
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