function setCharAt(str,index,chr) {
		if(index > str.length-1) return str;
		return str.substr(0,index) + chr + str.substr(index+1);
}

$(document).ready(function() {

	// Members

	var checkRoles = function() {
		$('.role').each(function(index, el) {
			if ($(this).children().length == 0) {
				$(this).hide();
			} else {
				$(this).show();
			}
		});
	}
	checkRoles();

	$(document).on('keyup change', '.members_search', function(event) {
		var value = $(this).val();
		var $elems = $('.members_list').children('.member');

		$elems.each(function(index, el) {
			var el_val = $(el).html().toLowerCase();

			el_val.search(value.toLowerCase()) != -1
				? $(el).show()
				: $(el).hide();
		});
	});

	$('.add_member').on('click', function() {
		$('.members_select').toggleClass('hidden');
		$('.role_select').trigger('change');
	});

	$(document).on('click', '.rm_member', function() {
		$(this).parent().remove();
		checkRoles();
	});

	$('.role_select').on('change', function() {
		var role = $('.role_select').children('option:selected').val();

		$.post('/members', {role: role}).done(function(members) {
			$('.members_list').empty();
			members.forEach(function(member, i) {
				var $member = $('<div/>', {'class':'member', 'id': member._id, 'text': member.name[0].value});
				$('.members_list').append($member);
			});
		});
	});

	$(document).on('click', '.members_list > .member', function() {
			var role = $('.role_select').children('option:selected').val();
			var id = $(this).attr('id');

			var $member_remove = $('<input>', {type:'button', value:'-', 'class': 'rm_member'});
			var $member_form = $('<input>', {type: 'hidden', name:'members[' + role +']', value: id});
			$(this).clone().appendTo('.' + role).prepend($member_remove).append($member_form);
			checkRoles();
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