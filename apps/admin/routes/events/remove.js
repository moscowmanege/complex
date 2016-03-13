var del = require('del');
var async = require('async');

module.exports = function(Model) {
	var Event = Model.Event;
	var Ticket = Model.Ticket;
	var module = {};


	module.index = function(req, res) {
		var id = req.body.id;

		Event.findByIdAndRemove(id).exec(function(err, event) {
			Ticket.find({'events': id}).exec(function(err, tickets) {
				async.reduce(tickets, [], function(del_tickets, ticket, callback) {
					ticket.events.pull(id);
					if (ticket.events.length === 0) {
						del_tickets.push(ticket._id);
					}
					ticket.save();
					callback(null, del_tickets);
				}, function(err, del_tickets) {
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