var later = require('later');
var jade = require('jade');

var Model = require(__app_root + '/models/main.js');

module.exports = function(io) {
  var module = {};
  var Event = Model.Event;

	var schedule = later.parse.recur().every(1).minute();
	var task;

	var get_events = function(status) {
			Event.find().populate('place.area place.halls').exec(function(err, events) {
				var opts = {events: events, compileDebug: false, debug: false, cache: false, pretty: false};
				var events_compile = jade.renderFile(__app_root + '/views/monitors/monitor.jade', opts);
				io.emit('events', { events: events_compile, status: status });
			});
		}

	module.get = function(socket) {
		console.log('Connections: ' + io.engine.clientsCount)
		socket.emit('news', { status: 'init' });

		socket.on('start', function (data) {
			task = later.setTimeout(get_events(data.status), schedule);
		});

		socket.on('update', function(data) {
			task.clear();
			task = later.setTimeout(get_events(data.status), schedule);
		});

		socket.on('stop', function (data) {
			task.clear();
		});

		socket.on('reload', function (data) {
			io.emit('push_reload', { hello: 'hello socket!' });
		});
	}


  return module;
}