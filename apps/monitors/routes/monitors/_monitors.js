var express = require('express');

var Model = require(__app_root + '/models/main.js');

var monitors = {
	index: require('./index.js')(Model),
	test: require('./test.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(monitors.index.index);

	router.route('/test')
		.get(monitors.test.test1);

	return router;
})();