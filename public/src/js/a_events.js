function setCharAt(str,index,chr) {
		if(index > str.length-1) return str;
		return str.substr(0,index) + chr + str.substr(index+1);
}

$(document).ready(function() {

	// Members

	$('.add_member').on('click', function() {
		$('.members_select').toggleClass('hidden');
		$('.role_select').trigger('change');
	});

	$(document).on('click', '.rm_member', function() {
		$(this).parent().remove();
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

	$('.arrow_cal').click(function(event) {
		console.log('arrow');
	});

});