var del = require('del');

module.exports = function(Model) {
	var News = Model.News;
	var module = {};


	module.index = function(req, res) {
		var id = req.body.id;

		News.findByIdAndRemove(id).exec(function(err, news) {
			del(__app_root + '/public/cdn/images/news/' + id, function() {
				res.send('ok');
			});
		});
	};


	return module;
};