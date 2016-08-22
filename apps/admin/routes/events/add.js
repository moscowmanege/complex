var async = require('async');
var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Event = Model.Event;
	var Category = Model.Category;
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
			}
		}, function(err, results) {
			if (err) return next(err);

			res.render('events/add.jade', results);
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var parent_event_id = req.params.event_id;

		var event = new Event();

		event._short_id = shortid.generate();
		event.status = post.status;
		event.type = post.type;
		event.age = post.age;
		event.interval.begin = moment(post.interval.begin.date + 'T' + post.interval.begin.time.hours + ':' + post.interval.begin.time.minutes).toDate();
		event.interval.end = moment(post.interval.end.date + 'T' + post.interval.end.time.hours + ':' + post.interval.end.time.minutes).toDate();
		event.place = post.place;
		event.categorys = post.categorys == '' ? [] : post.categorys;

		event.members = [];
		if (post.members) {
			for (member in post.members) {
				event.members.push({
					role: member,
					ids: post.members[member]
				});
			}
		}

		event.partners = [];
		if (post.partners) {
			for (partner in post.partners) {
				event.partners.push({
					rank: partner,
					ids: post.partners[partner]
				});
			}
		}

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

			if (parent_event_id) {
				event.program.parent = parent_event_id;
			}

			event.save(function(err, event) {
				if (err) return next(err);

				if (parent_event_id) {
					Event.findById(parent_event_id).exec(function(err, parent_event) {
						if (err) return next(err);

						parent_event.program.children.push(event._id.toString());

						parent_event.save(function(err) {
							if (err) return next(err);

							res.redirect('/events/edit/' + parent_event._id + '/program');
						});
					});
				} else {
					res.redirect('/events');
				}
			});
		});
	};


	return module;
};