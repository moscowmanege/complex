module.exports = function(Model) {
	var module = {};

	var Area = Model.Area;


	module.index = function(req, res, next) {
		var area_id = req.params.area_id;

		Area.findById(area_id).populate('halls').exec(function(err, area) {
			if (err) return next(err);

			res.render('halls', {area: area});
		});
	};

	return module;
};