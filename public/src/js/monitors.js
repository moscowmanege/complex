$(document).ready(function() {


	// Slider blocks


	var socket = null;
	var slider = null;

	function Slider() {
		var self = this;
		var _flip = null;

		var $outer = $('.flip_outer');
		var $area = $('.flip_area').first();
		var $lang = $area.find('.flip_lang').first();
		var $blocks = $lang.find('.flip_events');

		var outer_width = $outer.width();


		this.flipNext = function() {

			var blocks_scroll = $blocks.scrollLeft();
			var blocks_scroll_width = $blocks[0].scrollWidth - outer_width;

			var area_scroll = $area.scrollLeft();
			var area_scroll_width = $area[0].scrollWidth - outer_width;

			var outer_scroll = $outer.scrollLeft();

			if (area_scroll >= area_scroll_width && blocks_scroll >= blocks_scroll_width) {
				$outer.stop(false, true).animate({
					'scrollLeft': '+=' + outer_width
				}, 600, function() {
					$('.flip_area:first').insertAfter('.flip_area:last').promise().done(function() {
						$area = $('.flip_area').first();
						$lang = $area.find('.flip_lang').first();
						$blocks = $lang.find('.flip_events');

						$outer.scrollLeft(outer_scroll - outer_width);

						self.clear.call(null, $area);
					});
				});

				return false;
			}

			if (blocks_scroll >= blocks_scroll_width) {
				$area.stop(false, true).animate({
					'scrollLeft': '+=' + outer_width
				}, 600);

				$lang = $lang.next();
				$blocks = $lang.find('.flip_events');

				return false;
			}

			$blocks.stop(false, true).animate({
				'scrollLeft': '+=' + outer_width
			}, 600);
		};


		this.flipBack = function() {

			var blocks_scroll = $blocks.scrollLeft();
			var blocks_scroll_width = $blocks[0].scrollWidth - outer_width;

			var area_scroll = $area.scrollLeft();
			var area_scroll_width = $area[0].scrollWidth - outer_width;

			var outer_scroll = $outer.scrollLeft();

			if (outer_scroll === 0 && area_scroll === 0 && blocks_scroll === 0) {
				$('.flip_area:last').insertBefore('.flip_area:first').promise().done(function() {
					$area = $('.flip_area').first();
					$lang = $area.find('.flip_lang').last();
					$blocks = $lang.find('.flip_events');

					$area.scrollLeft(area_scroll_width);
					$blocks.scrollLeft(blocks_scroll_width);
					$outer.scrollLeft(outer_scroll + outer_width);

					self.clear.call(null, $area);
				});
			}

			if (area_scroll === 0 && blocks_scroll === 0) {
				$outer.stop(false, true).animate({
					'scrollLeft': '-=' + outer_width
				}, 600);

				return false;
			}

			if (blocks_scroll === 0) {
				$area.stop(false, true).animate({
					'scrollLeft': '-=' + outer_width
				}, 600);

				$lang = $lang.prev();
				$blocks = $lang.find('.flip_events');

				return false;
			}

			$blocks.stop(false, true).animate({
				'scrollLeft': '-=' + outer_width
			}, 600);
		};


		this.clear = function($area) {
			if ($area.hasClass('new')) {
				$('.old').remove();
				$('.new').removeClass('new');
				if ($('.flip_area').length < 2) {
					$('.flip_area').clone().appendTo('.flip_inner');
				}
			}
		}


		this.play = function(interval) {
			return function() {
				clearInterval(self._flip);
				self._flip = setInterval(self.flipNext, interval);
			};
		};


		this.pause = function() {
			clearInterval(self._flip);
		};

		this.reinit = function() {
			$outer = $('.flip_outer');
			$area = $('.flip_area').first();
			$lang = $area.find('.flip_lang').first();
			$blocks = $lang.find('.flip_events');
		};

	}

	slider = new Slider();

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