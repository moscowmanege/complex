var shortid = require('shortid');

module.exports = function(Model, Params) {
  var Member = Model.Member;
  var checkNested = Params.checkNested;
  var module = {};


  module.index = function(req, res) {
    var id = req.params.id;

    Member.findById(id).exec(function(err, member) {
      res.render('admin/members/edit.jade', {member: member});
    });
  }

  module.form = function(req, res) {
    var post = req.body;
    var id = req.params.id;

    Member.findById(id).exec(function(err, member) {

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
    });
  }


  return module;
}