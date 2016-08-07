var del = require('del');

module.exports = function(Model) {
	var module = {};

	var News = Model.News;


	module.index = function(req, res, next) {
		var id = req.body.id;

		News.findByIdAndRemove(id).exec(function(err, news) {
			if (err) return next(err);

			del(__app_root + '/public/cdn/images/news/' + id, function() {
				res.send('ok');
			});
		});
	};


	return module;
};