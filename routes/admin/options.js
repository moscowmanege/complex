var gm = require('gm').subClass({ imageMagick: true });
var mime = require('mime');
var del = require('del');


module.exports.preview = function(req, res) {
	var file = req.file;
	var newPath = '/preview/' + Date.now() + '.' + mime.extension(file.mimetype);

	gm(file.path).resize(1200, false).quality(80).write(__app_root + '/public' + newPath, function() {
		del(file.path, function() {
			res.send(newPath);
		});
	});
}