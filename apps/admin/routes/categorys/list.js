var jade = require('jade');
var i18n = require('i18n');


module.exports = function(Model) {
	var Category = Model.Category;
	var module = {};

	var i18n_locale = function() {
		return i18n.__.apply(null, arguments);
	};

	var i18n_plurals_locale = function() {
		return i18n.__n.apply(null, arguments);
	};


	module.index = function(req, res) {
		Category.find().sort('-date').limit(10).exec(function(err, categorys) {
			Category.count().exec(function(err, count) {
				res.render('categorys', {categorys: categorys, count: Math.ceil(count / 10)});
			});
		});
	};

	module.get_list = function(req, res) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Category.find({ $text : { $search : post.context.text } } )
			: Category.find();

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
			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, categorys) {
				if (categorys && categorys.length > 0) {
					var opts = {
						categorys: categorys, count: Math.ceil(count / 10), skip: +post.context.skip, load_list: true, __: i18n_locale, __n: i18n_plurals_locale, compileDebug: false, debug: false, cache: true, pretty: false};
					res.send(jade.renderFile(__app_root + '/apps/admin/views/categorys/_categorys.jade', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};