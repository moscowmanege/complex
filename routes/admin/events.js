var Subsidiary = require('../../models/main.js').Subsidiary;
var Category = require('../../models/main.js').Category;
var Event = require('../../models/main.js').Event;

var path = require('path');
var async = require('async');

var __appdir = path.dirname(require.main.filename);



// ------------------------
// *** Handlers Block ***
// ------------------------



var checkNested = function (obj, layers) {

  if (typeof layers == 'string') {
    layers = layers.split('.');
  }

  for (var i = 0; i < layers.length; i++) {
    if (!obj || !obj.hasOwnProperty(layers[i])) {
      return false;
    }
    obj = obj[layers[i]];
  }
  return true;
}



// ------------------------
// *** Admin Events Block ***
// ------------------------


exports.list = function(req, res) {
  Event.find().exec(function(err, events) {
    res.render('auth/events', {events: events});
  });
}


// ------------------------
// *** Add Events Block ***
// ------------------------


exports.add = function(req, res) {
  Subsidiary.find().exec(function(err, subsidiaries) {
    Category.find().exec(function(err, categorys) {
      res.render('auth/events/add.jade', {subsidiaries: subsidiaries, categorys: categorys});
    });
  });
}

exports.add_form = function(req, res) {
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
    res.redirect('/auth/events');
  });
}


// ------------------------
// *** Edit Events Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Event.findById(id).exec(function(err, event) {
    Subsidiary.find().exec(function(err, subsidiaries) {
      Category.find().exec(function(err, categorys) {
        res.render('auth/events/edit.jade', {event: event, subsidiaries: subsidiaries, categorys: categorys});
      });
    });
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

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
      res.redirect('/auth/events');
    });
  });
}


// ------------------------
// *** Remove Events Block ***
// ------------------------


exports.remove = function(req, res) {
  var id = req.body.id;

  Event.findByIdAndRemove(id).exec(function(err, event) {
    res.send('ok');
  });
}