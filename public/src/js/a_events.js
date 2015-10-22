function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

$(document).ready(function() {

	$(document).on('click', '.members_list > .forward', function() {
		var $current = $(this).parent('.snake_outer').children('.snake');

		$current.each(function(index, el) {
			$(this).find('select, .input').each(function() {
				var name = $(this).attr('name');
				name = setCharAt(name, 8, index);

				$(this).attr('name', name);
			});
		});
	});


	$('.hall').hide().eq(0).show().children('select').attr('disabled', false);

	$('.area').change(function() {
		var index = $(this).children('option:selected').index();

	  $('.hall')
	  	.hide().eq(index).show().end()
	 		.children('select').attr('disabled', true).eq(index).attr('disabled', false);
	}).trigger('change');




});