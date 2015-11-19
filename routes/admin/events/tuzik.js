var jsdom = require('jsdom');
var request = require('request');
var async = require('async');
var fs = require('fs');
var gm = require('gm');


module.exports = function(Model) {
	var Event = Model.Event;
	var module = {};

	var parseFields = function(window, callback) {
		var $ = window.$;

		var title = $('h1');
		var s_title = $('#subheader');
		var description = $('div[style*="margin-bottom:15px"]').next('div');
		var images = description.find('.ms-slide');
		description.find('.master-slider-parent').remove();

		var val_title = title.text();
		var val_s_tile = s_title.text();
		var val_description = description.html()
			.replace(/style="[^"]*"/g, '')
			// .replace(/<\s*(\w+).*?>/g, '<$1>')
			.replace(/&nbsp;/g, '')
			.replace(/<strong><\/strong\>/g, '')
			.replace(/strong/g, 'b');

		var val_images = images.map(function() {
			var obj = {};
			obj.path = $(this).children('[data-src]').attr('data-src');
			obj.description = $(this).children('.ms-info').text();
			return obj;
		}).toArray();

		callback(null, {title: val_title, s_title: val_s_tile, description: val_description, images: val_images});
	};

	var getFields = function(locale, event, link, callback) {
		if (link[locale] == '') return callback(null, null);

		var jquery = fs.readFileSync(__app_root + '/public/build/libs/js/jquery-2.1.4.min.js', 'utf-8');
		jsdom.env(link[locale], {src: [jquery]}, function(err, window) {
			if (err) return callback(null, null);

			parseFields(window, function(err, fields) {
				event.i18n.title.set(fields.title, locale);
				event.i18n.s_title.set(fields.s_title, locale);
				event.i18n.description.set(fields.description, locale);

				callback(null, {link: link[locale], fields: fields});
			});
		});
	};


	module.index = function(req, res) {

		var event = new Event();

		async.parallel({
			ru: function(callback) {
				getFields('ru', event, req.body.link, callback);
			},
			en: function(callback) {
				getFields('en', event, req.body.link, callback);
			}
		}, function(err, result) {
			event.save(function() {
				res.send('ok');
			});
		});

	}


	return module;
}