module.exports = function(Model, Params) {
	var Ticket = Model.Ticket;
	var Event = Model.Event;
	var checkNested = Params.locale.checkNested;
	var module = {};



	module.index = function(req, res) {
		var ticket_id = req.params.ticket_id;

		Ticket.findById(ticket_id).exec(function(err, ticket) {
			Event.find().where('meta').exists(false).sort('-date').exec(function(err, events) {
				res.render('tickets/edit.jade', {ticket: ticket, events: events});
			});
		});
	};

	module.form = function(req, res) {
		var post = req.body;
		var ticket_id = req.params.ticket_id;

		Ticket.findById(ticket_id).exec(function(err, ticket) {

			ticket.price = post.price;
			ticket.type = post.type;
			ticket.status = post.status;

			if (post.events) {
				var complex = true;

				ticket.complex = complex;

		    Event.where('_id').in(ticket.events)
		      .setOptions({ multi: true })
		      .update({ $pull: { 'tickets.ids': { id: ticket._id.toString() } } }, function(err, results) {

			    Event.where('_id').in(post.events)
			      .setOptions({ multi: true })
			      .update({ $push: { 'tickets.ids': { id: ticket._id.toString(), complex: complex } } }, function(err, results) {

			      	ticket.events = post.events;

				      ticket.save(function(err, ticket) {
				        res.redirect('/events');
				      });
				    });
			    });
			} else {
	      ticket.save(function(err, ticket) {
	        res.redirect('/events');
	      });
			}
	  });
	};


	return module;
};