module.exports = function(Model, Params) {
  var Subsidiary = Model.Subsidiary;
  var checkNested = Params.checkNested;
  var module = {};


  module.index = function(req, res) {
    res.render('admin/subsidiaries/add.jade');
  }

  module.form = function(req, res) {
    var post = req.body;

    var subsidiary = new Subsidiary();

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && subsidiary.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && subsidiary.setPropertyLocalised('description', post[locale].description, locale);

      checkNested(post, [locale, 'adress'])
        && subsidiary.setPropertyLocalised('adress', post[locale].adress, locale);

    });

    subsidiary.save(function(err, subsidiary) {
      res.redirect('/admin/subsidiaries');
    });
  }


  return module;
}