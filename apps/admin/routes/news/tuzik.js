var jsdom = require('jsdom');
var request = require('request');
var async = require('async');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var mkdirp = require('mkdirp');


module.exports = function(Model) {
	var News = Model.News;
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

		var val_main_image = main_image.attr('href').split('=')[5].trim();

		var val_desc_images = desc_images.map(function() {
			var obj = {};
			obj.path = $(this).children('[data-src]').attr('data-src');
			obj.description = $(this).children('.ms-info').text();

			return obj;

		}).toArray();

		val_desc_images.unshift({path: val_main_image, description:''});

		callback(null, {title: val_title, s_title: val_s_tile, description: val_description, images: val_desc_images});
	};

	var loadImages = function(images, news, callback) {
		if (images.length === 0) {
			news.images = [];
			return callback();
		}

		var path = {
			original: '/cdn/images/news/' + news._id + '/original/',
			thumb: '/cdn/images/news/' + news._id + '/thumb/'
		};

		async.concatSeries([public_path + path.original, public_path + path.thumb], mkdirp, function(err, dirs) {
			async.mapSeries(images, function(image, callback) {
				var img_name = Date.now() + '.jpg';
				var uri = encodeURI(image.path);
				var img_stream = request.get(uri).on('error', function(err) {
					callback(err);
				});

				gm(img_stream).size({bufferStream: true}, function(err, size) {
					if (err) return callback(err);
					this.resize(size.width > 1620 ? 1620 : false, false);
					this.write(public_path + path.original + img_name, function (err) {
						if (err) return callback(err);
						gm(public_path + path.original + img_name).size({bufferStream: true}, function(err, size) {
							if (err) return callback(err);
							this.resize(size.width > 620 ? 620 : false, false);
							this.quality(size.width > 620 ? 80 : 100);
							this.write(public_path + path.thumb + img_name, function (err) {
								var obj = {
									original: path.original + img_name,
									thumb: path.thumb + img_name,
									description: [{'lg': 'ru', 'value': image.description}]
								};
								callback(err, obj);
							});
						});
					});
				});
			}, function(err, images) {
				images = images.filter(function(image) { return !!image; });
				news.images = news.images.concat(images);
				callback();
			});
		});
	};

	var getFields = function(locale, news, link, callback) {
		if (link[locale] === '') return callback(null, null);

		var jquery = fs.readFileSync(__app_root + '/public/libs/js/jquery-2.2.4.min.js', 'utf-8');
		jsdom.env(link[locale], {src: [jquery]}, function(err, window) {
			if (err) return callback(null, null);

			parseFields(window, function(err, fields) {
				news.i18n.title.set(fields.title, locale);
				news.i18n.s_title.set(fields.s_title, locale);
				news.i18n.description.set(fields.description, locale);

				news.meta.tuzik[locale] = link[locale];

				callback(null, {link: link[locale], fields: fields});
			});
		});
	};


	module.index = function(req, res) {

		var news = new News();

		async.parallel({
			ru: function(callback) {
				getFields('ru', news, req.body.link, callback);
			},
			en: function(callback) {
				getFields('en', news, req.body.link, callback);
			}
		}, function(err, result) {
			loadImages(result.ru.fields.images, news, function(err) {
				news.status = 'hidden';
				news.save(function() {
					res.send('ok');
				});
			});
		});

	};


	return module;
};