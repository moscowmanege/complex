var jsdom = require('jsdom');
var async = require('async');
var fs = require('fs');


module.exports = function(Model) {
	var Event = Model.Event;
	var module = {};

	var parseFields = function(window, callback) {
			var $ = window.$;

			var title = $('h1').text();
			var s_title = $('#subheader').text();
			var description = $('div[style*="margin-bottom:15px"]').next('div').html();

			description = description.replace(/style="[^"]*"/g, "");
			// description = description.replace(/<\s*(\w+).*?>/g, '<$1>');
			description = description.replace(/&nbsp;/g, '');
			description = description.replace(/<strong><\/strong\>/g, '');
			description = description.replace(/strong/g, 'b');

			callback.call(null, null, {title: title, s_title: s_title, description: description});
	};


	module.index = function(req, res) {
		var jquery = fs.readFileSync(__app_root + '/public/build/libs/js/jquery-2.1.4.min.js', 'utf-8');

		var event = new Event();

		async.parallel({
			ru: function(callback) {
				if (req.body.link.ru == '') return callback(null, null);
				jsdom.env(req.body.link.ru, {src: [jquery]}, function(err, window) {
					if (err) return callback(null, null);
					parseFields(window, function(err, fields) {
						event.i18n.title.set(fields.title, 'ru');
						event.i18n.s_title.set(fields.s_title, 'ru');
						event.i18n.description.set(fields.description, 'ru');

						callback(null, {link: req.body.link.ru, fields: fields});
					});
				});
			},
			en: function(callback) {
				if (req.body.link.en == '') return callback(null, null);
				jsdom.env(req.body.link.en, {src: [jquery]}, function(err, window) {
					if (err) return callback(null, null);
					parseFields(window, function(err, fields) {
						event.i18n.title.set(fields.title, 'en');
						event.i18n.s_title.set(fields.s_title, 'en');
						event.i18n.description.set(fields.description, 'en');

						callback(null, {link: req.body.link.en, fields: fields});
					});
				});
			}
		}, function(err, result) {
			event.save(function() {
				res.send('ok');
			});
		});

	}


	return module;
}