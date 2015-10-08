var express = require('express');

var categorys = {
	list: require('./list.js'),
	add: require('./add.js'),
	edit: require('./edit.js'),
	remove: require('./remove.js')
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