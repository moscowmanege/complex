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

var tickets = require('../tickets/_tickets.js');

var events = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model),
	tuzik: require('./tuzik.js')(Model),
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(events.list.index)

	router.route('/add')
		.get(events.add.index)
		.post(events.add.form);

	router.route('/edit/:event_id')
		.get(events.edit.index)
		.post(events.edit.form);

	router.use('/edit/:event_id/tickets', tickets)

	router.route('/remove')
		.post(events.remove.index);

	router.route('/tuzik')
		.post(events.tuzik.index);

	return router;
})();