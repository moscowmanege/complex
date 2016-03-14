module.exports = function(Model) {
  var module = {};
  var User = Model.User;


	module.index = function(req, res) {
	  var id = req.body.id;

	  User.findByIdAndRemove(id, function() {
		  if (req.session.user_id == id) {
		  	res.send('current_user');
		  } else {
		  	res.send('ok');
		  }
	  });
	};


  return module;
};