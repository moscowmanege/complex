var parseYouTubeId = function(url) {
	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[2].length == 11) {
		return match[2];
	} else {
	  return '';
	}
};

$(document).ready(function() {
	$('form').on('submit', function(event) {
		var video = $('input.video').val();

		$('input.video').val(parseYouTubeId(video));

		return true;
	});

	function snakeForward () {
		var $snake = $(this).parent('.snake_outer').children('.snake');
		$snake.first().clone()
			.find('option').prop('selected', false).end()
			.find('.input').val('').end()
			.insertAfter($snake.last());
	}

	function snakeBack () {
		var $snake = $(this).closest('.snake_outer').children('.snake');
		if ($snake.size() == 1) return null;
		$(this).parent('.snake').remove();
	}

	$(document).on('click', '.back', snakeBack);
	$('.forward').on('click', snakeForward);
});