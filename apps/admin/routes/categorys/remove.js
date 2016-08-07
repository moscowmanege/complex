module.exports = function(Model) {
	var module = {};

	var Category = Model.Category;
	var Event = Model.Event;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Event.update({'categorys': id}, { $pull: { 'categorys': id } }, { 'multi': true }).exec(function(err) {
			if (err) return next(err);

			Category.findByIdAndRemove(id, function(err, category) {
				if (err) return next(err);

				res.send('ok');
			});
		});
	};


	return module;
};