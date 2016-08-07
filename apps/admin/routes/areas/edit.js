module.exports = function(Model, Params) {
	var module = {};

	var Area = Model.Area;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.area_id;

		Area.findById(id).exec(function(err, area) {
			if (err) return next(err);

			res.render('areas/edit.jade', {area: area});
		});
	};

	module.form = function(req, res, next) {
		var post = req.body;
		var id = req.params.area_id;

		Area.findById(id).exec(function(err, area) {
			if (err) return next(err);

			area.contacts.phones = post.phones;
			area.contacts.emails = post.emails;

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& area.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 'description'])
					&& area.setPropertyLocalised('description', post[locale].description, locale);

				checkNested(post, [locale, 'adress'])
					&& area.setPropertyLocalised('contacts.adress', post[locale].adress, locale);

				checkNested(post, [locale, 'schedule'])
					&& area.setPropertyLocalised('contacts.schedule', post[locale].schedule, locale);

			});

			area.save(function(err, area) {
				if (err) return next(err);

				res.redirect('/areas');
			});
		});
	};


	return module;
};