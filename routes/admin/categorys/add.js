var shortid = require('shortid');

module.exports = function(Model, Params) {
  var Category = Model.Category;
  var checkNested = Params.locale.checkNested;
  var module = {};


  module.index = function(req, res) {
    res.render('admin/categorys/add.jade');
  }


  module.form = function(req, res) {
    var post = req.body;

    var category = new Category();

    category._short_id = shortid.generate();
    category.status = post.status;

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && category.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && category.setPropertyLocalised('description', post[locale].description, locale);

    });

    category.save(function(err, category) {
      res.redirect('/categorys');
    });
  }


  return module;
}