$(document).ready(function() {
	var socket = io.connect('http://192.168.1.5:3002');


	$('.start').on('click', function() {
		socket.emit('start', { my: 'data' });
	});

	$('.stop').on('click', function() {
		socket.emit('stop', { my: 'data' });
	});

	$('.clear').on('click', function() {
		socket.emit('clear', { my: 'data' });
	});

	$('.reload').on('click', function() {
		socket.emit('reload', { my: 'data' });
	});



	socket.on('news', function (data) {
		$('.res').text('Socket status: ' + data.status);
	});

	socket.on('result', function (data) {
		$('.res').append('<br/>').append(data.cool);
	});

	socket.on('clear_all', function (data) {
		$('.res').empty();
	});

	socket.on('push_reload', function (data) {
		location.reload();
	});
});