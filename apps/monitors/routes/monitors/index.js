module.exports = function(Model) {
	var Event = Model.Event;
	var Area = Model.Area;
	var module = {};

	module.index = function(req, res) {
		Area.find().populate('halls').exec(function(err, areas) {
			res.render('monitor', {areas: areas});
		});
	};


	module.test = function(req, res) {
		Event.aggregate()
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
			.unwind('complex')
			.unwind('complex')
			.group({
				'_id': {
					area: '$_id.area'
				},
				'complex': {$addToSet: '$complex'},
				'events': {$addToSet: '$events'}
			})
			.project({
				_id: 0,
				area: '$_id.area',
				complex: '$complex',
				events: { $arrayElemAt: ['$events', 0] },
			})
			.exec(function(err, areas) {

				// var paths = [
				// 	{path:'complex', select: 'type price _id', model: 'Ticket'},
				// 	{path:'events.halls', select: 'title', model: 'Hall'},
				// 	{path:'events.categorys', select: 'title', model: 'Category'},
				// 	{path:'events.members.ids', select: 'name', model: 'Member'},
				// 	{path:'events.tickets.ids', select: 'type price _id', model: 'Ticket'},
				// ];

				// Event.populate(areas, paths, function(err, areas) {
					res.send(areas);
				// });
			});
	};

	return module;
};