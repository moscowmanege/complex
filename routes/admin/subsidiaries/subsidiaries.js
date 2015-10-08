var Subsidiary = require('../../models/main.js').Subsidiary;
var Hall = require('../../models/main.js').Hall;

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
// *** Admin Subsidiaries Block ***
// ------------------------


exports.list = function(req, res) {
  Subsidiary.find().exec(function(err, subsidiaries) {
    res.render('auth/subsidiaries', {subsidiaries: subsidiaries});
  });
}


// ------------------------
// *** Add Subsidiaries Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/subsidiaries/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;

  var subsidiary = new Subsidiary();

  var locales = post.en ? ['ru', 'en'] : ['ru'];

  locales.forEach(function(locale) {
    checkNested(post, [locale, 'title'])
      && subsidiary.setPropertyLocalised('title', post[locale].title, locale);
      // subsidiary.i18n.title.set(post[locale].title, locale);

    checkNested(post, [locale, 'description'])
      && subsidiary.setPropertyLocalised('description', post[locale].description, locale);

    checkNested(post, [locale, 'adress'])
      && subsidiary.setPropertyLocalised('adress', post[locale].adress, locale);

  });

  subsidiary.save(function(err, subsidiary) {
    res.redirect('/auth/subsidiaries');
  });
}


// ------------------------
// *** Edit Subsidiaries Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Subsidiary.findById(id).exec(function(err, subsidiary) {
    res.render('auth/subsidiaries/edit.jade', {subsidiary: subsidiary});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

  Subsidiary.findById(id).exec(function(err, subsidiary) {

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && subsidiary.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && subsidiary.setPropertyLocalised('description', post[locale].description, locale);

      checkNested(post, [locale, 'adress'])
        && subsidiary.setPropertyLocalised('adress', post[locale].adress, locale);
    });

    subsidiary.save(function(err, subsidiary) {
      res.redirect('/auth/subsidiaries');
    });
  });
}


// ------------------------
// *** Remove Subsidiaries Block ***
// ------------------------


exports.remove = function(req, res) {
  var id = req.body.id;

  Subsidiary.findByIdAndRemove(id).exec(function(err, subsidiary) {
    res.send('ok');
  });
}