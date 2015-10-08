$(document).ready(function() {
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