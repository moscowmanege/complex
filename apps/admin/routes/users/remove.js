module.exports = function(User) {
  var module = {};


	module.index = function(req, res) {
	  var id = req.body.id;

	  User.findByIdAndRemove(id, function() {
	    res.send('ok');
	  });
	}


  return module;
}