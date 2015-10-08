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


// -------------------
// *** Routes Block ***
// -------------------


var main = require('./routes/main.js');
var lectures = require('./routes/lectures.js');
var other = require('./routes/other.js');
var write = require('./routes/write.js');
var content = require('./routes/content.js');

var auth = require('./routes/auth.js');

var admin_users = require('./routes/admin/users.js');
var admin_categorys = require('./routes/admin/categorys.js');
var admin_lectures_studys = require('./routes/admin/lectures.js');
var admin_other_studys = require('./routes/admin/other.js');
var admin_themes = require('./routes/admin/themes.js');
var admin_themes_sub = require('./routes/admin/themes_sub.js');

var globals = require('./routes/globals.js');


// ------------------------
// *** Midleware Block ***
// ------------------------



function checkAuth (req, res, next) {
	req.session.user_id ? next() : res.redirect('/login');
}


// ------------------------
// *** Main Routes Block ***
// ------------------------



// === Main Route
app.route('/').get(main.index)

// === Lectures Route
app.route('/lectures/:theme_sym/:sub_id').get(lectures.index);

// === Lecture Route
app.route('/lecture/:id').get(lectures.lecture);

// === Lectures Redirect
app.route('/lectures').get(lectures.redirect);

// === Lectures Route
app.route('/lectures/:theme_sym').get(lectures.redirect_sym);

// === Other Route
app.route('/other')
	.get(other.index)
	.post(other.get_items);

// === Other item Route
app.route('/other/:id').get(other.other_item)

// === Write Route
app.route('/write')
	 .get(write.index)
	 .post(upload.single('attach'), write.mail);


// ------------------------
// *** Admin Users Routes Block ***
// ------------------------



// === Admin users Route
app.route('/auth/users').get(checkAuth, admin_users.list);


// === Admin @add users Route
app.route('/auth/users/add')
	 .get(checkAuth, admin_users.add)
	 .post(checkAuth, admin_users.add_form);


// === Admin @edit users Route
app.route('/auth/users/edit/:id')
	 .get(checkAuth, admin_users.edit)
	 .post(checkAuth, admin_users.edit_form);


// === Admin @remove users Route
app.route('/auth/users/remove')
	 .post(checkAuth, admin_users.remove);



// ------------------------
// *** Admin Categorys Routes Block ***
// ------------------------


// === Admin categorys Route
app.route('/auth/categorys').get(checkAuth, admin_categorys.list);


// === Admin @add categorys Route
app.route('/auth/categorys/add')
	 .get(checkAuth, admin_categorys.add)
	 .post(checkAuth, admin_categorys.add_form);


// === Admin @edit categorys Route
app.route('/auth/categorys/edit/:id')
	 .get(checkAuth, admin_categorys.edit)
	 .post(checkAuth, admin_categorys.edit_form);


// === Admin @remove categorys Route
app.route('/auth/categorys/remove')
	 .post(checkAuth, admin_categorys.remove);



// ------------------------
// *** Admin Lectures Themes Routes Block ***
// ------------------------



// === Admin themes Route
app.route('/auth/themes').get(checkAuth, admin_themes.list);


// === Admin @add themes Route
app.route('/auth/themes/add')
	 .get(checkAuth, admin_themes.add)
	 .post(checkAuth, admin_themes.add_form);


// === Admin @edit themes Route
app.route('/auth/themes/:id/edit')
	 .get(checkAuth, admin_themes.edit)
	 .post(checkAuth, admin_themes.edit_form);


// === Admin @remove themes Route
app.route('/auth/themes/remove/main')
	 .post(checkAuth, admin_themes.remove);


// ------------------------
// *** Admin Lectures Themes Sub Routes Block ***
// ------------------------



// === Admin sub themes Route
app.route('/auth/themes/:id/sub')
	 .get(checkAuth, admin_themes_sub.list);


// === Admin @add themes sub Route
app.route('/auth/themes/:id/sub/add')
	 .get(checkAuth, admin_themes_sub.add)
	 .post(checkAuth, admin_themes_sub.add_form);


// === Admin @edit themes sub Route
app.route('/auth/themes/:id/sub/edit/:sub_id')
	 .get(checkAuth, admin_themes_sub.edit)
	 .post(checkAuth, admin_themes_sub.edit_form);


// === Admin @remove themes sub Route
app.route('/auth/themes/remove/sub')
	 .post(checkAuth, admin_themes_sub.remove);



// ------------------------
// *** Admin Lectures Studys Routes Block ***
// ------------------------



// === Admin lectures studys Route
app.route('/auth/themes/:id/sub/edit/:sub_id/studys').get(checkAuth, admin_lectures_studys.list);


// === Admin @add lectures studys Route
app.route('/auth/themes/:id/sub/edit/:sub_id/studys/add')
	 .get(checkAuth, admin_lectures_studys.add)
	 .post(checkAuth, cpUpload, admin_lectures_studys.add_form);


// === Admin @edit lectures studys Route
app.route('/auth/themes/:id/sub/edit/:sub_id/studys/edit/:study_id')
	 .get(checkAuth, admin_lectures_studys.edit)
	 .post(checkAuth, cpUpload, admin_lectures_studys.edit_form);


// === Admin @remove lectures studys Route
app.route('/auth/lecture/remove')
	 .post(checkAuth, admin_lectures_studys.remove);



// ------------------------
// *** Admin Other Routes Block ***
// ------------------------



// === Admin other studys Route
app.route('/auth/other').get(checkAuth, admin_other_studys.list);


// === Admin @add other studys Route
app.route('/auth/other/add')
	 .get(checkAuth, admin_other_studys.add)
	 .post(checkAuth, cpUpload, admin_other_studys.add_form);


// === Admin @edit other studys Route
app.route('/auth/other/edit/:id')
	 .get(checkAuth, admin_other_studys.edit)
	 .post(checkAuth, cpUpload, admin_other_studys.edit_form);


// === Admin @remove other studys Route
app.route('/auth/other/remove')
	 .post(checkAuth, admin_other_studys.remove);



// ------------------------
// *** Auth Routes Block ***
// ------------------------



// === Auth Route
app.route('/auth').get(checkAuth, auth.main);


// === Login Route
app.route('/login')
	 .get(auth.login)
	 .post(auth.login_form);


// === Logout Route
app.route('/logout').get(auth.logout);


// === Registr Route
app.route('/registr')
	 .get(auth.registr)
	 .post(auth.registr_form);



// ------------------------
// *** Content Routes Block ***
// ------------------------



// === About Route
app.route('/about').get(content.about);



// ------------------------
// *** Globals Routers Block ***
// ------------------------



// === Search Route
app.route('/search')
	 .post(globals.search)


// ------------------------
// *** Error Handling Block ***
// ------------------------


app.use(function(req, res, next) {
	var accept = accepts(req);
	res.status(404);

	// respond with html page
	if (accept.types('html')) {
		res.render('error', { url: req.url, status: 404 });
		return;
	}

	// respond with json
	if (accept.types('json')) {
			res.send({
			error: {
				status: 'Not found'
			}
		});
		return;
	}

	// default to plain-text
	res.type('txt').send('Not found');
});

app.use(function(err, req, res, next) {
	var status = err.status || 500;

	res.status(status);
	res.render('error', { error: err, status: status });
});


// ------------------------
// *** Connect server Block ***
// ------------------------


app.listen(process.env.PORT || 3000);
console.log('http://127.0.0.1:3000')