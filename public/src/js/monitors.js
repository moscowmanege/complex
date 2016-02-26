$(document).ready(function() {

	var socket = null;


	// Slides Block


	var slider = new Slider();

	$('.play').on('click', slider.play(2000));
	$('.pause').on('click', slider.pause);
	$('.next').on('click', slider.flipNext);
	$('.back').on('click', slider.flipBack);


	// Panel Block


	$('.hide').on('click', function() {
		$('.monitor_panel').toggleClass('hide');
	});

	$(document).on('keyup', function(event) {
		// if (event.altKey && event.which == 70) {
		if (event.which == 27) {
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
			$('.flip_inner').empty();
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
				$flips = $(data.areas).addClass('new');
			} else {
				$flips = $(data.areas);
			}


			$('.flip_inner').children('.flip_area').removeClass('new').addClass('old').end().append($flips);

			if ($('.flip_area').length < 2) {
				$('.flip_area').clone().appendTo('.flip_inner');
			}

			slider.reinit();
		});

		socket.on('push_reload', function (data) {
			location.reload();
		});
	});


	// Time block


	var time = function() {
		var date = new Date();
		var days = ['ВОСКРЕСЕНЬЕ','ПОНЕДЕЛЬНИК','ВТОРНИК','СРЕДА','ЧЕТВЕРГ','ПЯТНИЦА','СУББОТА'];
		var months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

		var day = days[date.getDay()];
		var hours = ('0' + date.getHours()).slice(-2);
		var min = ('0' + date.getMinutes()).slice(-2);

		$('.date').text(day + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' +date.getFullYear());
		$('.hours').text(hours);
		$('.minutes').text(min);
		$('.time_sep').toggleClass('tick');
	};

	var _timer = setInterval(time, 1000);

});