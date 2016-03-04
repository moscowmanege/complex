module.exports = function(Model) {
  var Member = Model.Member;
  var module = {};


	module.index = function(req, res) {
	  Member.find().sort('-date').exec(function(err, members) {
	    res.render('members', {members: members});
	  });
	}

	module.get_members = function(req, res) {
		var tag = req.body.tag;

	  Member.find({'roles': tag}).exec(function(err, members) {
	    res.send(members);
	  });
	}


  return module;
}