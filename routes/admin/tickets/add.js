module.exports = function(Model, Params) {
  var Event = Model.Event;
  var Ticket = Model.Ticket;
  var checkNested = Params.locale.checkNested;
  var module = {};



  module.index = function(req, res) {
    var event_id = req.params.event_id;

    Event.find().exec(function(err, events) {
      res.render('admin/tickets/add.jade', {events: events, current: [event_id]});
    });
  }

  module.form = function(req, res) {
    var post = req.body;

    var ticket = new Ticket();

    ticket.price = post.price;
    ticket.type = post.type;
    ticket.events = post.events;
    ticket.status = post.status;

    Event
      .where('_id').in(post.events)
      .setOptions({ multi: true })
      .update({ $push: { 'tickets.ids': ticket._id.toString() } }, function(err, events) {

      ticket.save(function(err, ticket) {
        res.redirect('/events');
      });
    });
  }



  return module;
}