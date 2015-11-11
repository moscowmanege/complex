module.exports = function(Model) {
  var Partner = Model.Partner;
  var module = {};


	module.index = function(req, res) {
	  var id = req.body.id;

	  Partner.findByIdAndRemove(id, function(err, partner) {
	    res.send('ok');
	  });
	}


  return module;
}