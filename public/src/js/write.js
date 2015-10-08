var validate = {
	email: 	function (email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
};

$(document).ready(function() {
	$('.plane_block').on('click', function() {
		var email = $('.email').val();
		if (validate.email(email)) {
			$('form').submit();
		} else {
			$('.email_form svg').find('line').css('stroke', 'red');
		}
	});
});