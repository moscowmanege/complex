module.exports = (function(Category) {
	var module = {};


	module.index = function(req, res) {
	  Category.find().sort('-date').exec(function(err, categorys) {
	    res.render('auth/categorys/', {categorys: categorys});
	  });
	}


	return module;
})();