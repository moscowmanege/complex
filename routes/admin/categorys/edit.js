module.exports = function(Category) {
  var module = {};


  module.index = function(req, res) {
    var id = req.params.id;

    Category.findById(id).exec(function(err, category) {
      res.render('auth/categorys/edit.jade', {category: category});
    });
  }


  module.form = function(req, res) {
    var post = req.body;
    var id = req.params.id;

    Category.findById(id).exec(function(err, category) {

      category.status = post.status;

      var locales = post.en ? ['ru', 'en'] : ['ru'];

      locales.forEach(function(locale) {
        checkNested(post, [locale, 'title'])
          && category.setPropertyLocalised('title', post[locale].title, locale);

        checkNested(post, [locale, 'description'])
          && category.setPropertyLocalised('description', post[locale].description, locale);

      });

      category.save(function(err, category) {
        res.redirect('/auth/categorys');
      });
    });
  }


  return module;
};