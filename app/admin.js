global.__app_root = __dirname.replace('/app', '');

var express = require('express'),
		bodyParser = require('body-parser'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		methodOverride = require('method-override'),
			app = express();

var MongoStore = require('connect-mongo')(session);

app.set('views', __app_root + '/views');
app.set('view engine', 'jade');

if (process.env.NODE_ENV != 'production') {
	app.use(express.static(__app_root + '/public'));
	app.locals.pretty = true;
	app.set('json spaces', 2);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());


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

app.use(function(req, res, next) {
	res.locals.session = req.session;
	res.locals.host = req.hostname;
	res.locals.url = req.originalUrl;
	next();
});


var globals = require('../routes/globals/_globals.js');
var admin = require('../routes/admin/_admin.js');
var auth = require('../routes/auth/_auth.js');


app.use('/', admin);
app.use('/auth', auth);
app.use(globals);


// ------------------------
// *** Connect server Block ***
// ------------------------


app.listen(process.env.PORT || 3000);
console.log('http://127.0.0.1:3000')