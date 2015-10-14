var express = require('express');

var Model = require(__app_root + '/models/main.js');

var members = {
	list: require('./list.js')(Model.Member),
	add: require('./add.js')(Model.Member),
	edit: require('./edit.js')(Model.Member),
	remove: require('./remove.js')(Model.Member)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(members.list.index)

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