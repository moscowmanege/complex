$(function() {
	$('.tuzik.open').on('click', function() {
		$(this).toggleClass('selected');
		$('.tuzik_form').toggleClass('hidden');
		$('.list_item').toggle().filter('.tuzik_event').show();
	});

	$('.tuzik_add').on('click', function() {
		var link = {};
		link.ru = $('.tuzik_input.rus').val();
		link.en = $('.tuzik_input.eng').val();

		var url = /moscowmanege.ru/;
		var def_val = $('.tuzik_desc').html();

		if (link.ru === '' && link.en === '') {
			$('.tuzik_desc').text(' -- Может укажешь адрес?');
			setTimeout(function() {
				$('.tuzik_desc').empty().append(def_val);
			}, 2000);
			return false;
		} else if (link.ru && !url.test(link.ru) || link.en && !url.test(link.en)) {
			$('.tuzik_desc').text(' -- Ты не обманешь Тузика! Тузик понимает только ссылки: http://moscowmanege.ru');
			setTimeout(function() {
				$('.tuzik_desc').empty().append(def_val);
			}, 4000);
			return false;
		} else {
			$(this).prop('disabled', true).off();
			$('.tuzik_desc').text(' -- Тузик думает...');
			$.post('/events/tuzik', {link: link}).done(function(data) {
				document.location.reload();
			});
		}
	});
});