var jade = require('jade');
var i18n = require('i18n');


module.exports = function(Model) {
	var module = {};

	var News = Model.News;


	var i18n_locale = function() {
		return i18n.__.apply(null, arguments);
	};

	var i18n_plurals_locale = function() {
		return i18n.__n.apply(null, arguments);
	};


	module.index = function(req, res, next) {
		News.find().sort('-date').limit(10).exec(function(err, news) {
			if (err) return next(err);

			News.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('news', {news: news, count: Math.ceil(count / 10)});
			});
		});
	};

	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? News.find({ $text : { $search : post.context.text } } )
			: News.find();

		if (post.context.status && post.context.status == 'default') {
			Query.where('status').ne('hidden');
		}

		if (post.context.status && post.context.status == 'hidden') {
			Query.where('status').equals('hidden');
		}

		Query.count(function(err, count) {
			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, news) {
				if (err) return next(err);

				if (news.length > 0) {
					var opts = {
						news: news,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						__: i18n_locale, __n: i18n_plurals_locale,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(jade.renderFile(__app_root + '/apps/admin/views/news/_news.jade', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};