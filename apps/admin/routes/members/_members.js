var express = require('express');

var Model = require(__app_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale')
};

var members = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/tags_select')
		.post(members.list.get_members);

	router.route('/')
		.get(members.list.index)
		.post(members.list.get_list);

	router.route('/add')
		.get(members.add.index)
		.post(members.add.form);

	router.route('/edit/:id')
		.get(members.edit.index)
		.post(members.edit.form);

	router.route('/remove')
		.post(members.remove.index);

	return router;
})();