var express = require('express');

var globals = {
	error: require('./error/_error.js')
}

module.exports = (function() {
	var router = express.Router();

	router.use(globals.error);

	return router;
})();