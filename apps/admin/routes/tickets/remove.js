module.exports = function(Model) {
  var module = {};
  var Ticket = Model.Ticket;
  var Event = Model.Event;


	module.index = function(req, res) {
	  var id = req.body.id;

	  Event.update({'tickets.ids.id': id}, { $pull: { 'tickets.ids': { id: id } } }, {multi: true}).exec(function() {
		  Ticket.findByIdAndRemove(id, function(err, ticket) {
		    res.send('ok');
		  });
	  });
	}


  return module;
};