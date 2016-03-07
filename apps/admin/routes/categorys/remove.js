module.exports = function(Model) {
	var Category = Model.Category;
	var Event = Model.Event;
	var module = {};


	module.index = function(req, res) {
	  var id = req.body.id;

	  Event.update({'categorys': id}, { $pull: { 'categorys': id } }, { 'multi': true }).exec(function() {
		  Category.findByIdAndRemove(id, function(err, category) {
		    res.send('ok');
		  });
	  });
	}


	return module;
};