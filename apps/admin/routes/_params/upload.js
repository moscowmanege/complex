var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');
var fs = require('fs');
var path = require('path');

var public_path = __app_root + '/public';
var preview_path = __app_root + '/public/preview/';


module.exports.images = function(obj, base_path, upload_images, callback) {
	obj.images = [];
	var images = [];

	var dir_path = '/cdn/images/' + base_path + '/' + obj._id;

	var images_path = {
		original: dir_path + '/original/',
		thumb: dir_path + '/thumb/',
	};

	del(public_path + dir_path, function(err, paths) {

		if (!upload_images) {
			return callback.call(null, null, obj);
		}

		async.concatSeries([public_path + images_path.original, public_path + images_path.thumb], mkdirp, function(err, dirs) {

			async.eachOfSeries(upload_images.path, function(item, i, callback) {
				images[i] = { path: null, description: [] };
				images[i].path = upload_images.path[i];
				images[i].description.push({ lg: 'ru', value: upload_images.description.ru[i] });

				if (upload_images.description.en) {
					images[i].description.push({ lg: 'en', value: upload_images.description.en[i] });
				}

				callback();

			}, function() {

				async.eachSeries(images, function(image, callback) {
					var name = path.basename(image.path).split('.')[0] || Date.now();
					var original_path = images_path.original + name + '.jpg';
					var thumb_path = images_path.thumb + name + '.jpg';

					gm(public_path + image.path).write(public_path + original_path, function(err) {
						gm(public_path + image.path).size({bufferStream: true}, function(err, size) {
							this.resize(size.width > 620 ? 620 : false, false);
							this.quality(size.width > 620 ? 80 : 100);
							this.write(public_path + thumb_path, function(err) {
								var obj_img = {};

								obj_img.original = original_path;
								obj_img.thumb = thumb_path;
								obj_img.description = image.description;

								obj.images.push(obj_img);

								callback();
							});
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

	async.mapSeries(images, function(image, callback) {
		var image_path = public_path + image.original;
		var image_name = path.basename(image.original);

		fs.createReadStream(image_path).pipe(fs.createWriteStream(preview_path + image_name));

		callback(null, '/preview/' + image_name);
	}, function(err, results) {
		callback.call(null, null, results);
	});
};