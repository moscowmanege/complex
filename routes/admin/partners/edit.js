var shortid = require('shortid');

module.exports = function(Model, Params) {
  var Partner = Model.Partner;
  var checkNested = Params.locale.checkNested;
  var module = {};


  module.index = function(req, res) {
    var id = req.params.id;

    Partner.findById(id).exec(function(err, partner) {
      res.render('admin/partners/edit.jade', {partner: partner});
    });
  }

  module.form = function(req, res) {
    var post = req.body;
    var id = req.params.id;

    Partner.findById(id).exec(function(err, partner) {

      partner.type = post.type;
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
    });
  }


  return module;
}