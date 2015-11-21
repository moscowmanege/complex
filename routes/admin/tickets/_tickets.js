var express = require('express');

var Model = require(__app_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale')
};

var tickets = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router({mergeParams: true});

	router.route('/')
		.get(tickets.list.index)

	router.route('/add')
		.get(tickets.add.index)
		.post(tickets.add.form);

	router.route('/edit/:ticket_id')
		.get(tickets.edit.index)
		.post(tickets.edit.form);

	router.route('/remove')
		.post(tickets.remove.index);

	return router;
})();