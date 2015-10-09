module.exports = function(Member) {
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
        checkNested(post, [locale, 'first'])
          && member.name.setPropertyLocalised('first', post[locale].first, locale);

        checkNested(post, [locale, 'last'])
          && member.name.setPropertyLocalised('last', post[locale].last, locale);

        checkNested(post, [locale, 'description'])
          && member.setPropertyLocalised('description', post[locale].description, locale);

      });

      member.save(function(err, member) {
        res.redirect('/admin/categorys');
      });
    });
  }


  return module;
}