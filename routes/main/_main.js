var express = require('express');

var Model = require(__app_root + '/models/main.js');

var main = {
	index: require('./index.js'),
	content: require('./content.js')
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(main.index.index)

	router.route('/about')
		.get(main.content.about)

	return router;
})();