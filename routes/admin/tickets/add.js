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

    Event
      .where('_id').in(post.events)
      .setOptions({ multi: true })
      .update({ $push: { 'tickets.ids': ticket._id.toString() } }, function(err, events) {

      ticket.save(function(err, ticket) {
        res.redirect('/admin/events');
      });
    });
  }



  return module;
}