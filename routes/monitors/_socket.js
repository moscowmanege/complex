var jade = require('jade');

var Model = require(__app_root + '/models/main.js');

module.exports = function(io) {
  var module = {};
	var Event = Model.Event;

	var get_areas = function(status, callback) {

		Event.aggregate()
			// .match({
			// 	$gte: date_now,
			// 	$lte: date_plus_three_days
			// })
			.sort({
				'interval': {
					'begin': 1,
					'end': 1
				}
			})
			.group({
				'_id': {
					'area': '$place.area'
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
						tickets: '$tickets'
					}
				}
			})
			.project({
				_id: 0,
				area: '$_id.area',
				events: '$events'
			})
			.exec(function(err, areas) {
				var paths = [
					{path:'events.halls', select: 'title', model: 'Hall'},
					{path:'events.categorys', select: 'title', model: 'Category'},
					{path:'events.members.ids', select: 'name', model: 'Member'},
					{path:'events.tickets.ids', model: 'Ticket'},
				];

				Event.populate(areas, paths, function(err, areas) {
					callback(null, areas);
				});
			});
	};

	var areas_compile = function(areas, callback) {
		var opts = {areas: areas, compileDebug: false, debug: false, cache: false, pretty: false};
		var areas_compile = jade.renderFile(__app_root + '/views/monitors/monitor.jade', opts);

		callback(null, areas_compile);
	}

	module.get = function(socket) {
		var area_id = socket.handshake['query']['area'];
		socket.join(area_id);

		get_areas('start', function(err, areas) {
			var area = areas.filter(function(area) {
				return area.area == area_id;
			})[0];

			if (area.events && area.events.length > 0) {
				areas_compile(area, function(err, compile) {
					io.to(area).emit('events', { areas: compile, status: 'start' });
				});
			} else {
				areas_compile(areas, function(err, compile) {
					io.to(area).emit('events', { areas: compile, status: 'start' });
				});
			}
		});


		socket.on('update', function(data) {
			get_areas(data.status, function(err, areas) {
				var area = areas.filter(function(area) {
					return area.area == area_id;
				})[0];

				if (area.events && area.events.length > 0) {
					areas_compile(area, function(err, compile) {
						io.to(area_id).emit('events', { areas: compile, status: data.status });
					});
				} else {
					areas_compile(areas, function(err, compile) {
						io.to(area_id).emit('events', { areas: compile, status: data.status });
					});
				}
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

		get_areas('update', function(err, areas) {
			rooms.forEach(function(room_id) {
				var area = areas.filter(function(area) {
					return area.area == room_id;
				})[0];

				if (area.events && area.events.length > 0) {
					areas_compile(area, function(err, compile) {
						io.to(room_id).emit('events', { areas: compile, status: 'update' });
					});
				} else {
					areas_compile(areas, function(err, compile) {
						io.to(room_id).emit('events', { areas: compile, status: 'update' });
					});
				}
			});
		});
	}


  return module;
}