var figlet = require('figlet');

exports.index = function(req, res) {
	figlet.fonts(function(err, fonts) {
		var rand = Math.floor(Math.random() * fonts.length);

		figlet('MANEGE\nSTARGAZER', {font: fonts[rand], horizontalLayout: 'default', verticalLayout: 'default'}, function(err, data) {
			res.render('admin', {data: data, font: fonts[rand]});
		});
	});
}