module.exports = function(Model) {
	var Subsidiary = Model.Subsidiary;
  var module = {};


	module.index = function(req, res) {
	  var id = req.body.id;

	  Subsidiary.findByIdAndRemove(id).exec(function(err, subsidiary) {
	    res.send('ok');
	  });
	}


  return module;
}