var shortid = require('shortid');

module.exports = function(Model, Params) {
  var Member = Model.Member;
  var checkNested = Params.checkNested;
  var module = {};


  module.index = function(req, res) {
    res.render('admin/members/add.jade');
  }

  module.form = function(req, res) {
    var post = req.body;

    var member = new Member();

    member._short_id = shortid.generate();

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'name'])
        && member.setPropertyLocalised('name', post[locale].name, locale);

      checkNested(post, [locale, 'description'])
        && member.setPropertyLocalised('description', post[locale].description, locale);

    });

    member.save(function(err, member) {
      res.redirect('/admin/members');
    });
  }


  return module;
}