module.exports = function(Model, Params) {
  var Event = Model.Event;
  var Category = Model.Category;
  var Member = Model.Member;
  var Area = Model.Area;
  var checkNested = Params.checkNested;
  var module = {};


  module.index = function(req, res) {
    Area.find().populate('halls').exec(function(err, areas) {
      Category.find().exec(function(err, categorys) {
        Member.find().exec(function(err, members) {
          res.render('admin/events/add.jade', {areas: areas, categorys: categorys, members: members});
        });
      });
    });
  }


  module.form = function(req, res) {
    var post = req.body;

    var event = new Event();

    event.status = post.status;
    event.type = post.type;
    event.age = post.age;
    event.interval.begin = new Date(Date.UTC(post.interval.begin.year, post.interval.begin.month, post.interval.begin.date));
    event.interval.end = new Date(Date.UTC(post.interval.end.year, post.interval.end.month, post.interval.end.date));
    event.place = post.place;
    event.categorys = post.categorys;

    post.members.forEach(function(member) {
      event.members.push({
        status: [{lg:'ru', value: member.status.ru}],
        ids: member.ids
      });
    });

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && event.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && event.setPropertyLocalised('description', post[locale].description, locale);

      checkNested(post, [locale, 'alt'])
        && event.setPropertyLocalised('tickets.alt', post[locale].alt, locale);

    });

    event.save(function(err, event) {
      console.log(err)
      res.redirect('/admin/events');
    });
  }


  return module;
}