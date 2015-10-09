var express = require('express');

var admin = {
	main: require('./main.js'),
	categorys: require('./categorys/_categorys.js'),
	events: require('./events/_events.js'),
	subsidiaries: require('./subsidiaries/_subsidiaries.js'),
	users: require('./users/_users.js'),
	// halls: require('./halls/_halls.js'),
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(admin.main.index)

	router.use('/categorys', admin.categorys);
	router.use('/events', admin.events);
	router.use('/subsidiaries', admin.subsidiaries);
	router.use('/users', admin.users);
	// router.use('/halls', admin.halls);

	return router;
})();