var Category = require(__app_root + '/models/main.js').Category;


exports.index = function(req, res) {
  Category.find().sort('-date').exec(function(err, categorys) {
    res.render('auth/categorys/', {categorys: categorys});
  });
}