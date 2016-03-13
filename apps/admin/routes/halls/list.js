module.exports = function(Model) {
	var Area = Model.Area;
	var module = {};

	module.index = function(req, res) {
		var area_id = req.params.area_id;

		Area.findById(area_id).populate('halls').exec(function(err, area) {
			res.render('halls', {area: area});
		});
	};

	return module;
};