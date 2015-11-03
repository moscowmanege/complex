module.exports = function(Model) {
  var Member = Model.Member;
  var module = {};


	module.index = function(req, res) {
	  Member.find().exec(function(err, members) {
	    res.render('admin/members', {members: members});
	  });
	}

	module.get_members = function(req, res) {
		var role = req.body.role;

	  Member.find({'roles': role}).exec(function(err, members) {
	    res.send(members);
	  });
	}


  return module;
}