var shortid = require('shortid');
var gm = require('gm').subClass({ imageMagick: true });
var mime = require('mime');
var mkdirp = require('mkdirp');
var del = require('del');


module.exports = function(Model, Params) {
  var Member = Model.Member;
  var checkNested = Params.locale.checkNested;
  var module = {};


  module.index = function(req, res) {
    res.render('admin/members/add.jade');
  }

  module.form = function(req, res) {
    var post = req.body;
    var file = req.file;

    var member = new Member();

    member._short_id = shortid.generate();
    member.roles = post.roles;
    member.status = post.status;

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'name'])
        && member.setPropertyLocalised('name', post[locale].name, locale);

      checkNested(post, [locale, 'description'])
        && member.setPropertyLocalised('description', post[locale].description, locale);

    });

    if (file) {
      var public_path = __app_root + '/public';
      var dir_path = '/cdn/images/members' + '/' + member._id;
      var file_name = 'photo' + '.' + mime.extension(file.mimetype);

      mkdirp(public_path + dir_path, function() {
        gm(file.path).resize(520, false).quality(80).write(public_path + dir_path + '/' + file_name, function() {
          del(file.path, function() {
            member.photo = dir_path + '/' + file_name;
            member.save(function(err, member) {
              res.redirect('/members');
            });
          });
        });
      });
    } else {
      member.save(function(err, member) {
        res.redirect('/members');
      });
    }

  }


  return module;
}