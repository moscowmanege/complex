exports.QueryNews = function(callback) {

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
					interval: '$interval',
					categorys: '$categorys',
				}
			}
		})
		.project({
			'_id': 0,
			'area': '$_id.area',
			'news': '$news'
		})
		.exec(function(err, areas) {
			callback(null, areas);
		});
};