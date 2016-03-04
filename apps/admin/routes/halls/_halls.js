var express = require('express');

var Model = require(__app_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale')
};

var halls = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router({mergeParams: true});

	router.route('/')
		.get(halls.list.index)

	router.route('/add')
		.get(halls.add.index)
		.post(halls.add.form);

	router.route('/edit/:hall_id')
		.get(halls.edit.index)
		.post(halls.edit.form);

	router.route('/remove')
		.post(halls.remove.index);

	return router;
})();