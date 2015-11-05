module.exports = function(Model) {
	var Event = Model.Event;
	var module = {};

	module.index = function(req, res) {
	  res.render('monitors/index.jade');
	}

	module.demo = function(req, res) {
	  res.render('monitors/demo.jade');
	}


	module.test = function(req, res) {
		Event.aggregate()
			// .match({
			// 	'area': area_id,
			// 	'type': 'exhibits'
			// })
			.unwind('tickets.ids')
			.group({
				'_id': {
					ticket: '$tickets.ids',
				},
				'events': {
					$push: {
						title: '$title.value',
						description: '$description.value',
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