var del = require('del');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Partner = Model.Partner;
	var Event = Model.Event;


	module.index = function(req, res) {
		var id = req.body.id;

		async.series([
			function(callback) {
				Event.update({'partners.ids': id}, { $pull: { 'partners.$.ids': id } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Event.update({}, { $pull: { 'partners': { 'ids': { $size: 0 } } } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Partner.findByIdAndRemove(id).exec(callback);
			},
			function(callback) {
				del(__app_root + '/public/cdn/images/partners/' + id, callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};