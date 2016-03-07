var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');


module.exports.preview = function(req, res) {
	var file = req.file;
	var newPath = '/preview/' + Date.now() + '.jpg';

	gm(file.path).size({bufferStream: true}, function(err, size) {
		if (err) return callback(err);
		this.resize(size.width > 1620 ? 1620 : false, false);
		this.write(__app_root + '/public' + newPath, function (err) {

			del(file.path, function() {
				res.send(newPath);
			});
		});
	});
};