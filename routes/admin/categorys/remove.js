var Category = require(__app_root + '/models/main.js').Category;

exports.index = function(req, res) {
  var id = req.body.id;

  Category.findByIdAndRemove(id, function(err, category) {
    res.send('ok');
  });
}