var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Area = Model.Area;
	var Hall = Model.Hall;
	var Event = Model.Event;


	module.index = function(req, res, next) {
		var id = req.body.id;

		async.parallel([
			function(callback) {
				Area.update({'halls': id}, { $pull: { 'halls': id } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Event.update({'place.halls': id}, { $pull: { 'place': { 'halls': id } } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Hall.findByIdAndRemove(id).exec(callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};