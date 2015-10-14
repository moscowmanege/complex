module.exports = function(Model) {
  var Member = Model.Member;
  var module = {};


	module.index = function(req, res) {
	  Member.find().exec(function(err, members) {
	    res.render('admin/members', {members: members});
	  });
	}


  return module;
}