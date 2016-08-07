module.exports = function(Model, Params) {
	var module = {};

	var Hall = Model.Hall;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var hall_id = req.params.hall_id;

		Hall.findById(hall_id).exec(function(err, hall) {
			if (err) return next(err);

			res.render('halls/edit.jade', {hall: hall});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var hall_id = req.params.hall_id;

		Hall.findById(hall_id).exec(function(err, hall) {
			if (err) return next(err);

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& hall.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 'description'])
					&& hall.setPropertyLocalised('description', post[locale].description, locale);

			});

			hall.save(function(err, hall) {
				if (err) return next(err);

				res.redirect('/areas');
			});
		});
	};


	return module;
};