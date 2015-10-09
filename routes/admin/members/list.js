module.exports = function(Member) {
  var module = {};


	exports.index = function(req, res) {
	  Subsidiary.find().exec(function(err, subsidiaries) {
	    res.render('auth/subsidiaries', {subsidiaries: subsidiaries});
	  });
	}


  return module;
}