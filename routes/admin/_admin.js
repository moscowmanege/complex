var express = require('express');

var admin = {
	main: require('./main.js'),
	categorys: require('./categorys/_categorys.js'),
	events: require('./events/_events.js'),
	// halls: require('./halls/_halls.js'),
	// users: require('./users/_users.js')
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(admin.main.index)

	router.use('/categorys', admin.categorys);
	router.use('/events', admin.events);
	// router.use('/halls', admin.halls);
	// router.use('/users', admin.users);

	return router;
})();