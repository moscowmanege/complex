var path = require('path');

global.__app_root = path.resolve(__dirname);

var mongoose = require('mongoose');
		mongoose.connect('localhost', 'main');

var i18n = require('i18n');

var express = require('express'),
		bodyParser = require('body-parser'),
		multer = require('multer'),
		accepts = require('accepts'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		methodOverride = require('method-override'),
			app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

if (process.env.NODE_ENV != 'production') {
	app.use(express.static(__dirname + '/public'));
	app.locals.pretty = true;
	app.set('json spaces', 2);
	mongoose.set('debug', false);
}

var MongoStore = require('connect-mongo')(session);
var upload = multer({ dest: __dirname + '/uploads/' });

i18n.configure({
	locales: ['ru', 'en'],
	defaultLocale: 'ru',
	cookie: 'locale',
	directory: __dirname + '/locales'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.use(i18n.init);

var cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'attach', maxCount: 8 }]);

app.use(session({
	key: 'session',
	resave: false,
	saveUninitialized: false,
	secret: 'keyboard cat',
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	cookie: {
		path: '/',
		maxAge: 1000 * 60 * 60 * 3 // 3 hours
	}
}));

app.use(function(req, res, next) {
	res.locals.session = req.session;
	res.locals.host = req.hostname;
	res.locals.url = req.originalUrl;
	res.locals.locale = req.cookies.locale || 'ru';
	req.locale = req.cookies.locale || 'ru';
	next();
});

var main = require('./routes/main/_main.js');
var globals = require('./routes/globals/_globals.js');
var admin = require('./routes/admin/_admin.js');
var auth = require('./routes/auth/_auth.js');


function checkAuth (req, res, next) {
	req.session.user_id
		? next()
		: res.redirect('/auth/login');
}


app.use('/', main);
app.use('/admin', checkAuth, admin);
app.use('/auth', auth);
// app.use(globals);


// ------------------------
// *** Connect server Block ***
// ------------------------


app.listen(process.env.PORT || 3000);
console.log('http://127.0.0.1:3000')