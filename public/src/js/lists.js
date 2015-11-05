$(document).ready(function() {
		$('.sub_search').focus();

		$(document)
			.on('keyup', function(event) {
				if (event.altKey && event.which == 70) {
					$('.sub_search').focus();
				} else if (event.which == 27) {
					if ($('.sub_search').val() == '') {
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
			$.post(event.data.path, {'id': id}).done(function() {
				location.reload();
			});
		}
	}

	$('.rm_user').on('click', {path:'/auth/users/remove', description: 'Удалить пользователя?'}, remove);
	$('.rm_category').on('click', {path:'/auth/categorys/remove', description: 'Удалить категорию?'}, remove);
	$('.rm_other').on('click', {path:'/auth/other/remove', description: 'Удалить материал?'}, remove);
	$('.rm_lecture').on('click', {path:'/auth/lecture/remove', description: 'Удалить материал?'}, remove);
	$('.rm_theme').on('click', {path:'/auth/themes/remove/main', description: 'Удалить тему? \n - Все подтемы \n - Все материалы'}, remove);
	$('.rm_theme_sub').on('click', {path:'/auth/themes/remove/sub', description: 'Удалить подтему? \n - Все материалы'}, remove);

});