var express = require('express');

var Model = require(__app_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale')
};

var halls = require('../halls/_halls.js');

var areas = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(areas.list.index)

	router.route('/add')
		.get(areas.add.index)
		.post(areas.add.form);

	router.route('/edit/:area_id')
		.get(areas.edit.index)
		.post(areas.edit.form);

	router.use('/edit/:area_id/halls', halls)

	router.route('/remove')
		.post(areas.remove.index);

	return router;
})();