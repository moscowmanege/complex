module.exports = function(Model) {
  var module = {};

  var Ticket = Model.Ticket;
  var Event = Model.Event;


	module.index = function(req, res) {
	  var id = req.body.id;

	  Event.update({'tickets.ids.id': id}, { $pull: { 'tickets.ids': { id: id } } }, {multi: true}).exec(function(err) {
	  	if (err) return next(err);

		  Ticket.findByIdAndRemove(id, function(err, ticket) {
		  	if (err) return next(err);

		    res.send('ok');
		  });
	  });
	}


  return module;
};