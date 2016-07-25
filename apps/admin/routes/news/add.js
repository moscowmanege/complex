var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var News = Model.News;
	var Category = Model.Category;
	var Area = Model.Area;

	var checkNested = Params.locale.checkNested;
	var uploadImages = Params.upload.images;


	var module = {};


	module.index = function(req, res) {
		Area.find().exec(function(err, areas) {
			Category.find().sort('-date').exec(function(err, categorys) {
				res.render('news/add.jade', {areas: areas, categorys: categorys});
			});
		});
	};


	module.form = function(req, res) {
		var post = req.body;

		var news = new News();

		news._short_id = shortid.generate();
		news.status = post.status;
		news.interval.begin = moment(post.interval.begin.date + 'T' + post.interval.begin.time.hours + ':' + post.interval.begin.time.minutes).toDate();
		news.interval.end = moment(post.interval.end.date + 'T' + post.interval.end.time.hours + ':' + post.interval.end.time.minutes).toDate();
		news.areas = post.areas == '' ? [] : post.areas;
		news.categorys = post.categorys == '' ? [] : post.categorys;

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& news.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 's_title'])
				&& news.setPropertyLocalised('s_title', post[locale].s_title, locale);

			checkNested(post, [locale, 'description'])
				&& news.setPropertyLocalised('description', post[locale].description, locale);

		});

		uploadImages(news, 'news', post.images, function(err, news) {
			news.save(function(err, news) {
				res.redirect('/news');
			});
		});
	};


	return module;
};