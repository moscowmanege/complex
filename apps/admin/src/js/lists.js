$(document).ready(function() {
		$('.sub_search').focus();

		$(document)
			.on('keyup', function(event) {
				if (event.altKey && event.which == 70) {
					$('.sub_search').focus();
				} else if (event.which == 27) {
					if ($('.sub_search').val() === '') {
						$('.sub_search').blur();
					} else {
						$('.sub_search').val('').trigger('keyup');
					}
				}
			})
			.on('keyup change', '.sub_search', function(event) {
				var value = $(this).val();
				var $elems = $('.list_item').children('.item_title');

				$elems.each(function(index, el) {
					var el_val = $(el).html().toLowerCase();

					el_val.search(value.toLowerCase()) != -1
						? $(el).parent().show()
						: $(el).parent().hide();
				});
			});

		$('.toggle_rm').on('click', function() {
			$('.item_rm').toggleClass('show');
		});


	function remove (event) {
		var id  = $(this).attr('id');

		if (confirm(event.data.description)) {
			$.post(event.data.path, {'id': id}).done(function(data) {
				if (data == 'current_user') {
					document.location.pathname = '/auth/logout'
				} else {
					location.reload();
				}
			});
		}
	}

	$('.item_rm.user').on('click', {path:'/users/remove', description: 'Удалить пользователя?'}, remove);
	$('.item_rm.category').on('click', {path:'/categorys/remove', description: 'Удалить категорию?'}, remove);
	$('.item_rm.member').on('click', {path:'/members/remove', description: 'Удалить участника?'}, remove);
	$('.item_rm.partner').on('click', {path:'/partners/remove', description: 'Удалить партнера?'}, remove);
	$('.item_rm.event').on('click', {path:'/events/remove', description: 'Удалить событие?'}, remove);
	$('.item_rm.area').on('click', {path:'/areas/remove', description: 'Удалить площадку? \n - Все залы этой площадки \n - Все события на этой площадке'}, remove);
	$('.item_rm.hall').on('click', {path:'/halls/remove', description: 'Удалить зал? \n - Все события в этом зале'}, remove);

});