global.__app_root = __dirname.replace('/apps/admin', '');

var express = require('express'),
		bodyParser = require('body-parser'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		methodOverride = require('method-override'),
			app = express();

var i18n = require('i18n');

var MongoStore = require('connect-mongo')(session);

app.set('views', __app_root + '/apps/admin/views');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.use(i18n.init);


app.use(session({
	key: 'session',
	rolling: true,
	resave: false,
	saveUninitialized: false,
	secret: 'keyboard cat',
	store: new MongoStore({ url: 'mongodb://localhost/main' }),
	cookie: {
		path: '/',
		maxAge: 1000 * 60 * 60 * 3 // 3 hours
	}
}));

app.locals.static_types = require(__app_root + '/types.json');

app.use(function(req, res, next) {
	res.locals.session = req.session;
	res.locals.host = req.hostname;
	res.locals.url = req.originalUrl;
	next();
});


var admin = require('./routes/_admin.js');
var auth = require('./routes/auth/_auth.js');


app.use('/', admin);
app.use('/auth', auth);


app.use(function(err, req, res, next) {
	var status = err.status || 500;
	res.status(status);

	res.render('error', { status: status, url: req.protocol + '://' + req.hostname + req.originalUrl, error: err });
	console.error(err.message);

});

app.use(function(req, res, next) {
	res.status(404);

	// respond with html page
	if (req.accepts('html')) {
		res.render('error', { status: 404, url: req.protocol + '://' + req.hostname + req.originalUrl });
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.json({ error: { status: 404, message: 'Not found' } });
		return;
	}

	// default to plain-text
	res.type('txt').send('404 Not found');

});


// ------------------------
// *** Connect server Block ***
// ------------------------


app.listen(process.env.PORT || 3000);
console.log('http://127.0.0.1:3000');