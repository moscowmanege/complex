var del = require('del');

module.exports = function(Model) {
  var Member = Model.Member;
  var Event = Model.Event;
  var module = {};


	module.index = function(req, res) {
	  var id = req.body.id;

	  Event.update({'members': id}, { $pull: { 'members': { 'ids': id } } }, { 'multi': true }).exec(function() {
	  	Member.findByIdAndRemove(id, function(err, member) {
  			del(__app_root + '/public/cdn/images/members/' + id, function() {
    			res.send('ok');
    		});
	  	});
	  });
	};


  return module;
};