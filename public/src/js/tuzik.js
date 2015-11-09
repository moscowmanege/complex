$(document).ready(function() {
	$('.tuzik.open').on('click', function() {
		$(this).toggleClass('selected');
		$('.tuzik_form').toggleClass('hidden');
	});

	$('.tuzik_add').on('click', function() {
		var link = {};
		link.ru = $('.tuzik_input.rus').val();
		link.en = $('.tuzik_input.eng').val();

		$(this).off();
		$('.tuzik_desc').text(' -- Ждем...')
		$.post('/events/tuzik', {link: link}).done(function(data) {
			document.location.reload();
		});
	});
});