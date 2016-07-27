var mongoose = require('mongoose');

var Model = require(__app_root + '/models/main.js');

module.exports.Events = function(date_now, ids, callback) {
	var Event = Model.Event;
	var Query = null;

	if (Array.isArray(ids)) {

		var obj_ids = ids.reduce(function(memo, id) {
			if (mongoose.Types.ObjectId.isValid(id)) {
				memo.push(mongoose.Types.ObjectId(id));
			}
			return memo;
		}, []);

		Query = Event.aggregate()
			.match({
				'status': { $ne: 'hidden' },
				'meta': { $exists: false },
				'interval.end': { $gte: date_now },
				'place.area': { $in: obj_ids }
			});
	} else if (ids == 'all') {
		Query = Event.aggregate()
			.match({
				'status': { $ne: 'hidden' },
				'meta': { $exists: false },
				'interval.end': { $gte: date_now }
			});
	} else {
		Query = Event.aggregate()
			.match({
				'status': { $ne: 'hidden' },
				'meta': { $exists: false },
				'interval.end': { $gte: date_now },
				'place.area': mongoose.Types.ObjectId(ids)
			});
	}

	Query
		.sort({
			'interval': {
				'begin': 1,
				'end': 1
			}
		})
		.group({
			'_id': {
				'area': '$place.area',
			},
			'complex': {
				$push: {
					$setDifference: [{
						$map: {
							input: '$tickets.ids',
							as: 'ticket',
							in: { $cond: [{ $eq: ['$$ticket.complex', true] }, '$$ticket.id', false] }
						}
					}, [false]]
				}
			},
			'events': {
				$push: {
					title: '$title',
					age: '$age',
					type: '$type',
					interval: '$interval',
					halls: '$place.halls',
					categorys: '$categorys',
					members: '$members',
					tickets: {
						alt: '$tickets.alt',
						ids: {
							$setDifference: [{
								$map: {
									input: '$tickets.ids',
									as: 'ticket',
									in: { $cond: [{ $eq: ['$$ticket.complex', false] }, '$$ticket.id', false] }
								}
							}, [false]]
						}
					}
				}
			}
		})
		.project({
			_id: 0,
			area: '$_id.area',
			complex: '$complex',
			events: '$events'
		})
		.exec(function(err, areas) {
			var areas = areas.map(function(area) {

				// concat complex tickets
				area.complex = [].concat.apply([], area.complex);

				area.complex = area.complex.map(function(ticket) {
					return ticket.toString();
				});

				// remove dublicates
				area.complex = area.complex.reduce(function(a, b) {
					if (a.indexOf(b) < 0) a.push(b);
					return a;
				}, []);

				return area;
			});

			callback(null, areas);
		});
};