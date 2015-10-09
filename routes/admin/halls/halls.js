var Subsidiary = require('../../models/main.js').Subsidiary;
var Hall = require('../../models/main.js').Hall;

var path = require('path');
var del = require('del');
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
// *** Admin Halls Block ***
// ------------------------


exports.list = function(req, res) {
  var subs_id = req.params.subs_id;

  Hall.where(subsidiary).equals(subs_id).exec(function(err, halls) {
    res.render('admin/halls', {halls: halls});
  });
}


// ------------------------
// *** Add Halls Block ***
// ------------------------


exports.add = function(req, res) {
  var subs_id = req.params.id;

  res.render('admin/halls/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;
  var subs_id = req.params.subs_id;

  var hall = new Hall();

  hall.subsidiary = subs_id;

  var locales = post.en ? ['ru', 'en'] : ['ru'];

  locales.forEach(function(locale) {
    checkNested(post, [locale, 'title'])
      && hall.setPropertyLocalised('title', post[locale].title, locale);

    checkNested(post, [locale, 'description'])
      && hall.setPropertyLocalised('description', post[locale].description, locale);

  });

  hall.save(function(err, hall) {
    res.redirect('/admin/halls');
  });
}


// ------------------------
// *** Edit Halls Block ***
// ------------------------


exports.edit = function(req, res) {
  var hall_id = req.params.hall_id;

  Hall.findById(hall_id).exec(function(err, hall) {
    res.render('admin/halls/edit.jade', {hall: hall});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var hall_id = req.params.hall_id;

  Hall.findById(hall_id).exec(function(err, hall) {

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && hall.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && hall.setPropertyLocalised('description', post[locale].description, locale);

    });

    hall.save(function(err, hall) {
      res.redirect('/admin/halls');
    });
  });
}


// ------------------------
// *** Remove Halls Block ***
// ------------------------


exports.remove = function(req, res) {
  var hall_id = req.body.id;

  Hall.findByIdAndRemove(hall_id, function(err, hall) {
    res.send('ok');
  });
}