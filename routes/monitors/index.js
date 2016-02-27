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
				'complex': { $push: '$tickets.ids' },
				'events': {
					$push: {
						title: '$title',
						age: '$age',
						type: '$type',
						interval: '$interval',
						halls: '$place.halls',
						categorys: '$categorys',
						members: '$members',
						tickets: '$tickets'
					}
				}
			})
			.project({
				_id: 0,
				area: '$_id.area',
				complex:  '$complex',
				events: '$events',
			})
			.exec(function(err, areas) {
				var areas = areas.map(function(area) {

					var unicDuplicates = function (arr) {
					  return arr.reduce(function(dupes, val, i) {
					    if (arr.indexOf(val) !== i && dupes.indexOf(val) === -1) {
					      dupes.push(val);
					    }
					    return dupes;
					  }, []);
					}

					// concat sub array of event tickets
					area.complex = [].concat.apply([], area.complex);

					// unic dublicates of tickets => complex tickets
					area.complex = unicDuplicates(area.complex.map(function(ticket) { return ticket.toString() }));

					// remove complex tickets from event tickets
					area.events = area.events.map(function(event) {
						event.tickets.ids = event.tickets.ids.filter(function(ticket) {
							return !area.complex.some(function(complex_ticket) { return ticket.toString() == complex_ticket.toString(); });
						});

						return event;
					});

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