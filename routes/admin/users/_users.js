var express = require('express');

var Model = require(__app_root + '/models/main.js');

var users = {
	list: require('./list.js')(Model.User),
	add: require('./add.js')(Model.User),
	edit: require('./edit.js')(Model.User),
	remove: require('./remove.js')(Model.User)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(users.list.index)

	router.route('/add')
		.get(users.add.index)
		.post(users.add.form);

	router.route('/edit')
		.get(users.edit.index)
		.post(users.edit.form);

	router.route('/remove')
		.post(users.remove.index);

	return router;
})();