module.exports = function(Model) {
  var Member = Model.Member;
  var module = {};


	module.index = function(req, res) {
	  var id = req.body.id;

	  Member.findByIdAndRemove(id, function(err, member) {
	    res.send('ok');
	  });
	}


  return module;
}