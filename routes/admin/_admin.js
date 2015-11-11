var express = require('express');

var admin = {
	main: require('./main.js'),
	categorys: require('./categorys/_categorys.js'),
	events: require('./events/_events.js'),
	areas: require('./areas/_areas.js'),
	members: require('./members/_members.js'),
	partners: require('./partners/_partners.js'),
	users: require('./users/_users.js')
};

var checkAuth = function(req, res, next) {
	req.session.user_id
		? next()
		: res.redirect('/auth');
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(checkAuth, admin.main.index)

	router.use('/categorys', checkAuth, admin.categorys);
	router.use('/events', checkAuth, admin.events);
	router.use('/areas', checkAuth, admin.areas);
	router.use('/members', checkAuth, admin.members);
	router.use('/partners', checkAuth, admin.partners);
	router.use('/users', checkAuth, admin.users);

	return router;
})();