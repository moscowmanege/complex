var later = require('later');
var jade = require('jade');
var chunk = require('chunk');

var Model = require(__app_root + '/models/main.js');

module.exports = function(io) {
  var module = {};
  var Event = Model.Event;
  var Area = Model.Area;

	var schedule = later.parse.recur().every(1).minute();

	var get_events = function(status, area) {
		Area.findById(area).exec(function(err, area) {
			Event.find({'place.area': area}).populate('place.halls tickets.ids').exec(function(err, events) {
				var chunks = chunk(events, 2);
				var opts = {chunks: chunks, area: area, compileDebug: false, debug: false, cache: false, pretty: false};
				var events_compile = jade.renderFile(__app_root + '/views/monitors/monitor.jade', opts);
				io.to(area._id).emit('events', { events: events_compile, status: status });
			});
		});
	}

	module.get = function(socket) {
		var area = socket.handshake['query']['area'];
		var task = later.setTimeout(get_events('start', area), schedule);

		socket.join(area);

		console.log('Connections: ' + io.engine.clientsCount, 'Area: ' + area);

		socket.on('update', function(data) {
			task.clear();
			task = later.setTimeout(get_events(data.status, area), schedule);
		});

		socket.on('disconnect', function (data) {
			task.clear();
			socket.leave(area);
		});

		socket.on('reload', function (data) {
			io.emit('push_reload', { hello: 'hello socket!' });
		});
	}


  return module;
}