module.exports = function(Model) {
	var Subsidiary = Model.Subsidiary;
  var module = {};

	module.index = function(req, res) {
	  Subsidiary.find().exec(function(err, subsidiaries) {
	    res.render('admin/subsidiaries', {subsidiaries: subsidiaries});
	  });
	}

  return module;
}