module.exports = function(Model) {
	var Category = Model.Category;
	var module = {};


	module.index = function(req, res) {
	  var id = req.body.id;

	  Category.findByIdAndRemove(id, function(err, category) {
	    res.send('ok');
	  });
	}


	return module;
};