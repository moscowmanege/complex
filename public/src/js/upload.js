$(document).ready(function() {
	$('.images_upload_preview').sortable({
		placeholder: 'placeholder',
		cancel: '.image_description, .image_delete',
		sort: function(e) {
			$('.image_description').removeClass('show');
		}
	});

	$(document).on('mouseup', function(event) {
		if (!/image_description|toggle_eng/.test(event.target.className)) {
			$('.image_description').removeClass('show');
		}
	});

	$(document).on('click', '.image_upload_preview', function() {
		$('.image_description').removeClass('show');
		$(this).children('.image_description').addClass('show');
		return false;
	});

	$(document).on('click', '.image_upload_preview > .image_delete', function(event) {
		$(this).parent('.image_upload_preview').remove();
	});

	$('.images_upload_preview').filedrop({
		url: '/preview',
		paramname: 'image',
		fallback_id: 'upload_fallback',
		allowedfiletypes: ['image/jpeg','image/png','image/gif'],
		allowedfileextensions: ['.jpg','.jpeg','.png','.gif'],
		maxfiles: 5,
		maxfilesize: 12,
		dragOver: function() {
			$(this).css('outline', '2px solid red');
		},
		dragLeave: function() {
			$(this).css('outline', 'none');
		},
		uploadStarted: function(i, file, len) {

		},
		uploadFinished: function(i, file, response, time) {
			var image = $('<div />', {'class': 'image_upload_preview', 'style': 'background-image:url(' + response + ')'});
			var image_delete = $('<div />', {'class': 'image_delete', 'text': 'удалить'});
			var image_description = $('<div />', {'class': 'image_description'});
			var desc_ru = $('<textarea />', {'class': 'image_description_input ru_img', 'name': 'images[description][ru][]', 'placeholder':'Описание'});
			var desc_en = $('<textarea />', {'class': 'image_description_input en_img', 'name': 'images[description][en][]', 'disabled':'disabled', 'placeholder':'Description'});
			var image_form = $('<input />', {'class': 'image_form', 'type': 'hidden', 'name': 'images[path][]', 'value': response});
			$('.images_upload_preview').append(image.append(image_delete, image_form, image_description.append(desc_ru, desc_en)));
		},
		progressUpdated: function(i, file, progress) {

		},
		afterAll: function() {
			$('.images_upload_preview').css('outline', 'none');
		}
	});

});