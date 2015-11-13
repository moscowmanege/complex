

module.exports = function(io, get_events) {
  var module = {};

	module.get = function(socket) {
		var area = socket.handshake['query']['area'];
		get_events('start', area)

		socket.join(area);

		console.log('Connections: ' + io.engine.clientsCount, 'Area: ' + area);

		socket.on('update', function(data) {
			get_events(data.status, area);
		});

		socket.on('disconnect', function (data) {
			socket.leave(area);
		});

		socket.on('reload', function (data) {
			io.emit('push_reload', { hello: 'hello socket!' });
		});
	}


  return module;
}