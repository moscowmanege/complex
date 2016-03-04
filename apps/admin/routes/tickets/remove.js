module.exports = function(Model) {
  var module = {};
  var Ticket = Model.Ticket;


	module.index = function(req, res) {
	  var id = req.body.id;

	  Ticket.findByIdAndRemove(id, function(err, ticket) {
	    res.send('ok');
	  });
	}


  return module;
};