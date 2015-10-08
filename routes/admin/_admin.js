var express = require('express');

var Model = require(__app_root + '/models/main.js');

module.exports = (function() {
	var router = express.Router();

	var admin = {
		main: require('./main.js'),
		categorys: require('./categorys/_categorys.js')(Model),
		events: require('./events/_events.js')(Model),
		// halls: require('./halls/_halls.js'),
		// users: require('./users/_users.js')
	}

	router.route('/')
		.get(admin.main.index)

	router.use('/categorys', admin.categorys);
	router.use('/events', admin.events);
	// router.use('/halls', admin.halls);
	// router.use('/users', admin.users);

	return router;
})();