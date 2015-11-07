var shortid = require('shortid');
var moment = require('moment');

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
				res.render('admin/events/add.jade', {areas: areas, categorys: categorys});
      });
    });
  }


  module.form = function(req, res) {
    var post = req.body;

    var event = new Event();

    event._short_id = shortid.generate();
    event.status = post.status;
    event.type = post.type;
    event.age = post.age;
    event.interval.begin = moment(post.interval.begin.date + 'T' + post.interval.begin.time.hours + ':' + post.interval.begin.time.minutes).toDate();
    event.interval.end = moment(post.interval.end.date + 'T' + post.interval.end.time.hours + ':' + post.interval.end.time.minutes).toDate();
    event.place = post.place;
    event.categorys = post.categorys == '' ? [] : post.categorys;

    for (member in post.members) {
    	event.members.push({
    		role: member,
    		ids: post.members[member]
    	});
    }

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && event.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 's_title'])
        && event.setPropertyLocalised('s_title', post[locale].s_title, locale);

      checkNested(post, [locale, 'description'])
        && event.setPropertyLocalised('description', post[locale].description, locale);

      checkNested(post, [locale, 'alt'])
        && event.setPropertyLocalised('tickets.alt', post[locale].alt, locale);

    });

    event.save(function(err, event) {
      res.redirect('/events');
    });
  }


  return module;
}