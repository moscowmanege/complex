var shortid = require('shortid');
var Member = require('../../models/main.js').Member;


// ------------------------
// *** Admin Members Block ***
// ------------------------


exports.list = function(req, res) {
  Member.find().sort('-date').exec(function(err, members) {
    res.render('auth/members/', {members: members});
  });
}


// ------------------------
// *** Add Members Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/members/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;

  var member = new Member();

  member._short_id = shortid.generate();

  var locales = post.en ? ['ru', 'en'] : ['ru'];

  locales.forEach(function(locale) {
    checkNested(post, [locale, 'first'])
      && member.name.setPropertyLocalised('first', post[locale].first, locale);

    checkNested(post, [locale, 'last'])
      && member.name.setPropertyLocalised('last', post[locale].last, locale);

    checkNested(post, [locale, 'description'])
      && member.setPropertyLocalised('description', post[locale].description, locale);

  });

  member.save(function(err, member) {
    res.redirect('/auth/members');
  });
}


// ------------------------
// *** Edit Members Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Member.findById(id).exec(function(err, member) {
    res.render('auth/members/edit.jade', {member: member});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

  Member.findById(id).exec(function(err, member) {

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'first'])
        && member.name.setPropertyLocalised('first', post[locale].first, locale);

      checkNested(post, [locale, 'last'])
        && member.name.setPropertyLocalised('last', post[locale].last, locale);

      checkNested(post, [locale, 'description'])
        && member.setPropertyLocalised('description', post[locale].description, locale);

    });

    member.save(function(err, member) {
      res.redirect('/auth/categorys');
    });
  });
}


// ------------------------
// *** Remove Member Block ***
// ------------------------


exports.remove = function(req, res) {
  var id = req.body.id;

  Member.findByIdAndRemove(id, function(err, member) {
    res.send('ok');
  });
}