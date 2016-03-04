module.exports = function(Model) {
	var Category = Model.Category;
	var module = {};


	module.index = function(req, res) {
	  Category.find().sort('-date').exec(function(err, categorys) {
	    res.render('categorys', {categorys: categorys});
	  });
	}


	return module;
}