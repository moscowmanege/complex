var shortid = require('shortid');
var gm = require('gm').subClass({ imageMagick: true });
var mime = require('mime');
var mkdirp = require('mkdirp');
var del = require('del');


module.exports = function(Model, Params) {
  var Partner = Model.Partner;
  var checkNested = Params.locale.checkNested;
  var module = {};


  module.index = function(req, res) {
    var id = req.params.id;

    Partner.findById(id).exec(function(err, partner) {
      res.render('admin/partners/edit.jade', {partner: partner});
    });
  }

  module.form = function(req, res) {
    var post = req.body;
    var file = req.file;
    var id = req.params.id;

    Partner.findById(id).exec(function(err, partner) {

      partner.type = post.type;
      partner.status = post.status;
      partner.link = post.link;

      var locales = post.en ? ['ru', 'en'] : ['ru'];

      locales.forEach(function(locale) {
        checkNested(post, [locale, 'title'])
          && partner.setPropertyLocalised('title', post[locale].title, locale);

        checkNested(post, [locale, 'description'])
          && partner.setPropertyLocalised('description', post[locale].description, locale);

      });

      if (file) {
        var public_path = __app_root + '/public';
        var dir_path = '/images/partners' + '/' + partner._id;
        var file_name = 'logo' + '.' + mime.extension(file.mimetype);

        mkdirp(public_path + dir_path, function() {
          gm(file.path).resize(320, false).quality(100).write(public_path + dir_path + '/' + file_name, function() {
            del(file.path, function() {
              partner.logo = dir_path + '/' + file_name;
              partner.save(function(err, partner) {
                res.redirect('/partners');
              });
            });
          });
        });
      } else {
        partner.save(function(err, partner) {
          res.redirect('/partners');
        });
      }

    });
  }


  return module;
}