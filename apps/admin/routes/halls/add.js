var shortid = require('shortid');

module.exports = function(Model, Params) {
	var module = {};

	var Hall = Model.Hall;
	var Area = Model.Area;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res) {
		res.render('halls/add.jade');
	};


	module.form = function(req, res, next) {
		var post = req.body;

		var hall = new Hall();

		hall._short_id = shortid.generate();

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& hall.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 'description'])
				&& hall.setPropertyLocalised('description', post[locale].description, locale);

		});

		hall.save(function(err, hall) {
			if (err) return next(err);

			var area_id = req.params.area_id;

			Area.findById(area_id).exec(function(err, area) {
				if (err) return next(err);

				area.halls.push(hall._id);
				area.save(function(err, area) {
					if (err) return next(err);

					res.redirect('/areas');
				});
			});
		});
	};



	return module;
}