$(document).ready(function() {
	$('.round_big').plaxify({'xRange': 140, 'yRange': 140, 'invert': true, 'useTransform': false});
	$('.rounds_group').plaxify({'xRange': 40, 'yRange': 0, 'invert': false, 'useTransform': false});
	$('.blocks_group').plaxify({'xRange': 40, 'yRange': 0, 'invert': true, 'useTransform': false});
	$.plax.enable();

	$('.round_small').on('click', function() {
		$(this).off().animate({
			top: '+=110px',
			left: '-=320px'
		}, 800, function() {
			$(this).hide();
		});
	});
});