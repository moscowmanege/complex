var rimraf = require('rimraf');

module.exports = function(Model) {
	var module = {};

	var News = Model.News;


	module.index = function(req, res, next) {
		var id = req.body.id;

		News.findByIdAndRemove(id).exec(function(err, news) {
			if (err) return next(err);

			rimraf(__app_root + '/public/cdn/images/news/' + id, { glob: false }, function() {
				res.send('ok');
			});
		});
	};


	return module;
};