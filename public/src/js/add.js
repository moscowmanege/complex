$(document).ready(function() {
	var eng = true;


// ------------------------
// *** Toggles Block ***
// ------------------------


	function toggleEnglish () {
		if (eng = !eng) {
			eng = true;
			$('.en').prop('disabled', eng).filter('input').hide();
			$('.en').parent('.wysiwyg-container').hide();
			$('.en_img').prop('disabled', eng).hide();
			$('.ru').css('float','none');
		}
		else {
			eng = false;
			$('.en').prop('disabled', eng).filter('input').show();
			$('.en').parent('.wysiwyg-container').show();
			$('.en_img').prop('disabled', eng).show();
			$('.ru').css('float','left');
		}
	}



// ------------------------
// *** Constructors Block ***
// ------------------------


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


	$('.toggle_eng').on('click', toggleEnglish);
	$(document).on('click', '.back', snakeBack);
	$('.forward').on('click', snakeForward);

});