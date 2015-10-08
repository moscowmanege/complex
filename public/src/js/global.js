$(document).ready(function() {
	var search = {
		val: '', buf: '',
		checkResult: function() {
			if (this.buf != this.val) {
				this.buf = this.val;
				this.getResult.call(search, this.val);
			}
		},
		getResult: function (result) {
			$.post('/search', {search: result}).done(function(data) {
				$('.search_input').val() === ''
					? $('.search_results').find('.search_title').text('Что будем искать?')
					: $('.search_results').find('.search_title').text('Ничего не найдено');

				if (data.studys === '') {
					$('.search_results')
						.find('.search_title').show().end()
						.find('.column_main_block').empty().end()
						.find('.search_nav').hide();

					return false;
				}

				$('.search_results')
					.find('.search_title').hide().end()
					.find('.search_nav').show().end()
					.find('.column_main_block').empty().append(data.studys).end()
					.find('.social-likes').socialLikes().end()
					.find('.categorys_block').hide().empty();

				if (data.categorys.length > 0) {
					$('.search_results').find('.categorys_block').show();
					data.categorys.forEach(function(category) {
						var $category = $('<div/>', {'class': 'nav_item ' + category._id, 'text': category.title});
						$('.search_results').find('.categorys_block').append($category);
					});
				}
			});
		}
	};

	$('.search_input')
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

	$('.search_input').on('focusin', function(event) {
		$('.content_block').hide();
		$('.search_results').fadeIn(300);
		$('.search_input').addClass('focus');
	});

	$(document)
		.on('mouseup.search', function(event) {
			if (!/item_block|item_title|item_description|search_input|search_results|search_nav|nav_item|link|preview_block/.test(event.target.className)) {
				$('.content_block').fadeIn(300);
				$('.search_results').hide();
				$('.search_input').removeClass('focus');
			}
		})
		.on('mouseup.player touchend.player', function(event) {
			var container = $('.preview_video');

			if (!container.is(event.target)
					&& container.has(event.target).length === 0)
			{
					$('.preview_block').fadeOut(300).empty();
					$('.main_block').removeClass('preview');
					$('body').removeClass('stop_scroll');
			}
		})
		.on('keyup.hotkeys', function(event) {
			if (event.shiftKey && event.which == 70) {
				if (!$('input, textarea, [contenteditable]').is(':focus')) {
					$('.search_input').focus();
				}
			} else if (event.which == 27) {
				$('.search_input').blur();
				$(this).trigger('mouseup.search');
			}
		})
		.on('mousemove', '.link.pdf', function(event) {
			var x = (event.clientX + 20),
					y = (event.clientY + 20);

			$(this).children('.tooltip').css({top: y, left: x});
		})
		.on('click', '.link', function() {
			if ($(this).hasClass('video')) {
				var id = $(this).attr('video_id');
				var url = 'https://www.youtube.com/embed/' + id;
				var video = $('<iframe>', {'class': 'preview_video', 'width':'720px', 'height': '400px', 'frameborder': 0, 'allowfullscreen': true, 'src': url});

				$('.preview_block').empty().append(video).promise().done(function() {
					$('.main_block').addClass('preview');
					$('.preview_block').delay(100).fadeIn(300);
				});
				$('body').addClass('stop_scroll');
			}

			if ($(this).hasClass('pdf')) {
				var path = $(this).attr('file_path');
				window.open(path, '_blank');
			}
		})
		.on('click', '.search_nav .nav_item', function() {
			var type = $(this).attr('class').split(' ')[1];
			$('.search_nav .nav_item').removeClass('current');
			$(this).addClass('current');
			type == 'all'
				? $('.column_main_block').children('.search_item').show()
				: $('.column_main_block').children('.search_item').show().not('.' + type).hide();
		});
});