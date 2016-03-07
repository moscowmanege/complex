module.exports = function(Model) {
	var Area = Model.Area;
	var Hall = Model.Hall;
	var Event = Model.Event;
	var module = {};


	module.index = function(req, res) {
		var id = req.body.id;

		Area.findById(id).exec(function(err, area) {
			Hall.remove({'_id': {$in: area.halls} }).exec(function() {
				Event.update({'place.area': area._id }, { $set: { 'place': { area: undefined, halls: [] } } }, { 'multi': true }).exec(function() {
					Area.findByIdAndRemove(id).exec(function(err, area) {
						res.send('ok');
					});
				});
			});
		});
	}


	return module;
}