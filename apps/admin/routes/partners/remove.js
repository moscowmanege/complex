var del = require('del');

module.exports = function(Model) {
  var Partner = Model.Partner;
  var module = {};


	module.index = function(req, res) {
	  var id = req.body.id;

	  Partner.findByIdAndRemove(id, function(err, partner) {
	  	del(__app_root + '/public/cdn/images/partners/' + id, function() {
	    	res.send('ok');
	  	});
	  });
	};


  return module;
};