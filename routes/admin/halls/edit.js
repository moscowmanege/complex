module.exports = function(Model, Params) {
  var Hall = Model.Hall
  var checkNested = Params.locale.checkNested;
  var module = {};



  module.index = function(req, res) {
    var hall_id = req.params.hall_id;

    Hall.findById(hall_id).exec(function(err, hall) {
      res.render('admin/halls/edit.jade', {hall: hall});
    });
  }

  module.form = function(req, res) {
    var post = req.body;
    var hall_id = req.params.hall_id;

    Hall.findById(hall_id).exec(function(err, hall) {

      var locales = post.en ? ['ru', 'en'] : ['ru'];

      locales.forEach(function(locale) {
        checkNested(post, [locale, 'title'])
          && hall.setPropertyLocalised('title', post[locale].title, locale);

        checkNested(post, [locale, 'description'])
          && hall.setPropertyLocalised('description', post[locale].description, locale);

      });

      hall.save(function(err, hall) {
        res.redirect('/areas');
      });
    });
  }


  return module;
}