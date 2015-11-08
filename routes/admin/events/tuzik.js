var jsdom = require('jsdom');
var fs = require('fs');


module.exports = function(Model) {
	var Event = Model.Event;
	var module = {};


	module.index = function(req, res) {
		var jquery = fs.readFileSync(__app_root + '/public/build/libs/js/jquery-2.1.4.min.js', 'utf-8');

		jsdom.env({
			url: req.body.link,
			src: [jquery],
			done: function(err, window) {
				var $ = window.$;

				var title = $('h1').text();
				var s_title = $('#subheader').text();
				var description = $('div[style*="margin-bottom:15px"]').next('div').html();

				description = description.replace(/<\s*(\w+).*?>/g, '<$1>');
				description = description.replace(/&nbsp;/g, '');
				description = description.replace(/<strong><\/strong\>/g, '');
				description = description.replace(/strong/g, 'b');
				res.send([title, s_title, description].join('\n'));
			}
		});

	}


	return module;
}