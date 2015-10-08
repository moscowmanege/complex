var express = require('express');

var Model = require(__app_root + '/models/main.js');

var categorys = {
	list: require('./list.js')(Model.Category),
	add: require('./add.js')(Model.Category),
	edit: require('./edit.js')(Model.Category),
	remove: require('./remove.js')(Model.Category)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(categorys.list.index)

	router.route('/add')
		.get(categorys.add.index)
		.post(categorys.add.form);

	router.route('/edit')
		.get(categorys.edit.index)
		.post(categorys.edit.form);

	router.route('/remove')
		.post(categorys.remove.index);

	return router;
})();