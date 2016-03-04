module.exports = function(Model, Params) {
  var Hall = Model.Hall;
  var Area = Model.Area;
  var checkNested = Params.locale.checkNested;
  var module = {};



  module.index = function(req, res) {
    var subs_id = req.params.id;

    res.render('halls/add.jade');
  }

  module.form = function(req, res) {
    var post = req.body;

    var hall = new Hall();

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && hall.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && hall.setPropertyLocalised('description', post[locale].description, locale);

    });

    hall.save(function(err, hall) {
      var area_id = req.params.area_id;

      Area.findById(area_id).exec(function(err, area) {
        area.halls.push(hall._id);

        area.save(function(err, area) {
          res.redirect('/areas');
        });
      });
    });
  }



  return module;
}