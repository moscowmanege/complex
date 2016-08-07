module.exports = function(Model, Params) {
	var module = {};

	var Ticket = Model.Ticket;
	var Event = Model.Event;

	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var ticket_id = req.params.ticket_id;

		Ticket.findById(ticket_id).exec(function(err, ticket) {
			if (err) return next(err);

			Event.find().where('meta').exists(false).sort('-date').exec(function(err, events) {
				if (err) return next(err);

				res.render('tickets/edit.jade', {ticket: ticket, events: events});
			});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var ticket_id = req.params.ticket_id;
		var complex = post.events.length > 1 ? true : false;
		post.events = post.events.filter(function(id) { return id !== ''; });

		if (post.events.length === 0) return res.redirect('back');
		if (!post.price || !Number.isInteger(+post.price)) return res.redirect('back');

		Ticket.findById(ticket_id).exec(function(err, ticket) {
			if (err) return next(err);

			ticket.price = post.price;
			ticket.type = post.type;
			ticket.status = post.status;
			ticket.complex = complex;

			Event.where('_id').in(ticket.events)
				.setOptions({ multi: true })
				.update({ $pull: { 'tickets.ids': { id: ticket._id.toString() } } }, function(err, results) {
				if (err) return next(err);

				Event.where('_id').in(post.events)
					.setOptions({ multi: true })
					.update({ $push: { 'tickets.ids': { id: ticket._id.toString(), complex: complex } } }, function(err, results) {
					if (err) return next(err);

						ticket.events = post.events;

						ticket.save(function(err, ticket) {
							if (err) return next(err);

							res.redirect('/events');
						});
					});
			});
		});
	};


	return module;
};