module.exports = function(Model) {
  var Partner = Model.Partner;
  var module = {};


	module.index = function(req, res) {
	  Partner.find().sort('-date').exec(function(err, partners) {
	    res.render('admin/partners', {partners: partners});
	  });
	}

	module.get_partners = function(req, res) {

	  Partner.find().exec(function(err, partners) {
	    res.send(partners);
	  });
	}


  return module;
}