var express = require('express');

var Model = require(__app_root + '/models/main.js');

var subsidiaries = {
	list: require('./list.js')(Model.Subsidiary),
	add: require('./add.js')(Model.Subsidiary),
	edit: require('./edit.js')(Model.Subsidiary),
	remove: require('./remove.js')(Model.Subsidiary)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(subsidiaries.list.index)

	router.route('/add')
		.get(subsidiaries.add.index)
		.post(subsidiaries.add.form);

	router.route('/edit')
		.get(subsidiaries.edit.index)
		.post(subsidiaries.edit.form);

	router.route('/remove')
		.post(subsidiaries.remove.index);

	return router;
})();