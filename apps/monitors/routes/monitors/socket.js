var jade = require('jade');
var moment = require('moment');

var Query = {
	News: require('./queries/news.js').News,
	Events: require('./queries/events.js').Events,
	Populate: require('./queries/opts.js').Populate
};

module.exports = function(io, i18n) {
	var module = {};

	var areasUnion = function(arr1, arr2) {
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

	var areasCompile = function(areas, callback) {

		var get_locale = function(option, lang) {
			return ((option.filter(function(locale) {
				return locale.lg == lang;
			})[0] || {}).value || '');
		};

		var arr_equals = function(arr1, arr2) {
			return arr1.sort().toString() === arr2.sort().toString();
		};

		var i18n_locale = function() {
			return i18n.__.apply(null, arguments);
		};

		var i18n_plurals_locale = function() {
			return i18n.__n.apply(null, arguments);
		};

		var opts = {
			areas: areas,
			arr_equals: arr_equals,
			get_locale: get_locale,
			__: i18n_locale,
			__n:i18n_plurals_locale,
			i18n: i18n,
			moment: moment,
			compileDebug: false, debug: false, cache: false, pretty: false
		};

		callback(null, jade.renderFile(__app_root + '/apps/monitors/views/monitor/monitor.jade', opts));
	};

	module.get = function(socket) {
		var date_now = moment().toDate();
		var area_id = socket.handshake.query.area;
		socket.join(area_id);

		Query.Events(date_now, area_id, function(err, areas) {
			if (areas.length > 0 && areas[0].events && areas[0].events.length > 6) {
				Query.Populate(areas, function(err, areas) {
					areasCompile(areas, function(err, compile) {
						io.to(area_id).emit('events', { areas: compile, status: 'start' });
					});
				});
			} else {
				Query.Events(date_now, 'all', function(err, areas) {
					Query.Populate(areas, function(err, areas) {
						areasCompile(areas, function(err, compile) {
							io.to(area_id).emit('events', { areas: compile, status: 'start' });
						});
					});
				});
			}
		});


		socket.on('update', function(data) {
			var date_now = moment().toDate();

			Query.Events(date_now, area_id, function(err, areas) {
				if (areas.length > 0 && areas[0].events && areas[0].events.length > 6) {
					Query.Populate(areas, function(err, areas) {
						areasCompile(areas, function(err, compile) {
							io.to(area_id).emit('events', { areas: compile, status: data.status });
						});
					});
				} else {
					Query.Events(date_now, 'all', function(err, areas) {
						Query.Populate(areas, function(err, areas) {
							areasCompile(areas, function(err, compile) {
								io.to(area_id).emit('events', { areas: compile, status: data.status });
							});
						});
					});
				}
			});
		});

		socket.on('disconnect', function(data) {
			socket.leave(area_id);
		});

		socket.on('reload', function(data) {
			io.emit('push_reload');
		});
	};

	module.interval = function() {
		var date_now = moment().toDate();
		var rooms = Object.keys(io.sockets.adapter.rooms);
		// console.log('Connections: ' + io.engine.clientsCount);
		// console.log('Rooms: ' + Object.keys(io.sockets.adapter.rooms));

		Query.Events(date_now, 'all', function(err, areas_all) {
			Query.Populate(areas, function(err, areas_all) {
				Query.Events(date_now, rooms, function(err, areas_rooms) {
					Query.Populate(areas, function(err, areas_rooms) {
						if (areas_rooms && areas_rooms.length > 0) {
							areas_rooms.forEach(function(area) {
								var room_id = area.area._id.toString();
								var check_rooms = rooms.some(function(c_room) {
									return c_room == room_id;
								});

								if (check_rooms && area.events && area.events.length > 6) {
									areasCompile([area], function(err, compile) {
										io.to(room_id).emit('events', { areas: compile, status: 'update' });
									});
								}
								else {
									areasCompile(areas_all, function(err, compile) {
										io.to(room_id).emit('events', { areas: compile, status: 'update' });
									});
								}
							});
						}
					});
				});
			});
		});
	};


	return module;
};