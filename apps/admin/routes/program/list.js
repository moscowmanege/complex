module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;


	module.index = function(req, res, next) {
		var event_id = req.params.event_id;

		Event.findById(event_id).populate('program.children').exec(function(err, event) {
			if (err) return next(err);

			res.render('program', {event: event});
		});
	};


	return module;
};