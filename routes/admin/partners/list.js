module.exports = function(Model) {
  var Partner = Model.Partner;
  var module = {};


	module.index = function(req, res) {
	  Partner.find().exec(function(err, partners) {
	    res.render('admin/partners', {partners: partners});
	  });
	}

	module.get_partners = function(req, res) {
		var role = req.body.role;

	  Partner.find({'roles': role}).exec(function(err, partners) {
	    res.send(partners);
	  });
	}


  return module;
}