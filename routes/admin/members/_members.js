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
}

var members = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
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