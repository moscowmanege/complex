module.exports = function(Model, Params) {
  var Area = Model.Area;
  var checkNested = Params.checkNested;
  var module = {};


  module.index = function(req, res) {
    res.render('admin/areas/add.jade');
  }

  module.form = function(req, res) {
    var post = req.body;

    var area = new Area();

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && area.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && area.setPropertyLocalised('description', post[locale].description, locale);

      checkNested(post, [locale, 'adress'])
        && area.setPropertyLocalised('adress', post[locale].adress, locale);

    });

    area.save(function(err, area) {
      res.redirect('/areas');
    });
  }


  return module;
}