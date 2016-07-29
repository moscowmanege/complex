var Model = require(__app_root + '/models/main.js');

module.exports.Populate = function(areas, callback) {
	var Event = Model.Event;
	var Area = Model.Area;
	var News = Model.News;

	var paths = [
		{path:'complex', select: 'type price _id', model: 'Ticket'},
		{path:'news.categorys', select: 'title', model: 'Category'},
		{path:'events.halls', select: 'title', model: 'Hall'},
		{path:'events.categorys', select: 'title', model: 'Category'},
		{path:'events.members.ids', select: 'name', model: 'Member'},
		{path:'events.tickets.ids', select: 'type price _id', model: 'Ticket'},
	];

	Event.populate(areas, paths, function(err, areas) {
		Area.populate(areas, {path: 'area', model: 'Area'}, function(err, areas) {
			callback(null, areas);
		});
	});
};