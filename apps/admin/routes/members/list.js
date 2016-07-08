var jade = require('jade');
var i18n = require('i18n');


module.exports = function(Model) {
	var Member = Model.Member;
	var module = {};

	var i18n_locale = function() {
		return i18n.__.apply(null, arguments);
	};

	var i18n_plurals_locale = function() {
		return i18n.__n.apply(null, arguments);
	};


	module.index = function(req, res) {
		Member.find().sort('-date').limit(10).exec(function(err, members) {
			Member.count().exec(function(err, count) {
				res.render('members', {members: members, count: Math.ceil(count / 10)});
			});
		});
	};

	module.get_list = function(req, res) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Member.find({ $text : { $search : post.context.text } } )
			: Member.find();

		if (post.context.role && post.context.role != 'all') {
			Query.where('roles').equals(post.context.role);
		}

		if (post.context.status && post.context.status == 'default') {
			Query.where('status').ne('hidden');
		}

		if (post.context.status && post.context.status == 'hidden') {
			Query.where('status').equals('hidden');
		}

		Query.count(function(err, count) {
			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, members) {
				if (members && members.length > 0) {
					var opts = {members: members, count: Math.ceil(count / 10), skip: +post.context.skip, load_list: true, __: i18n_locale, __n: i18n_plurals_locale, compileDebug: false, debug: false, cache: true, pretty: false};
					res.send(jade.renderFile(__app_root + '/apps/admin/views/members/_members.jade', opts));
				} else {
					res.send('end');
				}
			});
		});
	};

	module.get_members = function(req, res) {
		var tag = req.body.tag;

		Member.find({'roles': tag}).exec(function(err, members) {
			res.send(members);
		});
	};


	return module;
};