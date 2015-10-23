var express = require('express');

var admin = {
	main: require('./main.js'),
	categorys: require('./categorys/_categorys.js'),
	events: require('./events/_events.js'),
	areas: require('./areas/_areas.js'),
	members: require('./members/_members.js'),
	users: require('./users/_users.js')
};

var routeParams = function(req, res, next) {
	req.module_params = {};
	next();
};

var checkAuth = function(req, res, next) {
	req.session.user_id
		? next()
		: res.redirect('/auth');
};

module.exports = (function() {
	var router = express.Router();

	router.use(checkAuth);

	router.route('/')
		.get(admin.main.index)

	router.use('/categorys', admin.categorys);
	router.use('/events', routeParams, admin.events);
	router.use('/areas', routeParams, admin.areas);
	router.use('/members', admin.members);
	router.use('/users', admin.users);

	return router;
})();