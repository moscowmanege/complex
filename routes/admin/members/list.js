module.exports = function(Member) {
  var module = {};


	exports.index = function(req, res) {
	  Member.find().exec(function(err, members) {
	    res.render('admin/members', {members: members});
	  });
	}


  return module;
}