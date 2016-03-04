var express = require('express');

var error = {
	status_404: require('./404.js'),
	status_500: require('./500.js')
};

module.exports = (function() {
	var router = express.Router();

	router.use(error.status_404.index);
	router.use(error.status_500.index);

	return router;
})();