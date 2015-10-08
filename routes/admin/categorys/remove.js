module.exports = (function(Category) {
	var module = {};


	module.index = function(req, res) {
	  var id = req.body.id;

	  Category.findByIdAndRemove(id, function(err, category) {
	    res.send('ok');
	  });
	}


	return module;
})();