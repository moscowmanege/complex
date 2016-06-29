var jade = require('jade');

module.exports = function(Model) {
	var Event = Model.Event;
  var module = {};


	module.index = function(req, res) {
	  Event.find().sort('-date').limit(10).exec(function(err, events) {
	    res.render('events', {events: events});
	  });
	};

	module.get_list = function(req, res) {
		var post = req.body;
		var Query = Event.find();

		if (post.context.type && post.context.type != 'all') {
			Query.where('type').equals(post.context.type);
		}

		if (post.context.status && post.context.status != 'none') {
			Query.where('status').equals(post.context.status);
		}

		Query.sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, events) {
			if (events && events.length > 0) {
				var opts = {events: events, compileDebug: false, debug: false, cache: false, pretty: false};
				res.send(jade.renderFile(__app_root + '/apps/admin/views/events/_events.jade', opts));
			} else {
				res.send('end');
			}
		});
	};


  return module;
};