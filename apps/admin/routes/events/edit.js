var moment = require('moment');

module.exports = function(Model, Params) {
  var Event = Model.Event;
  var Category = Model.Category;
  var Member = Model.Member;
  var Partner = Model.Partner;
  var Area = Model.Area;

  var checkNested = Params.locale.checkNested;
  var previewImages = Params.upload.preview;
  var uploadImages = Params.upload.images;

  var module = {};


  module.index = function(req, res) {
    var id = req.params.event_id;

    Event.findById(id).populate('members.ids partners.ids').exec(function(err, event) {
      Area.find().populate('halls').exec(function(err, areas) {
        Category.find().sort('-date').exec(function(err, categorys) {
          Partner.find().sort('-date').exec(function(err, partners) {
            previewImages(event.images, function(err, images_preview) {
              res.render('events/edit.jade', {images_preview:images_preview, event: event, areas: areas, partners: partners, categorys: categorys});
            });
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
      event.meta = undefined;

      event.members = [];
      if (post.members) {
        for (member in post.members) {
          event.members.push({
            role: member,
            ids: post.members[member]
          });
        }
      }

      event.partners = [];
      if (post.partners) {
        for (partner in post.partners) {
          event.partners.push({
            rank: partner,
            ids: post.partners[partner]
          });
        }
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

      uploadImages(event, 'events', post.images, function(err, event) {
        event.save(function(err, event) {
          res.redirect('/events');
        });
      });
    });
  }


  return module;
}