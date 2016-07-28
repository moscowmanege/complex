module.exports = function(Model) {
	var Area = Model.Area;
	var module = {};

	module.index = function(req, res) {
		Area.find().populate('halls').exec(function(err, areas) {
			res.render('monitor', {areas: areas});
		});
	};

	return module;
};