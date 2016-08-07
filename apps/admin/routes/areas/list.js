module.exports = function(Model) {
	var module = {};

	var Area = Model.Area;


	module.index = function(req, res, next) {
	  Area.find().exec(function(err, areas) {
	  	if (err) return next(err);

	    res.render('areas', {areas: areas});
	  });
	};


  return module;
};