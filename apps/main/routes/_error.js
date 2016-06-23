var ErrRespond = function(req, res, status, message, stack) {
	res.status(status);

	// respond with html page
	if (req.accepts('html')) {
		res.render('error', { status: status, message: message, stack: stack });
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.json({ error: { status: status, message: message, stack: stack } });
		return;
	}

	// default to plain-text
	res.type('txt').send(status + ' ' + message);

};

exports.err_500 = function(err, req, res, next) {
	var env = process.env.NODE_ENV != 'production';

	[
		' ',
		'-------------',
		'*** ERROR ***',
		'-------------',
		' ',
		'--- Method: ' + req.method,
		'--- Url: ' + req.protocol + '://' + req.hostname + (env && (':' + process.env.PORT)) + req.originalUrl,
		'--- Stack:',
		' ',
		err.stack,
	].forEach(function(str) { console.error(str); });

	ErrRespond(req, res, err.status || 500, err.message || 'Internal Server Error', env && err.stack);
};

exports.err_404 = function(req, res, next) {
	ErrRespond(req, res, 404, 'Not Found');
};