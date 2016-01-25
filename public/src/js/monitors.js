$(document).ready(function() {


	// Slider blocks


	var socket = null;

	function Slider() {
		var self = this;
		var _flip = null;

		var $outer = $('.flip_outer');
		var $area = $('.flip_area').first();
		var $lang = $area.find('.flip_lang').first();
		var $blocks = $lang.find('.flip_events');

		var outerWidth = $outer.width();


		this.flipNext = function() {

			var blocksScroll = $blocks.scrollLeft();
			var blocksScrollWidth = $blocks[0].scrollWidth - outerWidth;

			var areaScroll = $area.scrollLeft();
			var areaScrollWidth = $area[0].scrollWidth - outerWidth;

			var outerScroll = $outer.scrollLeft();

			if (areaScroll >= areaScrollWidth && blocksScroll >= blocksScrollWidth) {
				$outer.stop(false, true).animate({
					'scrollLeft': '+=' + outerWidth
				}, 600, function() {
					$('.flip_area:first').insertAfter('.flip_area:last').promise().done(function() {
						$area = $('.flip_area').first();
						$lang = $area.find('.flip_lang').first();
						$blocks = $lang.find('.flip_events');

						$outer.scrollLeft(outerScroll - outerWidth);
					});
				});

				return false;
			}

			if (blocksScroll >= blocksScrollWidth) {
				$area.stop(false, true).animate({
					'scrollLeft': '+=' + outerWidth
				}, 600);

				$lang = $lang.next();
				$blocks = $lang.find('.flip_events');

				return false;
			}

			$blocks.stop(false, true).animate({
				'scrollLeft': '+=' + outerWidth
			}, 600);
		};


		this.flipBack = function() {

			var blocksScroll = $blocks.scrollLeft();
			var blocksScrollWidth = $blocks[0].scrollWidth - outerWidth;

			var areaScroll = $area.scrollLeft();
			var areaScrollWidth = $area[0].scrollWidth - outerWidth;

			var outerScroll = $outer.scrollLeft();

			if (outerScroll === 0 && areaScroll === 0 && blocksScroll === 0) {
				$('.flip_area:last').insertBefore('.flip_area:first').promise().done(function() {
					$area = $('.flip_area').first();
					$lang = $area.find('.flip_lang').last();
					$blocks = $lang.find('.flip_events');

					$area.scrollLeft(areaScrollWidth);
					$blocks.scrollLeft(blocksScrollWidth);
					$outer.scrollLeft(outerScroll + outerWidth);
				});
			}

			if (areaScroll === 0 && blocksScroll === 0) {
				$outer.stop(false, true).animate({
					'scrollLeft': '-=' + outerWidth
				}, 600);

				return false;
			}

			if (blocksScroll === 0) {
				$area.stop(false, true).animate({
					'scrollLeft': '-=' + outerWidth
				}, 600);

				$lang = $lang.prev();
				$blocks = $lang.find('.flip_events');

				return false;
			}

			$blocks.stop(false, true).animate({
				'scrollLeft': '-=' + outerWidth
			}, 600);
		};


		this.play = function(interval) {
			return function() {
				clearInterval(self._flip);
				self._flip = setInterval(self.flipNext, interval);
			};
		};


		this.pause = function() {
			clearInterval(self._flip);
		};

	};

	var slider = new Slider();


	// Slides Block


	$('.play').on('click', slider.play(2000));
	$('.pause').on('click', slider.pause);
	$('.next').on('click', slider.flipNext);
	$('.back').on('click', slider.flipBack);


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

			console.log($flips)

			$('.flip_inner').children('.flip_area').addClass('old').end().append($flips)
		});

		socket.on('push_reload', function (data) {
			location.reload();
		});
	});


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