module.exports = function(Model) {
	var module = {};

	var Area = Model.Area;
	var Hall = Model.Hall;
	var Event = Model.Event;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Area.update({'halls': id}, { $pull: { 'halls': id } }, { 'multi': true }).exec(function(err) {
			if (err) return next(err);

			Event.update({'place.halls': id}, { $pull: { 'place': { 'halls': id } } }, { 'multi': true }).exec(function(err) {
				if (err) return next(err);

				Hall.findByIdAndRemove(id, function(err, hall) {
					if (err) return next(err);

					res.send('ok');
				});
			});
		});
	};


	return module;
};