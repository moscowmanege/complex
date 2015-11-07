var moment = require('moment');

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
      Area.find().populate('halls').exec(function(err, areas) {
        Category.find().exec(function(err, categorys) {
          var opts = { path: 'members.ids', model: 'Member' };
          Event.populate(event, opts, function (err, event) {
            res.render('admin/events/edit.jade', {event: event, areas: areas, categorys: categorys});
          });
        });
      });
    });
  }


  module.form = function(req, res) {
    var post = req.body;
    var id = req.params.event_id;

    Event.findById(id).exec(function(err, event) {

      event.status = post.status;
      event.type = post.type;
      event.age = post.age;
      event.interval.begin = moment(post.interval.begin.date + 'T' + post.interval.begin.time.hours + ':' + post.interval.begin.time.minutes).toDate();
      event.interval.end = moment(post.interval.end.date + 'T' + post.interval.end.time.hours + ':' + post.interval.end.time.minutes).toDate();
      event.place = post.place;
      event.categorys = post.categorys == '' ? [] : post.categorys;
      event.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);

      event.members = [];
      if (post.members) {
        for (member in post.members) {
          event.members.push({
            role: member,
            ids: post.members[member]
          });
        }
      }

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
        res.redirect('/events');
      });
    });
  }


  return module;
}