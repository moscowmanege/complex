var express = require('express');

var Model = require(__app_root + '/models/main.js');

var Params = {
	checkNested: function (obj, layers) {
	  if (typeof layers == 'string') {
	    layers = layers.split('.');
	  }

	  for (var i = 0; i < layers.length; i++) {
	    if (!obj || !obj.hasOwnProperty(layers[i])) {
	      return false;
	    }
	    obj = obj[layers[i]];
	  }
	  return true;
	}
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

	router
		.use('/edit/:area_id/halls', halls)
		.param('area_id', function(req, res, next, area_id) {
			req.module_params.area_id = area_id;
			next();
		});

	router.route('/remove')
		.post(areas.remove.index);

	return router;
})();