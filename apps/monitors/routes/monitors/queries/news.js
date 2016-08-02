var Model = require(__app_root + '/models/main.js');

module.exports.News = function(date_now, callback) {
	var News = Model.News;

	News.aggregate()
		.match({
			'status': { $ne: 'hidden' },
			'meta': { $exists: false },
			'interval.end': { $gte: date_now }
		})
		.sort({
			'interval': {
				'begin': 1,
				'end': 1
			}
		})
		.unwind('areas')
		.group({
			'_id': {
				'area': '$areas',
			},
			'news': {
				$push: {
					title: '$title',
					s_title: '$s_title',
					description: '$description',
					interval: '$interval',
					categorys: '$categorys',
				}
			}
		})
		.project({
			'_id': 0,
			'area': '$_id.area',
			'news': '$news',
			'events': []
		})
		.exec(function(err, areas) {
			callback(null, areas);
		});
};