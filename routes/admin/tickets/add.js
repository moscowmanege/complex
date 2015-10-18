module.exports = function(Model, Params) {
  var Event = Model.Event;
  var Ticket = Model.Ticket;
  var checkNested = Params.checkNested;
  var module = {};



  module.index = function(req, res) {
    var subs_id = req.params.id;

    Event.find().exec(function(err, events) {
      res.render('admin/tickets/add.jade', {events: events});
    });
  }

  module.form = function(req, res) {
    var post = req.body;

    var ticket = new Ticket();

    ticket.price = post.price;
    ticket.type = post.type;
    ticket.events = post.events;
    ticket.expired = post.expired;

    ticket.save(function(err, area) {
      res.redirect('/admin/events');
    });
  }



  return module;
}