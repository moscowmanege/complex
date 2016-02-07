var jade = require('jade');
var mongoose = require('mongoose');
var moment = require('moment');

var Model = require(__app_root + '/models/main.js');

module.exports = function(io, i18n) {
	var module = {};
	var Event = Model.Event;
	var Area = Model.Area;

	var get_areas = function(ids, callback) {

		var Query = null;

		if (Array.isArray(ids)) {

			var obj_ids = ids.reduce(function(memo, id) {
				if (mongoose.Types.ObjectId.isValid(id)) {
					memo.push(mongoose.Types.ObjectId(id));
				}
				return memo;
			}, []);

			Query = Event.aggregate()
				.match({
					'place.area': { '$in': obj_ids }
					// $gte: date_now,
					// $lte: date_last_of_month
				});
		} else if (ids == 'all') {
			Query = Event.aggregate()
				.match({
					// $gte: date_now,
					// $lte: date_now
				});
		} else {
			Query = Event.aggregate()
				.match({
					'place.area': mongoose.Types.ObjectId(ids)
					// $gte: date_now,
					// $lte: date_last_of_month
				});
		}

		Query
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
					Area.populate(areas, {path: 'area', model: 'Area'}, function(err, areas) {
						callback(null, areas);
					});
				});
			});
	};

	var areas_compile = function(areas, callback) {
		var get_locale = function(option, lang) {
			return ((option.filter(function(locale) {
				return locale.lg == lang;
			})[0] || {}).value || '');
		};

		var i18n_locale = function() {
			return i18n.__.apply(null, arguments);
		};

		var i18n_plurals_locale = function() {
			return i18n.__n.apply(null, arguments);
		};

		var opts = {areas: areas, moment: moment, get_locale: get_locale, __: i18n_locale, __n:i18n_plurals_locale, i18n: i18n, compileDebug: false, debug: false, cache: false, pretty: false};
		var areas_compile = jade.renderFile(__app_root + '/views/monitors/monitor.jade', opts);

		callback(null, areas_compile);
	};

	module.get = function(socket) {
		var area_id = socket.handshake.query.area;
		socket.join(area_id);

		get_areas(area_id, function(err, areas) {
			if (areas.length > 0 && areas[0].events && areas[0].events.length > 0) {
				areas_compile(areas, function(err, compile) {
					io.to(area_id).emit('events', { areas: compile, status: 'start' });
				});
			} else {
				get_areas('all', function(err, areas) {
					areas_compile(areas, function(err, compile) {
						io.to(area_id).emit('events', { areas: compile, status: 'start' });
					});
				});
			}
		});


		socket.on('update', function(data) {
			get_areas(area_id, function(err, areas) {
				if (areas.length > 0 && areas[0].events && areas[0].events.length > 0) {
					areas_compile(areas, function(err, compile) {
						io.to(area_id).emit('events', { areas: compile, status: data.status });
					});
				} else {
					get_areas('all', function(err, areas) {
						areas_compile(areas, function(err, compile) {
							io.to(area_id).emit('events', { areas: compile, status: data.status });
						});
					});
				}
			});
		});

		socket.on('disconnect', function (data) {
			socket.leave(area_id);
		});

		socket.on('reload', function (data) {
			io.emit('push_reload', { hello: 'hello socket!' });
		});
	};

	module.interval = function() {
		var rooms = Object.keys(io.sockets.adapter.rooms);
		// console.log('Connections: ' + io.engine.clientsCount);
		// console.log('Rooms: ' + Object.keys(io.sockets.adapter.rooms));

		get_areas('all', function(err, areas_all) {
			get_areas(rooms, function(err, areas_rooms) {
				if (areas_rooms && areas_rooms.length > 0) {
					areas_rooms.forEach(function(area) {
						var room_id = area.area._id.toString();
						var check_rooms = rooms.some(function(c_room) {
							return c_room == room_id;
						});

						if (check_rooms) {
							areas_compile([area], function(err, compile) {
								io.to(room_id).emit('events', { areas: compile, status: 'update' });
							});
						}
						else {
							areas_compile(areas_all, function(err, compile) {
								io.to(room_id).emit('events', { areas: compile, status: 'update' });
							});
						}
					});
				}
			});
		});
	};


	return module;
};