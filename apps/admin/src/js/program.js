$(function() {
	$('.program_push.open').on('click', function() {
		$(this).toggleClass('selected');
		$('.program_push_form').toggleClass('hidden');
	});

	$('.program_push_add').on('click', function() {
		var event_move = $('.push_events').val();

		$.post('', { status: 'push', event_move: event_move }).done(function(data) {
			document.location.reload();
		});
	});

	$('.toggle_pull').on('click', function() {
		$('.item_pull').toggleClass('show');
	});

	$('.item_pull').on('click', function() {
		var event_move = $(this).attr('id');

		$.post('', { status: 'pull', event_move: event_move }).done(function(data) {
			document.location.reload();
		});
	});
});