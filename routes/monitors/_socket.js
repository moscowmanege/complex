var chunk = require('chunk');
var jade = require('jade');

var Model = require(__app_root + '/models/main.js');

module.exports = function(io) {
  var module = {};
	var Area = Model.Area;
	var Event = Model.Event;

	var get_events = function(status, area, callback) {
		Area.findById(area).exec(function(err, area) {
			Event.find({'place.area': area}).sort('interval.begin interval.end').populate('place.halls categorys tickets.ids members.ids').exec(function(err, events) {
				events.sort(function(a, b) {
					if (a.type == 'exhibition') return -1;
					else return 1;
				});
				var chunks = chunk(events, 5);
				var opts = {chunks: chunks, area: area, compileDebug: false, debug: false, cache: false, pretty: false};
				var events_compile = jade.renderFile(__app_root + '/views/monitors/monitor.jade', opts);

				callback.call(null, null, events_compile);
			});
		});
	};

	module.get = function(socket) {
		var area = socket.handshake['query']['area'];
		socket.join(area);

		get_events('start', area, function(err, events_compile) {
			io.to(area).emit('events', { events: events_compile, status: 'start' });
		});


		socket.on('update', function(data) {
			get_events(data.status, area, function(err, events_compile) {
				io.to(area).emit('events', { events: events_compile, status: 'update' });
			});
		});

		socket.on('disconnect', function (data) {
			socket.leave(area);
		});

		socket.on('reload', function (data) {
			io.emit('push_reload', { hello: 'hello socket!' });
		});
	}

	module.interval = function() {
		var rooms = Object.keys(io.sockets.adapter.rooms);
		// console.log('Connections: ' + io.engine.clientsCount);
		// console.log('Rooms: ' + Object.keys(io.sockets.adapter.rooms));

		Area.distinct('_id').exec(function(err, areas) {
			areas.forEach(function(area_id) {
				rooms.forEach(function(room_id) {
					if (area_id == room_id) {
						get_events('update', area_id, function(err, events_compile) {
							io.to(area_id).emit('events', { events: events_compile, status: 'update' });
						});
					}
				});
			});
		});
	}


  return module;
}