exports.index = function(req, res) {
  var id = req.body.id;

  Event.findByIdAndRemove(id).exec(function(err, event) {
    res.send('ok');
  });
}