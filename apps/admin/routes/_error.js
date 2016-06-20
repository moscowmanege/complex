exports.err_500 = function(err, req, res, next) {
	var status = err.status || 500;
	res.status(status);

	res.render('error', { status: status });

	console.error(' ');
	console.error('-------------');
	console.error('*** Error ***');
	console.error('-------------');
	console.error(' ');
	console.error(' ');
	console.error('--- Url:');
	console.error(req.protocol + '://' + req.hostname + (process.env.PORT && (':' + process.env.PORT)) + req.originalUrl);
	console.error(' ');
	console.error('--- Stack:');
	console.error(err.stack);  // err.message
	console.error(' ');

};

exports.err_404 = function(req, res, next) {
	res.status(404);

	// respond with html page
	if (req.accepts('html')) {
		res.render('error', { status: 404 });
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.json({ error: { status: 404, message: 'Not found' } });
		return;
	}

	// default to plain-text
	res.type('txt').send('404 Not found');

};