module.exports = function(io) {
  var module = {};

	var interval_send;

	module.get = function(socket) {
		console.log('Connections: ' + io.engine.clientsCount)
		socket.emit('news', { status: 'init' });

		socket.on('start', function (data) {
			interval_send = setInterval(function() {
				io.emit('result', { cool: 'client zlo' });
				console.log('server zlo');
			}, 600);
		});

		socket.on('stop', function (data) {
			clearInterval(interval_send);
		});

		socket.on('clear', function (data) {
			io.emit('clear_all', { hello: 'hello socket!' });
		});

		socket.on('reload', function (data) {
			io.emit('push_reload', { hello: 'hello socket!' });
		});
	}


  return module;
}