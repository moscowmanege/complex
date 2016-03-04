module.exports = function(Model, Params) {
  var Area = Model.Area;
  var checkNested = Params.locale.checkNested;
  var module = {};


  module.index = function(req, res) {
    var id = req.params.area_id;

    Area.findById(id).exec(function(err, area) {
      res.render('areas/edit.jade', {area: area});
    });
  }

  module.form = function(req, res) {
    var post = req.body;
    var id = req.params.area_id;

    Area.findById(id).exec(function(err, area) {

      area.contacts.phones = post.phones;
      area.contacts.emails = post.emails;

      var locales = post.en ? ['ru', 'en'] : ['ru'];

      locales.forEach(function(locale) {
        checkNested(post, [locale, 'title'])
          && area.setPropertyLocalised('title', post[locale].title, locale);

        checkNested(post, [locale, 'description'])
          && area.setPropertyLocalised('description', post[locale].description, locale);

        checkNested(post, [locale, 'adress'])
          && area.setPropertyLocalised('contacts.adress', post[locale].adress, locale);

        checkNested(post, [locale, 'schedule'])
          && area.setPropertyLocalised('contacts.schedule', post[locale].schedule, locale);

      });

      area.save(function(err, area) {
        res.redirect('/areas');
      });
    });
  }


  return module;
}