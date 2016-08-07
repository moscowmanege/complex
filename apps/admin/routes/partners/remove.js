var del = require('del');

module.exports = function(Model) {
	var module = {};

	var Partner = Model.Partner;
	var Event = Model.Event;


	module.index = function(req, res) {
		var id = req.body.id;

		Event.update({'partners.ids': id}, { $pull: { 'partners.$.ids': id } }, { 'multi': true }).exec(function(err) {
			if (err) return next(err);

			Event.update({}, { $pull: { 'partners': { 'ids': { $size: 0 } } } }, { 'multi': true }).exec(function(err) {
				if (err) return next(err);

				Partner.findByIdAndRemove(id, function(err, partner) {
					if (err) return next(err);

					del(__app_root + '/public/cdn/images/partners/' + id, function() {
						res.send('ok');
					});
				});
			});
		});
	};


	return module;
};