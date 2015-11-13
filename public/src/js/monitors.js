$(document).ready(function() {
	// var socket = io.connect('http://192.168.1.5:3002');
	var socket = io.connect('', {port: 3002});


	// Control Block

	$('.start').on('click', function() {
		var area = $('.area_select').val();
		socket.emit('start', { status: 'start', area: area });
	});

	$('.stop').on('click', function() {
		socket.emit('stop', { my: 'data' });
	});

	$('.update').on('click', function() {
		var area = $('.area_select').val();
		socket.emit('update', { status: 'update', area: area });
	});

	$('.reload').on('click', function() {
		socket.emit('reload', { my: 'data' });
	});



	// Socket Block


	socket.on('news', function (data) {
		$('.status').text('Socket status: ' + data.status);
	});

	socket.on('events', function (data) {
		if (data.status == 'update')
			var $flips = $(data.events).addClass('new');
		else
			var $flips = $(data.events)

		$('.flip_block').children('.flip_item').addClass('old').end()
										.cycle('add', $flips).on('cycle-after', removeOld);
	});

	socket.on('push_reload', function (data) {
		location.reload();
	});



	// Slider Block


	var slider_opts = {
			speed: 600,
			manualSpeed: 600,
			fx: 'scrollHorz',   //flipHorz, scrollHorz
			timeout: 4000,
			// paused: true,
			autoHeight: false,
			manualTrump: false,
			slides: '> .flip_item',
			log: false
	}


	var removeOld = function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
		if ($(incomingSlideEl).hasClass('new')) {
			$('.flip_block').cycle('destroy')
											.children('.old').remove().end()
											.children('.new').removeClass('new').end()
											.cycle(slider_opts)
											.off('cycle-after');
		};
	}

	$('.flip_block').cycle(slider_opts);


});