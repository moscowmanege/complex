module.exports = function(Model) {
	var Event = Model.Event;
  var module = {};


	module.index = function(req, res) {
	  Event.find().sort('-date').select('title tickets').exec(function(err, events) {
	    res.render('events', {events: events});
	  });
	}


  return module;
}