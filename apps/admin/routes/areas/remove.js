var async = require('async');
var mongoose = require('mongoose');

module.exports = function(Model) {
	var module = {};

	var Area = Model.Area;
	var Hall = Model.Hall;
	var Event = Model.Event;


	module.index = function(req, res, next) {
		var id = req.body.id;

		async.parallel([
			function(callback) {
				Event.update({'place.area': mongoose.Types.ObjectId(id) }, { $set: { 'place': { area: undefined, halls: [] } } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Area.findByIdAndRemove(id).exec(callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};