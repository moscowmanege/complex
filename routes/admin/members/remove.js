module.exports = function(Member) {
  var module = {};


	exports.index = function(req, res) {
	  var id = req.body.id;

	  Member.findByIdAndRemove(id, function(err, member) {
	    res.send('ok');
	  });
	}


  return module;
}