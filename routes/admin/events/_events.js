var express = require('express');

var events = {
	list: require('./list.js'),
	add: require('./add.js'),
	edit: require('./edit.js'),
	remove: require('./remove.js')
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(events.list.index)

	router.route('/add')
		.get(events.add.index)
		.post(events.add.form);

	router.route('/edit')
		.get(events.edit.index)
		.post(events.edit.form);

	router.route('/remove')
		.post(events.remove.index);

	return router;
})();