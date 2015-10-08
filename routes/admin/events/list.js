module.exports = function(Event) {
  var module = {};


	module.index = function(req, res) {
	  Event.find().exec(function(err, events) {
	    res.render('admin/events', {events: events});
	  });
	}


  return module;
}