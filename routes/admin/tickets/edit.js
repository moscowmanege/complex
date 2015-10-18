module.exports = function(Model, Params) {
	var Ticket = Model.Ticket;
	var checkNested = Params.checkNested;
	var module = {};



	module.index = function(req, res) {
		var ticket_id = req.params.ticket_id;

		Ticket.findById(ticket_id).exec(function(err, ticket) {
			Event.find().sort('-date').exec(function(err, events) {
				res.render('admin/tickets/edit.jade', {ticket: ticket, events: events});
			});
		});
	}

	module.form = function(req, res) {
		var post = req.body;
		var ticket_id = req.params.ticket_id;

		Ticket.findById(ticket_id).exec(function(err, ticket) {

			type = post.type;
			events = post.events;
			expired = post.expired;

			ticket.save(function(err, area) {
				res.redirect('/admin/events');
			});
		});
	}


	return module;
}