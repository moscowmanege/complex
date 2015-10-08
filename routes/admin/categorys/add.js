var shortid = require('shortid');

var Category = require(__app_root + '/models/main.js').Category;


exports.index = function(req, res) {
  res.render('auth/categorys/add.jade');
}


exports.form = function(req, res) {
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
    res.redirect('/auth/categorys');
  });
}