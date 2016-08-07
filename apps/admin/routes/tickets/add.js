module.exports = function(Model, Params) {
	var module = {};

	var Event = Model.Event;
	var Ticket = Model.Ticket;

	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var event_id = req.params.event_id;

		Event.find().where('meta').exists(false).exec(function(err, events) {
			if (err) return next(err);

			res.render('tickets/add.jade', {events: events, current: [event_id]});
		});
	};

	module.form = function(req, res, next) {
		var post = req.body;
		var complex = post.events.length > 1 ? true : false;
		post.events = post.events.filter(function(id) { return id !== ''; });

		if (post.events.length === 0) return res.redirect('back');
		if (!post.price || !Number.isInteger(+post.price)) return res.redirect('back');

		var ticket = new Ticket();

		ticket.price = post.price;
		ticket.type = post.type;
		ticket.events = post.events;
		ticket.status = post.status;
		ticket.complex = complex;

		Event
			.where('_id').in(post.events)
			.setOptions({ multi: true })
			.update({ $push: { 'tickets.ids': { id: ticket._id.toString(), complex: complex } } }, function(err, events) {
			if (err) return next(err);

			ticket.save(function(err, ticket) {
				if (err) return next(err);

				res.redirect('/events');
			});
		});
	};


	return module;
};