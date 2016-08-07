var del = require('del');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;
	var Ticket = Model.Ticket;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Event.findByIdAndRemove(id).exec(function(err, event) {
			if (err) return next(err);

			Ticket.find({'events': id}).exec(function(err, tickets) {
				if (err) return next(err);

				async.reduce(tickets, [], function(del_tickets, ticket, callback) {
					ticket.events.pull(id);
					if (ticket.events.length === 0) {
						del_tickets.push(ticket._id);
					}
					ticket.save();
					callback(null, del_tickets);
				}, function(err, del_tickets) {
					if (err) return next(err);

					Ticket.remove({'_id': { '$in': del_tickets } }).exec(function() {
						del(__app_root + '/public/cdn/images/events/' + id, function() {
							res.send('ok');
						});
					});
				});
			});
		});
	};


	return module;
};