var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');
var fs = require('fs');

var public_path = __app_root + '/public';


module.exports.images = function(obj, base_path, upload_images, callback) {
	obj.images = [];
	var images = [];

	var dir_path = '/images/' + base_path + '/' + obj._id

	var images_path = {
		original: dir_path + '/original/',
		thumb: dir_path + '/thumb/',
	}

	del(dir_path, function() {

		if (!upload_images) {
			return callback.call(null, null, obj);
		}

		async.concatSeries([public_path + images_path.original, public_path + images_path.thumb], mkdirp, function(err, dirs) {

			async.forEachOfSeries(upload_images.path, function(item, i, callback) {
				images[i] = { path: null, description: [] };
				images[i].path = upload_images.path[i];
				images[i].description.push({ lg: 'ru', value: upload_images.description.ru[i] });

				if (upload_images.description.en) {
					images[i].description.push({ lg: 'en', value: upload_images.description.en[i] });
				}

				callback();

			}, function() {

				async.forEachSeries(images, function(image, callback) {
					var name = Date.now();
					var original_path = images_path.original + name + '.jpg';
					var thumb_path = images_path.thumb + name + '.jpg';

					gm(public_path + image.path).resize(520, false).write(public_path + thumb_path, function() {
						fs.rename(public_path + image.path, public_path + original_path, function() {
							var obj_img = {};

							obj_img.original = original_path;
							obj_img.thumb = thumb_path;
							obj_img.description = image.description;

							obj.images.push(obj_img);

							callback();
						});
					});
				}, function() {
					callback.call(null, null, obj);
				});

			});

		});
	});
};

module.exports.preview = function(images, callback) {
	var preview_path = '/images/preview/';

	async.mapSeries(images, function(image, callback) {
		var image_path = __app_root + '/public' + image.original;
		var image_name = image.original.split('/')[5];

		fs.createReadStream(image_path).pipe(fs.createWriteStream(public_path + preview_path + image_name));

		callback(null, preview_path + image_name);
	}, function(err, results) {
		callback.call(null, null, results);
	});
};