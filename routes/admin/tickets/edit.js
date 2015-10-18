module.exports = function(Model, Params) {
	var Ticket = Model.Ticket;
	var Event = Model.Event;
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

			ticket.price = post.price;
			ticket.type = post.type;
			ticket.expired = post.expired;


	    Event.where('_id').in(ticket.events)
	      .setOptions({ multi: true })
	      .update({ $pull: { 'tickets.ids': ticket._id.toString() } }, function(err, results) {

		    Event.where('_id').in(post.events)
		      .setOptions({ multi: true })
		      .update({ $push: { 'tickets.ids': ticket._id.toString() } }, function(err, results) {

			      ticket.events = post.events;
			      ticket.save(function(err, ticket) {
			        res.redirect('/admin/events');
			      });
			    });
		    });
	    });
	}


	return module;
}