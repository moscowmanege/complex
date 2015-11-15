global.__app_root = __dirname.replace('/app', '');

var chunk = require('chunk');
var jade = require('jade');

var express = require('express'),
		cookieParser = require('cookie-parser'),
		app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var i18n = require('i18n');

app.set('views', __app_root + '/views');
app.set('view engine', 'jade');

if (process.env.NODE_ENV != 'production') {
	app.use(express.static(__app_root + '/public'));
	app.locals.pretty = true;
	app.set('json spaces', 2);
}

i18n.configure({
	locales: ['ru', 'en'],
	defaultLocale: 'ru',
	cookie: 'locale',
	directory: __app_root + '/locales'
});

app.use(cookieParser());
app.use(i18n.init);

app.use(function(req, res, next) {
	res.locals.session = req.session;
	res.locals.host = req.hostname;
	res.locals.url = req.originalUrl;
	res.locals.locale = req.cookies.locale || 'ru';
	req.locale = req.cookies.locale || 'ru';
	next();
});


var Model = require(__app_root + '/models/main.js');

var Area = Model.Area;
var Event = Model.Event;


var get_events = function(status, area) {
	Area.findById(area).exec(function(err, area) {
		Event.find({'place.area': area}).populate('place.halls tickets.ids members.ids').exec(function(err, events) {
			var chunks = chunk(events, 2);
			var opts = {chunks: chunks, area: area, compileDebug: false, debug: false, cache: false, pretty: false};
			var events_compile = jade.renderFile(__app_root + '/views/monitors/monitor.jade', opts);

			io.to(area._id).emit('events', { events: events_compile, status: status });
		});
	});
};

var check_rooms = function() {
	var rooms = Object.keys(io.sockets.adapter.rooms);
	// console.log('Connections: ' + io.engine.clientsCount)
	// console.log('Rooms: ' + Object.keys(io.sockets.adapter.rooms))

	Area.distinct('_id').exec(function(err, areas) {
		areas.forEach(function(area_id) {
			rooms.forEach(function(room_id) {
				if (area_id == room_id) {
					get_events('update', area_id);
				}
			});
		});
	});
};


var globals = require('../routes/globals/_globals.js');
var monitors = require('../routes/monitors/_monitors.js');
var socket = require('../routes/monitors/_socket.js')(io, get_events);


app.use('/', monitors);
app.use(globals);

io.on('connection', socket.get);

var check_interval = setInterval(check_rooms, 1000 * 60 * 5);	// 5 minutes


// ------------------------
// *** Connect server Block ***
// ------------------------


server.listen(process.env.PORT || 3002);
console.log('http://127.0.0.1:3002')