module.exports = function(Model, Params) {
  var Event = Model.Event;
  var Category = Model.Category;
  var Member = Model.Member;
  var Area = Model.Area;
  var checkNested = Params.checkNested;
  var module = {};


  module.index = function(req, res) {
    var id = req.params.event_id;

    Event.findById(id).exec(function(err, event) {
      Area.find().exec(function(err, areas) {
        Category.find().exec(function(err, categorys) {
          Member.find().exec(function(err, members) {
            res.render('admin/events/edit.jade', {event: event, areas: areas, members: members, categorys: categorys});
          });
        });
      });
    });
  }


  module.form = function(req, res) {
    var post = req.body;
    var id = req.params.event_id;

    Event.findById(id).exec(function(err, event) {

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
    });
  }


  return module;
}