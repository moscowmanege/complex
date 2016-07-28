module.exports = function(Model) {
	var module = {};

	var areaUnion = function(arr1, arr2) {
		var union = arr1.concat(arr2);

		for (var i = 0; i < union.length; i++) {
			for (var j = i+1; j < union.length; j++) {
				if (union[i].area.toString() === union[j].area.toString()) {
						union[i].news = union[j].news;
						union.splice(j, 1);
						j--;
				}
			}
		}

		return union;
	};

	module.test1 = function(req, res) {
		var moment = require('moment');
		var date_now = moment().toDate();

		var Query = {
			News: require('./queries/news.js').News,
			Events: require('./queries/events.js').Events,
			Populate: require('./queries/opts.js').Populate
		};

		Query.Events(date_now, 'all', function(err, events) {
			Query.News(date_now, function(err, news) {
				var union = areaUnion(events, news);
				res.send(union);
			});
		});
	};


	// module.test2 = function(req, res) {
	// 	var Event = Model.Event;
	// 	Event.aggregate()
	// 		.sort({
	// 			'interval': {
	// 				'begin': 1,
	// 				'end': 1
	// 			}
	// 		})
	// 		.group({
	// 			'_id': {
	// 				'area': '$place.area',
	// 			},
	// 			'complex': {
	// 				$push: {
	// 					$setDifference: [{
	// 						$map: {
	// 							input: '$tickets.ids',
	// 							as: 'ticket',
	// 							in: { $cond: [{ $eq: ['$$ticket.complex', true] }, '$$ticket.id', false] }
	// 						}
	// 					}, [false]]
	// 				}
	// 			},
	// 			'events': {
	// 				$push: {
	// 					title: '$title',
	// 					age: '$age',
	// 					type: '$type',
	// 					interval: '$interval',
	// 					halls: '$place.halls',
	// 					categorys: '$categorys',
	// 					members: '$members',
	// 					tickets: {
	// 						alt: '$tickets.alt',
	// 						ids: {
	// 							$setDifference: [{
	// 								$map: {
	// 									input: '$tickets.ids',
	// 									as: 'ticket',
	// 									in: { $cond: [{ $eq: ['$$ticket.complex', false] }, '$$ticket.id', false] }
	// 								}
	// 							}, [false]]
	// 						}
	// 					}
	// 				}
	// 			}
	// 		})
	// 		.unwind('complex')
	// 		.unwind('complex')
	// 		.group({
	// 			'_id': {
	// 				area: '$_id.area'
	// 			},
	// 			'complex': {$addToSet: '$complex'},
	// 			'events': {$addToSet: '$events'}
	// 		})
	// 		.project({
	// 			_id: 0,
	// 			area: '$_id.area',
	// 			complex: '$complex',
	// 			events: { $arrayElemAt: ['$events', 0] },
	// 		})
	// 		.exec(function(err, areas) {

	// 			// var paths = [
	// 			// 	{path:'complex', select: 'type price _id', model: 'Ticket'},
	// 			// 	{path:'events.halls', select: 'title', model: 'Hall'},
	// 			// 	{path:'events.categorys', select: 'title', model: 'Category'},
	// 			// 	{path:'events.members.ids', select: 'name', model: 'Member'},
	// 			// 	{path:'events.tickets.ids', select: 'type price _id', model: 'Ticket'},
	// 			// ];

	// 			// Event.populate(areas, paths, function(err, areas) {
	// 				res.send(areas);
	// 			// });
	// 		});
	// };

	return module;
};