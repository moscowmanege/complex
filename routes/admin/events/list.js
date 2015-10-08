var Event = require(__app_root + '/models/main.js').Event;


exports.index = function(req, res) {
  Event.find().exec(function(err, events) {
    res.render('admin/events', {events: events});
  });
}