var express = require('express');

var admin = {
	main: require('./main.js'),
	categorys: require('./categorys/_categorys.js'),
	events: require('./events/_events.js'),
	areas: require('./areas/_areas.js'),
	members: require('./members/_members.js'),
	users: require('./users/_users.js')
};

var setParams = function(req, res, next) {
	req.module_params = {};
	next();
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(admin.main.index)

	router.use('/categorys', admin.categorys);
	router.use('/events', admin.events);
	router.use('/areas', setParams, admin.areas);
	router.use('/members', admin.members);
	router.use('/users', admin.users);

	return router;
})();