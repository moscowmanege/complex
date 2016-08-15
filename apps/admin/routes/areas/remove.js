var mongoose = require('mongoose');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Area = Model.Area;
	var Hall = Model.Hall;
	var Event = Model.Event;


	module.index = function(req, res, next) {
		var id = req.body.id;

		async.waterfall([
			function(callback) {
				Area.findById(id).exec(callback);
			},
			function(area, callback) {
				Hall.remove({ '_id': { '$in': area.halls } }).exec(callback);
			},
			function(result, callback) {
				Event.update({'place.area': mongoose.Types.ObjectId(id) }, { $set: { 'place': { area: undefined, halls: [] } } }, { 'multi': true }).exec(callback);
			},
			function(result, callback) {
				Area.findByIdAndRemove(id).exec(callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};