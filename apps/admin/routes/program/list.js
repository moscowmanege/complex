module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;


	module.index = function(req, res, next) {
		var event_id = req.params.event_id;

		Event.findById(event_id).populate('program.children').exec(function(err, event) {
			if (err) return next(err);

			Event.find().where('_id').ne(event_id).where('program.children').size(0).where('program.parent').exists(false).sort('-date').exec(function(err, events) {
				if (err) return next(err);

				res.render('program', {event: event, events: events});
			});
		});
	};

	module.move = function(req, res, next) {
		var event_id = req.params.event_id;
		var event_move = req.body.event_move;
		var status = req.body.status;

		if (status == 'push') {
			Event.update({'_id': event_id}, { $push: { 'program.children': event_move } }).exec(function(err) {
				if (err) return next(err);

				Event.update({ '_id': event_move }, { $set: { 'program.parent': event_id } }).exec(function(err) {
					if (err) return next(err);

					res.send('ok');
				});
			});
		} else {
			Event.update({'_id': event_id}, { $pull: { 'program.children': event_move } }).exec(function(err) {
				if (err) return next(err);

				Event.update({ '_id': event_move }, { $unset: { 'program.parent': event_id } }).exec(function(err) {
					if (err) return next(err);

					res.send('ok');
				});
			});
		}
	};


	return module;
};