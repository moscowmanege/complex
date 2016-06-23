var ErrRespond = function(req, res, status, message) {
	res.status(status);

	// respond with html page
	if (req.accepts('html')) {
		res.render('error', { status: status });
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.json({ error: { status: status, message: message } });
		return;
	}

	// default to plain-text
	res.type('txt').send(status + ' ' + message);

};

exports.err_500 = function(err, req, res, next) {

	[
		' ',
		'-------------',
		'*** ERROR ***',
		'-------------',
		' ',
		'--- Method: ' + req.method,
		'--- Url: ' + req.protocol + '://' + req.hostname + ((process.env.NODE_ENV != 'production') && (':' + process.env.PORT)) + req.originalUrl,
		'--- Stack:',
		' ',
		err.stack, // err.message
	].forEach(function(str) { console.error(str); });

	ErrRespond(req, res, err.status || 500, 'Bad params');
};

exports.err_404 = function(req, res, next) {
	ErrRespond(req, res, 404, 'Not found');
};