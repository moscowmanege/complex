var jade = require('jade');
var i18n = require('i18n');


module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;


	module.index = function(req, res, next) {
		Event.find().sort('-date').limit(10).exec(function(err, events) {
			if (err) return next(err);

			Event.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('events', {events: events, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
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

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, events) {
				if (err) return next(err);

				if (events.length > 0) {
					var opts = {
						__: function() { return i18n.__.apply(null, arguments); },
						__n: function() { return i18n.__n.apply(null, arguments); },
						events: events,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(jade.renderFile(__app_root + '/apps/admin/views/events/_events.jade', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};