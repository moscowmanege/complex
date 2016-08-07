var jade = require('jade');
var i18n = require('i18n');


module.exports = function(Model) {
	var module = {};

	var Partner = Model.Partner;


	var i18n_locale = function() {
		return i18n.__.apply(null, arguments);
	};

	var i18n_plurals_locale = function() {
		return i18n.__n.apply(null, arguments);
	};


	module.index = function(req, res, next) {
		Partner.find().sort('-date').limit(10).exec(function(err, partners) {
			if (err) return next(err);

			Partner.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('partners', {partners: partners, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Partner.find({ $text : { $search : post.context.text } } )
			: Partner.find();

		if (post.context.type && post.context.type != 'all') {
			Query.where('type').equals(post.context.type);
		}

		if (post.context.status && post.context.status == 'default') {
			Query.where('status').ne('hidden');
		}

		if (post.context.status && post.context.status == 'hidden') {
			Query.where('status').equals('hidden');
		}

		Query.count(function(err, count) {
			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, partners) {
				if (err) return next(err);

				if (partners.length > 0) {
					var opts = {
						partners: partners,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						__: i18n_locale, __n: i18n_plurals_locale,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(jade.renderFile(__app_root + '/apps/admin/views/partners/_partners.jade', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	module.get_partners = function(req, res, next) {
		Partner.find().exec(function(err, partners) {
			if (err) return next(err);

			res.send(partners);
		});
	};


	return module;
};