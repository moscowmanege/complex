$(function() {

	var context = { skip: 10, limit: 10 };

	$(document)
		.on('click', '.list_back', function() {
			var $list = $('.list_select');

			$list[0].selectedIndex = $list.children('option:selected').val() != 0
				? $list.children('option:selected').prev().val()
				: $list.children('option').last().val();
			$list.trigger('change');
		})

		.on('click', '.list_next', function() {
			var $list = $('.list_select');

			$list[0].selectedIndex = $list.children('option:selected').next().val();
			$list.trigger('change');
		})

		.on('change', '.list_select', function(event) {
			context.skip = $('.list_select option:selected').val() * 10;

			$.post('', {context: context}).done(function(data) {
				if (data == 'end') return false;
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


	// -- Keys


	$(document).on('keyup', function(event) {
		if (event.altKey && event.which == 70) {
			$('.sub_search').focus();
		} else if (event.which == 27) {
			$('.sub_search').val() === ''
				? $('.sub_search').blur()
				: $('.sub_search').val('').trigger('keyup');
		} else if (event.which == 39) {
			$('.list_next').trigger('click');
		} else if (event.which == 37) {
			$('.list_back').trigger('click');
		}
	});


	// -- Search text


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
			context.text = result;

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


	$(document).on('keyup change', '.sub_search.local', function(event) {
		var value = $(this).val();
		var $elems = $('.list_item').children('.item_title');

		$elems.each(function(index, el) {
			var el_val = $(el).html().toLowerCase();

			el_val.search(value.toLowerCase()) != -1
				? $(el).parent().show()
				: $(el).parent().hide();
		});
	});


	// -- Remove


	$('.toggle_rm').on('click', function() {
		$('.item_rm').toggleClass('show');
	});


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

	$(document)
		.on('click', '.item_rm.user', {path:'/users/remove', description: 'Удалить пользователя?'}, remove)
		.on('click', '.item_rm.category', {path:'/categorys/remove', description: 'Удалить категорию?'}, remove)
		.on('click', '.item_rm.member', {path:'/members/remove', description: 'Удалить участника?'}, remove)
		.on('click', '.item_rm.partner', {path:'/partners/remove', description: 'Удалить партнера?'}, remove)
		.on('click', '.item_rm.event', {path:'/events/remove', description: 'Удалить событие? \n + Все связанные билеты \n + Все связанные пустые комплексные билеты'}, remove)
		.on('click', '.item_rm.area', {path:'/areas/remove', description: 'Удалить площадку? \n + Все залы этой площадки'}, remove)
		.on('click', '.item_rm.hall', {path: location.pathname + '/remove', description: 'Удалить зал?'}, remove)
		.on('click', '.item_rm.ticket', {path: location.pathname + '/remove', description: 'Удалить билет?'}, remove);

});