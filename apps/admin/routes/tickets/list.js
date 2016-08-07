module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;


	module.index = function(req, res, next) {
		var event_id = req.params.event_id;

		Event.findById(event_id).populate('tickets.ids.id').exec(function(err, event) {
			if (err) return next(err);

			res.render('tickets', {event: event});
		});
	};


	return module;
}