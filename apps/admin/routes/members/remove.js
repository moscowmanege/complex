var del = require('del');

module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;
	var Event = Model.Event;


	module.index = function(req, res) {
		var id = req.body.id;

		Event.update({'members.ids': id}, { $pull: { 'members.$.ids': id } }, { 'multi': true }).exec(function(err) {
			if (err) return next(err);

			Event.update({}, { $pull: { 'members': { 'ids': { $size: 0 } } } }, { 'multi': true }).exec(function(err) {
				if (err) return next(err);

				Member.findByIdAndRemove(id, function(err, member) {
					if (err) return next(err);

					del(__app_root + '/public/cdn/images/members/' + id, function() {
						res.send('ok');
					});
				});
			});
		});
	};


	return module;
};