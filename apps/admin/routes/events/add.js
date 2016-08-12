var async = require('async');
var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Event = Model.Event;
	var Category = Model.Category;
	var Member = Model.Member;
	var Partner = Model.Partner;
	var Area = Model.Area;

	var checkNested = Params.locale.checkNested;
	var uploadImages = Params.upload.images;


	module.index = function(req, res, next) {
		async.parallel({
			areas: function(callback) {
				Area.find().populate('halls').exec(callback);
			},
			categorys: function(callback) {
				Category.find().sort('-date').exec(callback);
			},
			partners: function(callback) {
				Partner.find().sort('-date').exec(callback);
			}
		}, function(err, results) {
			if (err) return next(err);

			res.render('events/add.jade', results);
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;

		var event = new Event();

		event._short_id = shortid.generate();
		event.status = post.status;
		event.type = post.type;
		event.age = post.age;
		event.interval.begin = moment(post.interval.begin.date + 'T' + post.interval.begin.time.hours + ':' + post.interval.begin.time.minutes).toDate();
		event.interval.end = moment(post.interval.end.date + 'T' + post.interval.end.time.hours + ':' + post.interval.end.time.minutes).toDate();
		event.place = post.place;
		event.categorys = post.categorys == '' ? [] : post.categorys;

		post.members && post.members.forEach(function(member) {
			event.members.push({
				role: member,
				ids: post.members[member]
			});
		});

		post.partners && post.partners.forEach(function(partner) {
			event.partners.push({
				rank: partner,
				ids: post.partners[partner]
			});
		});

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& event.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 's_title'])
				&& event.setPropertyLocalised('s_title', post[locale].s_title, locale);

			checkNested(post, [locale, 'description'])
				&& event.setPropertyLocalised('description', post[locale].description, locale);

			checkNested(post, [locale, 'alt'])
				&& event.setPropertyLocalised('tickets.alt', post[locale].alt, locale);

		});

		uploadImages(event, 'events', post.images, function(err, event) {
			if (err) return next(err);

			event.save(function(err, event) {
				if (err) return next(err);

				res.redirect('/events');
			});
		});
	};


	return module;
};