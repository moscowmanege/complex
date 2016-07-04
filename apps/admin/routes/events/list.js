var jade = require('jade');
var i18n = require('i18n');


module.exports = function(Model) {
	var Event = Model.Event;
  var module = {};

	var i18n_locale = function() {
		return i18n.__.apply(null, arguments);
	};

	var i18n_plurals_locale = function() {
		return i18n.__n.apply(null, arguments);
	};


	module.index = function(req, res) {
	  Event.find().sort('-date').limit(10).exec(function(err, events) {
	  	Event.count().exec(function(err, count) {
	  		res.render('events', {events: events, count: Math.ceil(count / 10)});
	  	});
	  });
	};

	module.get_list = function(req, res) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Event.find({ $text : { $search : post.context.text } } )
			: Event.find();

		if (post.context.type && post.context.type != 'all') {
			Query.where('type').equals(post.context.type);
		}

		if (post.context.status && post.context.status == 'default') {
			Query.where('status').ne('hidden');
		}

		if (post.context.status && post.context.status == 'hidden') {
			Query.where('status').equals('hidden');
		}

		Query.sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, events) {
			if (events && events.length > 0) {
				var opts = {events: events, __: i18n_locale, __n: i18n_plurals_locale, compileDebug: false, debug: false, cache: false, pretty: false};
				res.send(jade.renderFile(__app_root + '/apps/admin/views/events/_events.jade', opts));
			} else {
				res.send('end');
			}
		});
	};


  return module;
};