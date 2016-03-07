var mongoose = require('mongoose');

module.exports = function(Model) {
	var Area = Model.Area;
	var Hall = Model.Hall;
	var Event = Model.Event;
  var module = {};


	module.index = function(req, res) {
	  var id = req.body.id;
	  id = new mongoose.Types.ObjectId(id);

	  Area.update({'halls': id}, { $pull: { 'halls': id } }, { 'multi': true }).exec(function() {
		  Event.update({'place.halls': id}, { $pull: { 'place': { 'halls': id } } }, { 'multi': true }).exec(function() {
			  Hall.findByIdAndRemove(id, function(err, hall) {
			    res.send('ok');
			  });
		  });
	  });
	};


  return module;
};