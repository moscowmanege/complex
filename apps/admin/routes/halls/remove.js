module.exports = function(Model) {
  var module = {};
  var Hall = Model.Hall;


	module.index = function(req, res) {
	  var id = req.body.id;

	  Hall.findByIdAndRemove(id, function(err, hall) {
	    res.send('ok');
	  });
	}


  return module;
};