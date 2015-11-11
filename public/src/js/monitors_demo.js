$(document).ready(function() {

	var slides = [
	    "<div class='flip_item'>new slide 1</div>",
	    "<div class='flip_item'>new slide 2</div>",
	    "<div class='flip_item'>new slide 3</div>"
	];

	var slider_opts = {
			speed: 600,
			manualSpeed: 600,
			fx: 'scrollHorz',   //flipHorz, scrollHorz
			timeout: 2000,
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

	$('.update').on('click', function() {
		var $flips = slides.map(function(slide) {
			return $(slide).addClass('new');
		});

		$('.flip_block').children('.flip_item').addClass('old').end()
										.cycle('add', $flips).on('cycle-after', removeOld);
	});
});