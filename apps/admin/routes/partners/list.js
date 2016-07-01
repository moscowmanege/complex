var jade = require('jade');
var i18n = require('i18n');


module.exports = function(Model) {
  var Partner = Model.Partner;
  var module = {};

	var i18n_locale = function() {
		return i18n.__.apply(null, arguments);
	};

	var i18n_plurals_locale = function() {
		return i18n.__n.apply(null, arguments);
	};

	module.index = function(req, res) {
	  Partner.find().sort('-date').limit(10).exec(function(err, partners) {
	    res.render('partners', {partners: partners});
	  });
	}

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

		Query.sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, partners) {
			if (partners && partners.length > 0) {
				var opts = {partners: partners, __: i18n_locale, __n: i18n_plurals_locale, compileDebug: false, debug: false, cache: false, pretty: false};
				res.send(jade.renderFile(__app_root + '/apps/admin/views/partners/_partners.jade', opts));
			} else {
				res.send('end');
			}
		});
	};

	module.get_partners = function(req, res) {
	  Partner.find().exec(function(err, partners) {
	    res.send(partners);
	  });
	}


  return module;
}