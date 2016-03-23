function Slider() {
	var self = this;
	var _flip = null;
	var $slides = null;

	var $outer = $('.slider_block');
	var $area = $('.slide_item').first();
	var $lang = $area.find('.slide_inner').first();
	var $blocks = $lang.find('.inner_events');

	var outer_width = $outer.width();


	var afterFlip = function($area) {
		if ($slides) {
			$('.slider_block').children('.slide_item').removeClass('new').addClass('old').end().append($slides);
			$slides = null;
		};

		if ($area.hasClass('new')) {
			$('.old').remove();
			$('.new').removeClass('new');

			if ($('.slide_item').length < 2) {
				$('.slide_item').clone().appendTo('.slider_block');
			}

			self.reinit();
		}
	};

	this.pushSlides = function(areas) {
		$slides = $(areas).addClass('new');
	};


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
				$('.slide_item:first').insertAfter('.slide_item:last').promise().done(function() {
					$area = $('.slide_item').first();
					$lang = $area.find('.slide_inner').first();
					$blocks = $lang.find('.inner_events');

					$outer.scrollLeft(outer_scroll - outer_width);

					afterFlip.call(null, $area);
				});
			});

			return false;
		}

		if (blocks_scroll >= blocks_scroll_width) {
			$area.stop(false, true).animate({
				'scrollLeft': '+=' + outer_width
			}, 600);

			$lang = $lang.next();
			$blocks = $lang.find('.inner_events');

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
			$('.slide_item:last').insertBefore('.slide_item:first').promise().done(function() {
				$area = $('.slide_item').first();
				$lang = $area.find('.slide_inner').last();
				$blocks = $lang.find('.inner_events');

				$area.scrollLeft(area_scroll_width);
				$blocks.scrollLeft(blocks_scroll_width);
				$outer.scrollLeft(outer_scroll + outer_width);

				afterFlip.call(null, $area);
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
			$blocks = $lang.find('.inner_events');

			return false;
		}

		$blocks.stop(false, true).animate({
			'scrollLeft': '-=' + outer_width
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

	this.reinit = function() {
		$outer = $('.slider_block');
		$area = $('.slide_item').first();
		$lang = $area.find('.slide_inner').first();
		$blocks = $lang.find('.inner_events');
	};

}