var figlet = require('figlet');

exports.index = function(req, res, next) {
	figlet.fonts(function(err, fonts) {
		if (err) return next(err);

		var font = fonts[Math.floor(Math.random() * fonts.length)];

		figlet('MANEGE\nSTARGAZER', {font: font, horizontalLayout: 'default', verticalLayout: 'default'}, function(err, data) {
			if (err) return next(err);

			res.render('index.jade', {data: data, font: font});
		});
	});
};