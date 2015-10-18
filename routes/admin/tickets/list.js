module.exports = function(Model) {
	var Ticket = Model.Ticket;
	var module = {};

	module.index = function(req, res) {
		var event_id = req.module_params.event_id;

		Ticket.where('events').equals(event_id).exec(function(err, tickets) {
			res.render('admin/tickets', {tickets: tickets});
		});
	}

	return module;
}