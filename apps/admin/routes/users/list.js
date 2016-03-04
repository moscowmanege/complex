module.exports = function(Model) {
	var User = Model.User;
  var module = {};


	module.index = function(req, res) {
	  var Query = req.session.status == 'Admin'
	    ? User.find().sort('-date')
	    : User.find({'_id': req.session.user_id}).sort('-date');

	  Query.exec(function(err, users) {
	    res.render('users', {users: users});
	  });
	}


  return module;
}