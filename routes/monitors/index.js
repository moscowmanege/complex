module.exports = function(Model) {
	var Event = Model.Event;
	var Area = Model.Area;
	var module = {};

	module.index = function(req, res) {
		Area.find().populate('halls').exec(function(err, areas) {
			res.render('monitors/index.jade', {areas: areas});
		});
	}


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
				'complex': { $addToSet: '$tickets.ids' },
				'exhibitions': {
					$push: {
						$cond: [
							{ '$eq': ['$type', 'exhibition'] },
							{
								title: '$title',
								age: '$age',
								type: '$type',
								interval: '$interval',
								halls: '$place.halls',
								categorys: '$categorys',
								members: '$members',
								tickets: '$tickets'
							},
							false
						]
					}
				},
				'events': {
					$push: {
						$cond: [
							{ '$ne': ['$type', 'exhibition'] },
							{
								title: '$title',
								age: '$age',
								type: '$type',
								interval: '$interval',
								halls: '$place.halls',
								categorys: '$categorys',
								members: '$members',
								tickets: '$tickets'
							},
							false
						]
					}
				}
			})
			// .unwind('complex')
			// .unwind('complex')
			.project({
				_id: 0,
				area: '$_id.area',
				complex:  '$complex',
				events: { $setDifference: [ '$events', [false] ] },
				exhibitions: { $setDifference: [ '$exhibitions', [false] ] }
			})
			.exec(function(err, areas) {
				// var paths = [
				// 	{path:'events.halls', select: 'title', model: 'Hall'},
				// 	{path:'events.categorys', select: 'title', model: 'Category'},
				// 	{path:'events.members.ids', select: 'name', model: 'Member'},
				// 	{path:'events.tickets.ids', select: 'type price _id', model: 'Ticket'},
				// 	{path:'exhibitions.halls', select: 'title', model: 'Hall'},
				// 	{path:'exhibitions.categorys', select: 'title', model: 'Category'},
				// 	{path:'exhibitions.members.ids', select: 'name', model: 'Member'},
				// 	{path:'exhibitions.tickets.ids', select: 'type price _id', model: 'Ticket'},
				// ];

				// Event.populate(areas, paths, function(err, areas) {
					res.send(areas);
				// });
			});
	}


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
			})

	}


	return module;
}