var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
  var module = {};

  var News = Model.News;
  var Category = Model.Category;
  var Area = Model.Area;

  var checkNested = Params.locale.checkNested;
  var previewImages = Params.upload.preview;
  var uploadImages = Params.upload.images;


  module.index = function(req, res, next) {
    var id = req.params.news_id;

    async.parallel({
      news: function(callback) {
        News.findById(id).exec(callback);
      },
      areas: function(callback) {
        Area.find().exec(callback);
      },
      categorys: function(callback) {
        Category.find().sort('-date').exec(callback)
      },
    }, function(err, results) {
      if (err) return next(err);

      previewImages(results.news.images, function(err, images_preview) {
        if (err) return next(err);

        results.images_preview = images_preview;
        res.render('news/edit.jade', results);
      });
    });
  };


  module.form = function(req, res, next) {
    var post = req.body;
    var id = req.params.news_id;

    News.findById(id).exec(function(err, news) {
      if (err) return next(err);

      news.status = post.status;
      news.interval.begin = moment(post.interval.begin.date + 'T' + post.interval.begin.time.hours + ':' + post.interval.begin.time.minutes).toDate();
      news.interval.end = moment(post.interval.end.date + 'T' + post.interval.end.time.hours + ':' + post.interval.end.time.minutes).toDate();
      news.areas = post.areas == '' ? [] : post.areas;
      news.categorys = post.categorys == '' ? [] : post.categorys;
      news.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
      news.meta = undefined;

      var locales = post.en ? ['ru', 'en'] : ['ru'];

      locales.forEach(function(locale) {
        checkNested(post, [locale, 'title'])
          && news.setPropertyLocalised('title', post[locale].title, locale);

        checkNested(post, [locale, 's_title'])
          && news.setPropertyLocalised('s_title', post[locale].s_title, locale);

        checkNested(post, [locale, 'description'])
          && news.setPropertyLocalised('description', post[locale].description, locale);
      });

      uploadImages(news, 'news', post.images, function(err, news) {
        if (err) return next(err);

        news.save(function(err, news) {
          if (err) return next(err);

          res.redirect('/news');
        });
      });
    });
  };


  return module;
};