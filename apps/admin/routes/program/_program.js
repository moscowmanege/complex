var express = require('express');

var Model = require(__app_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale'),
	upload: require('../_params/upload')
};

var program = {
	list: require('./list.js')(Model),
	add: require('../events/add.js')(Model, Params),
	edit: require('../events/edit.js')(Model, Params),
	remove: require('../events/remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router({mergeParams: true});

	router.route('/')
		.get(program.list.index)
		.post(program.list.move);

	router.route('/add')
		.get(program.add.index)
		.post(program.add.form);

	router.route('/edit/:event_program_id')
		.get(program.edit.index)
		.post(program.edit.form);

	router.route('/remove')
		.post(program.remove.index);

	return router;
})();