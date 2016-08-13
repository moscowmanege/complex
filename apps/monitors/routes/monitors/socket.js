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

		var opts = {
			__: function() { return i18n.__.apply(null, arguments); },
			__n: function() { return i18n.__n.apply(null, arguments); },
			arr_equals: function(arr1, arr2) {
				return arr1.sort().toString() === arr2.sort().toString();
			},
			areas: areas,
			get_locale: get_locale,
			i18n: i18n,
			moment: moment,
			compileDebug: false, debug: false, cache: false, pretty: false
		};

		callback(null, jade.renderFile(__app_root + '/apps/monitors/views/monitor/monitor.jade', opts));
	};

	module.get = function(socket) {
		var area_id = socket.handshake.query.area;
		var load;

		socket.join(area_id);

		(load = function(data) {
			var date_now = moment().toDate();
			var status = data ? data.status : 'start';

			Query.News(date_now, function(err, areas_news) {
				Query.Events(date_now, area_id, function(err, areas_events) {
					if (areas_events.length > 0 && areas_events[0].events && areas_events[0].events.length > 6) {
						areas_news = areas_news.filter(function(area) { return area.area == area_id; });
						var areas_union = areasUnion(areas_events, areas_news);

						Query.Populate(areas_union, function(err, areas_union) {
							areasCompile(areas_union, function(err, compile) {
								io.to(area_id).emit('events', { areas: compile, status: status });
							});
						});
					} else {
						Query.Events(date_now, 'all', function(err, areas_events) {
							var areas_union = areasUnion(areas_events, areas_news);
							Query.Populate(areas_union, function(err, areas_union) {
								areasCompile(areas_union, function(err, compile) {
									io.to(area_id).emit('events', { areas: compile, status: status });
								});
							});
						});
					}
				});
			});
		})();

		socket.on('update', function(data) {
			load(data);
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

		Query.News(date_now, function(err, areas_news) {
			Query.Events(date_now, 'all', function(err, areas_events_all) {
				var areas_union_all = areasUnion(areas_events_all, areas_news);

				Query.Populate(areas_union_all, function(err, areas_union_all) {
					Query.Events(date_now, rooms, function(err, areas_rooms) {
						var areas_union_rooms = areasUnion(areas_rooms, areas_news);

						Query.Populate(areas_union_rooms, function(err, areas_union_rooms) {
							if (areas_union_rooms && areas_union_rooms.length > 0) {
								areas_union_rooms.forEach(function(area) {
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
										areasCompile(areas_union_all, function(err, compile) {
											io.to(room_id).emit('events', { areas: compile, status: 'update' });
										});
									}
								});
							}
						});
					});
				});
			});
		});
	};


	return module;
};