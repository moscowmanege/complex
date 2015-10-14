module.exports = function(Model) {
	var Area = Model.Area;
  var module = {};


	module.index = function(req, res) {
	  var id = req.body.id;

	  Area.findByIdAndRemove(id).exec(function(err, area) {
	    res.send('ok');
	  });
	}


  return module;
}