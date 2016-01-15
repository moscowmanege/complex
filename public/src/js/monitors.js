$(document).ready(function() {

	var socket = null;

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
	};

	$('.flip_block').cycle(slider_opts);


	// Slides Block


	$('.play').on('click', function() {
		$('.flip_block').cycle('resume');
	});

	$('.pause').on('click', function() {
		$('.flip_block').cycle('pause');
	});

	$('.back').on('click', function() {
		$('.flip_block').cycle('prev');
	});

	$('.next').on('click', function() {
		$('.flip_block').cycle('next');
	});


	// Panel Block

	$('.hide').on('click', function() {
		$('.monitor_panel').toggleClass('hide');
	});

	$(document).on('keyup', function(event) {
		if (event.altKey && event.which == 70) {
			$('.monitor_panel').toggleClass('hide');
		}
	});


	// Connect Block


	$('.update').on('click', function() {
		socket.emit('update', { status: 'update' });
	});


	$('.reload').on('click', function() {
		socket.emit('reload', { my: 'data' });
	});


	$('.connect').on('click', function() {
		if (socket) {
			socket.disconnect();
			$('.flip_block').cycle('destroy').empty().cycle(slider_opts);
			socket = null;
		}

		socket = io.connect('', {
			port: 3002,
			forceNew: true,
			query: {
				area: $('.area_select').val()
			}
		});


		socket.on('events', function (data) {
			var $flips = null;

			if (data.status == 'update') {
				$flips = $(data.events).addClass('new');
			} else {
				$flips = $(data.events);
			}

			$('.flip_block').children('.flip_item').addClass('old').end()
											.cycle('add', $flips).on('cycle-after', removeOld);

			$('.event_block.exhibition').last().addClass('last');
		});

		socket.on('push_reload', function (data) {
			location.reload();
		});
	});


	// Slider Block


	var removeOld = function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
		if ($(incomingSlideEl).hasClass('new')) {
			$('.flip_block').cycle('destroy')
											.children('.old').remove().end()
											.children('.new').removeClass('new').end()
											.cycle(slider_opts)
											.off('cycle-after');
		}
	};


	// Time block


	var time = function() {
		var date = new Date();
		var days = ['ВОСКРЕСЕНЬЕ','ПОНЕДЕЛЬНИК','ВТОРНИК','СРЕДА','ЧЕТВЕРГ','ПЯТНИЦА','СУББОТА']
		var months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

		var day = days[date.getDay()]
		var hours = ('0' + date.getHours()).slice(-2);
		var min = ('0' + date.getMinutes()).slice(-2);

		$('.date').text(day + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' +date.getFullYear())
		$('.hours').text(hours);
		$('.minutes').text(min);
		$('.time_sep').toggleClass('tick');
	}

	var _timer = setInterval(time, 1000);

});