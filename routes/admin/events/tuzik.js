var jsdom = require('jsdom');
var request = require('request');
var async = require('async');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var mkdirp = require('mkdirp');


module.exports = function(Model) {
	var Event = Model.Event;
	var module = {};
	var public_path = __app_root + '/public';

	var parseFields = function(window, callback) {
		var $ = window.$;

		var title = $('h1');
		var s_title = $('#subheader');
		var description = $('div[style*="margin-bottom:15px"]').next('div');
		var desc_images = description.find('.ms-slide');
		var main_image = $('#SocialNetworks').children('a.facebook');
		description.find('.master-slider-parent').remove();

		var val_title = title.text();
		var val_s_tile = s_title.text();
		var val_description = description.html()
			.replace(/style="[^"]*"/g, '')
			// .replace(/<\s*(\w+).*?>/g, '<$1>')
			.replace(/&nbsp;/g, '')
			.replace(/<strong><\/strong\>/g, '')
			.replace(/strong/g, 'b');

		var val_main_image = main_image.attr('href').split('=')[5];

		var val_desc_images = desc_images.map(function() {
			var obj = {};
			obj.path = $(this).children('[data-src]').attr('data-src');
			obj.description = $(this).children('.ms-info').text();

			return obj;

		}).toArray();

		callback(null, {title: val_title, s_title: val_s_tile, description: val_description, main_image: val_main_image, images: val_desc_images});
	};

	var loadImages = function(images, event, callback) {
		var path = {
			original: '/images/events/' + event._id + '/original/',
			thumb: '/images/events/' + event._id + '/thumb/'
		}
		async.concatSeries([public_path + path.original, public_path + path.thumb], mkdirp, function(err, dirs) {
			async.mapSeries(images, function(image, callback) {
				var uri = encodeURI(image.path);
				var stream = request(uri);
				var img_name = Date.now() + '.jpg';

					gm(stream).resize(1200, false).write(public_path + path.original + img_name, function (err) {
						gm(public_path + path.original + img_name).resize(520, false).write(public_path + path.thumb + img_name, function (err) {
						var obj = {
							original: path.original + img_name,
							thumb: path.thumb + img_name,
							description: [{'lg': 'ru', 'value': image.description}]
						};
						callback(err, obj);
					});
				});
			}, function(err, images) {
				event.images = event.images.concat(images);
				callback();
			});
		});
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
			loadImages(result.ru.fields.images, event, function(err) {
				event.save(function() {
					res.send('ok');
				});
			});
		});

	}


	return module;
}