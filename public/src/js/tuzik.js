$(document).ready(function() {
	$('.tuzik.open').on('click', function() {
		$('.tuzik_form').toggleClass('hidden');
	});

	$('.tuzik_add').on('click', function() {
		var link = $('.tuzik_input').val();
		$.post('/events/tuzik', {link: link}).done(function(data) {
			console.log(data);
		});
	});
});