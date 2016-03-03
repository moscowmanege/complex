module.exports = function(Model) {
	var Event = Model.Event;
	var Area = Model.Area;
	var module = {};

	module.index = function(req, res) {
		Area.find().populate('halls').exec(function(err, areas) {
			res.render('monitors/index.jade', {areas: areas});
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
			.project({
				_id: 0,
				area: '$_id.area',
				complex: '$complex',
				events: '$events',
			})
			.exec(function(err, areas) {
				var areas = areas.map(function(area) {

					area.complex = [].concat.apply([], area.complex);

					area.complex = area.complex.map(function(ticket) {
						return ticket.toString();
					});

					area.complex = area.complex.reduce(function(a, b) {
						if (a.indexOf(b) < 0) a.push(b);
						return a;
					}, []);

					return area;
				});


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


	module.test2 = function(req, res) {

		Event.aggregate()
			// .unwind('tickets.ids')
			.group({
				'_id': {
					complex: { $gt: [{$size: '$tickets.ids' }, 1] },
					ticket: '$tickets.ids'
				},
				'events': {
					$push: {
						_id: '$_id',
						// title: '$title.value',
						// description: '$description.value',
						// tickets: '$tickets'
					}
				}
			})
			.exec(function(err, result) {
				// Event.populate(result, {path: '_id.ticket', model: 'Ticket'}, function(err, events) {
				// 	res.send(events);
				// });
				res.send(result);
			});

	};


	return module;
};