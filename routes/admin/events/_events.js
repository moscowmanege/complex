var express = require('express');

var Model = require(__app_root + '/models/main.js');

var events = {
	list: require('./list.js')(Model.Event),
	add: require('./add.js')(Model.Event, Model.Category, Model.Subsidiary),
	edit: require('./edit.js')(Model.Event, Model.Category, Model.Subsidiary),
	remove: require('./remove.js')(Model.Event)
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