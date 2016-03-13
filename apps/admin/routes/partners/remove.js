var del = require('del');

module.exports = function(Model) {
	var Partner = Model.Partner;
	var Event = Model.Event;
	var module = {};


	module.index = function(req, res) {
		var id = req.body.id;

		Event.update({'partners.ids': id}, { $pull: { 'partners.$.ids': id } }, { 'multi': true }).exec(function() {
			Event.update({}, { $pull: { 'partners': { 'ids': { $size: 0 } } } }, { 'multi': true }).exec(function() {
				Partner.findByIdAndRemove(id, function(err, partner) {
					del(__app_root + '/public/cdn/images/partners/' + id, function() {
						res.send('ok');
					});
				});
			});
		});
	};


	return module;
};