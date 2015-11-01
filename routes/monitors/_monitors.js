var express = require('express');

var Model = require(__app_root + '/models/main.js');

var monitors = {
	index: require('./index.js')
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(monitors.index.index);

	return router;
})();