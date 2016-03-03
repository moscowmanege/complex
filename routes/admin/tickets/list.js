module.exports = function(Model) {
	var Event = Model.Event;
	var module = {};

	module.index = function(req, res) {
		var event_id = req.params.event_id;

		Event.findById(event_id).populate('tickets.ids.id').exec(function(err, event) {
			res.render('admin/tickets', {event: event});
		});
	}

	return module;
}