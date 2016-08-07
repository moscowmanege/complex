var shortid = require('shortid');
var gm = require('gm').subClass({ imageMagick: true });
var mkdirp = require('mkdirp');
var del = require('del');

module.exports = function(Model, Params) {
	var module = {};

	var Partner = Model.Partner;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res) {
		res.render('partners/add.jade');
	};

	module.form = function(req, res, next) {
		var post = req.body;
		var file = req.file;

		var partner = new Partner();

		partner._short_id = shortid.generate();
		partner.type = post.type;
		partner.status = post.status;
		partner.link = post.link;

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& partner.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 'description'])
				&& partner.setPropertyLocalised('description', post[locale].description, locale);

		});

		if (file) {
			var public_path = __app_root + '/public';
			var dir_path = '/cdn/images/partners' + '/' + partner._id;
			var file_name = 'logo.png';

			mkdirp(public_path + dir_path, function() {
				gm(file.path).size({bufferStream: true}, function(err, size) {
					this.resize(size.width > 320 ? 320 : false, false);
					this.write(public_path + dir_path + '/' + file_name, function() {
						del(file.path, function() {
							partner.logo = dir_path + '/' + file_name;
							partner.save(function(err, partner) {
								res.redirect('/partners');
							});
						});
					});
				});
			});
		} else {
			partner.save(function(err, partner) {
				if (err) return next(err);

				res.redirect('/partners');
			});
		}

	};

	return module;
};