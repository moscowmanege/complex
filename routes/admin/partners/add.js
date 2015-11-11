var shortid = require('shortid');

module.exports = function(Model, Params) {
  var Partner = Model.Partner;
  var checkNested = Params.checkNested;
  var module = {};


  module.index = function(req, res) {
    res.render('admin/partners/add.jade');
  }

  module.form = function(req, res) {
    var post = req.body;

    var partner = new Partner();

    partner._short_id = shortid.generate();
    partner.types = post.types;
    partner.status = post.status;
    partner.link = post.link;

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && partner.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && partner.setPropertyLocalised('description', post[locale].description, locale);

    });

    partner.save(function(err, partner) {
      res.redirect('/partners');
    });
  }


  return module;
}