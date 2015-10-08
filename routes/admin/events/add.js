var Subsidiary = require(__app_root + '/models/main.js').Subsidiary;
var Category = require(__app_root + '/models/main.js').Category;
var Event = require(__app_root + '/models/main.js').Event;


exports.index = function(req, res) {
  Subsidiary.find().exec(function(err, subsidiaries) {
    Category.find().exec(function(err, categorys) {
      res.render('admin/events/add.jade', {subsidiaries: subsidiaries, categorys: categorys});
    });
  });
}


exports.form = function(req, res) {
  var post = req.body;

  var event = new Event();

  event.members = post.members;
  event.status = post.status;
  event.type = post.type;
  event.age = post.age;
  event.interval = post.interval;
  event.hall = post.hall;
  event.categorys = post.categorys;

  var locales = post.en ? ['ru', 'en'] : ['ru'];

  locales.forEach(function(locale) {
    checkNested(post, [locale, 'title'])
      && event.setPropertyLocalised('title', post[locale].title, locale);

    checkNested(post, [locale, 'description'])
      && event.setPropertyLocalised('description', post[locale].description, locale);

    checkNested(post, [locale, 'alt_ticket'])
      && event.setPropertyLocalised('alt_ticket', post[locale].alt_ticket, locale);

  });

  event.save(function(err, event) {
    res.redirect('/admin/events');
  });
}