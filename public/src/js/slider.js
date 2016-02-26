function Slider() {
	var self = this;
	var _flip = null;

	var $outer = $('.flip_outer');
	var $area = $('.flip_area').first();
	var $lang = $area.find('.flip_lang').first();
	var $blocks = $lang.find('.flip_events');

	var outer_width = $outer.width();


	var afterFlip = function($area) {
		if ($area.hasClass('new')) {
			$('.old').remove();
			$('.new').removeClass('new');
			if ($('.flip_area').length < 2) {
				$('.flip_area').clone().appendTo('.flip_inner');
			}
		}
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
				$('.flip_area:first').insertAfter('.flip_area:last').promise().done(function() {
					$area = $('.flip_area').first();
					$lang = $area.find('.flip_lang').first();
					$blocks = $lang.find('.flip_events');

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
			$blocks = $lang.find('.flip_events');

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
		$outer = $('.flip_outer');
		$area = $('.flip_area').first();
		$lang = $area.find('.flip_lang').first();
		$blocks = $lang.find('.flip_events');
	};

}