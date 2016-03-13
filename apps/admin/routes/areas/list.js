module.exports = function(Model) {
	var Area = Model.Area;
  var module = {};

	module.index = function(req, res) {
	  Area.find().exec(function(err, areas) {
	    res.render('areas', {areas: areas});
	  });
	};

  return module;
};