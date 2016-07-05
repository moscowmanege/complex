$(function() {

	$('.sortable').sortable({cursor: 'move'});

	$('.date').pickmeup({
		format: 'Y-m-d',
		hide_on_select: true,
		mode: 'single',
		locale: {
			days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
			daysShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.'],
			daysMin: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.'],
			months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			monthsShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июн.', 'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Нояб.', 'Дек.']
		}
	});

	// Persons

	var checkTags = function() {
		$('.tag').each(function(index, el) {
			if ($(this).children().length === 0) {
				$(this).hide();
			} else {
				$(this).show();
			}
		});
	};
	checkTags();

	$(document).on('keyup change', '.persons_search', function(event) {
		var value = $(this).val();
		var $elems = $(this).parent('.persons_select').children('.persons_list').children('.person');

		$elems.each(function(index, el) {
			var el_val = $(el).html().toLowerCase();

			el_val.search(value.toLowerCase()) != -1
				? $(el).show()
				: $(el).hide();
		});
	});

	$(document).on('mouseup', function(event) {
		if (!/persons_list|add_person|person|tag_select|persons_search/.test(event.target.className)) {
			$('.persons_select').addClass('hidden');
		}
	});

	$('.add_person').on('click', function() {
		$(this).next('.persons_select').toggleClass('hidden');
		$('.tag_select').trigger('change');
	});

	$(document).on('click', '.rm_person', function() {
		$(this).parent().remove();
		checkTags();
	});

	$('.tag_select').on('change', function() {
		var tag = $(this).children('option:selected').val();
		var type = $(this).attr('class').split(' ')[1];
		var field;

		if (type == 'members') {
			field = 'name';
		} else if (type == 'partners') {
			field = 'title';
		}

		$.post('/' + type + '/tags_select', {tag: tag}).done(function(persons) {
			$('.persons_list.' + type).empty();
			persons.forEach(function(person, i) {
				var $person = $('<div/>', {'class':'person', 'id': person._id, 'text': person[field][0].value});
				$('.persons_list.' + type).append($person);
			});
		});
	});

	$(document).on('click', '.persons_list > .person', function() {
			var tag = $(this).closest('.persons_select').children('.tag_select').children('option:selected').val();
			var id = $(this).attr('id');
			var type = $(this).parent('.persons_list').attr('class').split(' ')[1];

			var $person_remove = $('<input>', {type:'button', value:'-', 'class': 'rm_person'});
			var $person_form = $('<input>', {type: 'hidden', name: type + '[' + tag +']', value: id});
			$(this).clone().appendTo('.' + tag).prepend($person_remove).append($person_form);
			checkTags();
	});

	// Halls

	$('.hall').hide().eq(0).show().children('input').attr('disabled', false);

	$('.area').change(function() {
		var index = $(this).children('option:selected').index();

		$('.hall').hide().eq(index).show();
		$('.hall').children('input').attr('disabled', true);
		$('.hall').eq(index).children('input').attr('disabled', false);
	}).trigger('change');

	// Interval

	$('.arrow_cal').on('click', function(event) {
		var date = $('.begin').children('.date').val();
		var hours = $('.begin').children('.hours').children('option:selected').index();
		var minutes = $('.begin').children('.minutes').children('option:selected').index();

		$('.end').children('.date').val(date);
		$('.end').children('.hours').children('option').eq(hours).prop('selected', true);
		$('.end').children('.minutes').children('option').eq(minutes).prop('selected', true);
	});

});