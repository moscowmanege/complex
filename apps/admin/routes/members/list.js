var jade = require('jade');
var i18n = require('i18n');


module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;


	module.index = function(req, res, next) {
		Member.find().sort('-date').limit(10).exec(function(err, members) {
			if (err) return next(err);

			Member.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('members', {members: members, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
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
				if (err) return next(err);

				if (members.length > 0) {
					var opts = {
						__: function() { return i18n.__.apply(null, arguments); },
						__n: function() { return i18n.__n.apply(null, arguments); },
						members: members,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(jade.renderFile(__app_root + '/apps/admin/views/members/_members.jade', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	module.get_members = function(req, res, next) {
		var tag = req.body.tag;

		Member.find({'roles': tag}).exec(function(err, members) {
			if (err) return next(err);

			res.send(members);
		});
	};


	return module;
};