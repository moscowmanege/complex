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
	var router = express.Router();

	router.route('/')
		.get(function(req, res) {
			res.redirect('/events');
		});

	router.route('/:event_id')
		.get(tickets.list.index)

	router.route('/:event_id/add')
		.get(tickets.add.index)
		.post(tickets.add.form);

	router.route('/:event_id/edit/:ticket_id')
		.get(tickets.edit.index)
		.post(tickets.edit.form);

	router.route('/remove')
		.post(tickets.remove.index);

	return router;
})();