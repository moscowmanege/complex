$(function() {

	var context = { skip: 10, limit: 10 };

	$('.list_back').on('click', function() {
		context.skip = (context.skip - 10) <= 10 ? 0 : context.skip - 10;
		$.post('', {context: context}).done(function(data) {
			if (data == 'end') return false;

			context.skip = context.skip === 0 ? 10 : context.skip;
			$('.lists_block').empty().append(data);
		});
	});

	$('.list_next').on('click', function() {
		$.post('', {context: context}).done(function(data) {
			if (data == 'end') return false;

			context.skip = context.skip + 10;
			$('.lists_block').empty().append(data);
		});
	});

	$('.drop_item').on('click', function() {
		var $this = $(this);
		var item = $this.closest('.sub_drop').attr('class').split(' ')[1];
		context[item] = $this.attr('class').split(' ')[1];

		$this.parent('.drop_inner').children('.drop_item').removeClass('select').filter(this).addClass('select');

		context.skip = 0;
		$.post('', {context: context}).done(function(data) {
			if (data == 'end') {
				$('.lists_block').empty();
			} else {
				$('.lists_block').empty().append(data);
				context.skip = 10;
			}
		});
	});


	// -- Search


	var search = {
		val: '', buf: '',
		checkResult: function() {
			if (this.buf != this.val) {
				this.buf = this.val;
				this.getResult.call(search, this.val);
			}
		},
		getResult: function (result) {
			context.skip = 0;
			context['text'] = result;
			$.post('', { context: context }).done(function(data) {
				if (data == 'end') {
					$('.lists_block').empty();
				} else {
					$('.lists_block').empty().append(data);
					context.skip = 10;
				}
			});
		}
	};

	$('.sub_search')
		.on('keyup change', function(event) {
			search.val = $(this).val();
		})
		.on('focusin', function(event) {
			search.interval = setInterval(function() {
				search.checkResult.call(search);
			}, 1000);
		})
		.on('focusout', function(event) {
			clearInterval(search.interval);
		});


	// -- Search local


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
		.on('keyup change', '.sub_search.local', function(event) {
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


	// -- Remove


	function remove (event) {
		var id  = $(this).attr('id');

		if (confirm(event.data.description)) {
			$.post(event.data.path, {'id': id}).done(function(data) {
				if (data == 'current_user') {
					document.location.pathname = '/auth/logout';
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
	$('.item_rm.event').on('click', {path:'/events/remove', description: 'Удалить событие? \n + Все связанные билеты \n + Все связанные пустые комплексные билеты'}, remove);
	$('.item_rm.area').on('click', {path:'/areas/remove', description: 'Удалить площадку? \n + Все залы этой площадки'}, remove);
	$('.item_rm.hall').on('click', {path: location.pathname + '/remove', description: 'Удалить зал?'}, remove);
	$('.item_rm.ticket').on('click', {path: location.pathname + '/remove', description: 'Удалить билет?'}, remove);

});