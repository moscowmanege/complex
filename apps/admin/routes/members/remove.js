var rimraf = require('rimraf');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;
	var Event = Model.Event;


	module.index = function(req, res) {
		var id = req.body.id;

		async.series([
			function(callback) {
				Event.update({'members.ids': id}, { $pull: { 'members.$.ids': id } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Event.update({}, { $pull: { 'members': { 'ids': { $size: 0 } } } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Member.findByIdAndRemove(id).exec(callback);
			},
			function(callback) {
				rimraf(__app_root + '/public/cdn/images/members/' + id, { glob: false }, callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};