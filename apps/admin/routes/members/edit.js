var shortid = require('shortid');
var gm = require('gm').subClass({ imageMagick: true });
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');


module.exports = function(Model, Params) {
	var module = {};

	var Member = Model.Member;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.id;

		Member.findById(id).exec(function(err, member) {
			if (err) return next(err);

			res.render('members/edit.jade', {member: member});
		});
	};


	module.form = function(req, res) {
		var post = req.body;
		var file = req.file;
		var id = req.params.id;

		Member.findById(id).exec(function(err, member) {
			if (err) return next(err);

			member.roles = post.roles;
			member.status = post.status;

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'name'])
					&& member.setPropertyLocalised('name', post[locale].name, locale);

				checkNested(post, [locale, 'description'])
					&& member.setPropertyLocalised('description', post[locale].description, locale);

			});

			if (file) {
				var public_path = __app_root + '/public';
				var dir_path = '/cdn/images/members' + '/' + member._id;
				var file_name = 'photo.jpg';

				mkdirp(public_path + dir_path, function() {
					gm(file.path).size({bufferStream: true}, function(err, size) {
						this.resize(size.width > 620 ? 620 : false, false);
						this.quality(size.width > 620 ? 80 : 100);
						this.write(public_path + dir_path + '/' + file_name, function() {
							rimraf(file.path, { glob: false }, function() {
								member.photo = dir_path + '/' + file_name;
								member.save(function(err, member) {
									if (err) return next(err);

									res.redirect('/members');
								});
							});
						});
					});
				});
			} else {
				member.save(function(err, member) {
					if (err) return next(err);

					res.redirect('/members');
				});
			}

		});
	};


	return module;
};