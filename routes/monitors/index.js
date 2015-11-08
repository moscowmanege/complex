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