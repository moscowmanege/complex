var figlet = require('figlet');

exports.index = function(req, res, next) {
	// return next(new Error('My Test Error'));

	figlet.fonts(function(err, fonts) {
		var rand = Math.floor(Math.random() * fonts.length);

		figlet('MANEGE\nSTARGAZER', {font: fonts[rand], horizontalLayout: 'default', verticalLayout: 'default'}, function(err, data) {
			res.render('index.jade', {data: data, font: fonts[rand]});
		});
	});
}