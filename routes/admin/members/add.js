module.exports = function(Member) {
  var module = {};


  module.index = function(req, res) {
    res.render('auth/members/add.jade');
  }

  module.form = function(req, res) {
    var post = req.body;

    var member = new Member();

    member._short_id = shortid.generate();

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
      res.redirect('/auth/members');
    });
  }


  return module;
}