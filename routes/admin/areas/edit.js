module.exports = function(Model, Params) {
  var Area = Model.Area;
  var checkNested = Params.checkNested;
  var module = {};


  module.index = function(req, res) {
    var id = req.params.id;

    Area.findById(id).exec(function(err, area) {
      res.render('admin/areas/edit.jade', {area: area});
    });
  }

  module.form = function(req, res) {
    var post = req.body;
    var id = req.params.id;

    Area.findById(id).exec(function(err, area) {

      locales.forEach(function(locale) {
        checkNested(post, [locale, 'title'])
          && area.setPropertyLocalised('title', post[locale].title, locale);

        checkNested(post, [locale, 'description'])
          && area.setPropertyLocalised('description', post[locale].description, locale);

        checkNested(post, [locale, 'adress'])
          && area.setPropertyLocalised('adress', post[locale].adress, locale);
      });

      area.save(function(err, area) {
        res.redirect('/admin/areas');
      });
    });
  }


  return module;
}