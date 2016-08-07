module.exports = function(Model) {
	var module = {};

	var Area = Model.Area;
	var Hall = Model.Hall;
	var Event = Model.Event;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Area.findById(id).exec(function(err, area) {
			if (err) return next(err);

			Hall.remove({'_id': {$in: area.halls} }).exec(function(err) {
				if (err) return next(err);

				Event.update({'place.area': area._id }, { $set: { 'place': { area: undefined, halls: [] } } }, { 'multi': true }).exec(function(err) {
					if (err) return next(err);

					Area.findByIdAndRemove(id).exec(function(err, area) {
						if (err) return next(err);

						res.send('ok');
					});
				});
			});
		});
	};


	return module;
};