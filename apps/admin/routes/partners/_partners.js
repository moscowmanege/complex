var express = require('express');

var Model = require(__app_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale')
};

var partners = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/tags_select')
		.post(partners.list.get_partners);

	router.route('/')
		.get(partners.list.index)
		.post(partners.list.get_list);

	router.route('/add')
		.get(partners.add.index)
		.post(partners.add.form);

	router.route('/edit/:id')
		.get(partners.edit.index)
		.post(partners.edit.form);

	router.route('/remove')
		.post(partners.remove.index);

	return router;
})();