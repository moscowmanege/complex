exports.index = function(req, res, next) {
	res.status(404);

	// respond with html page
	if (req.accepts('html')) {
		res.render('error', { url: req.url, status: 404 });
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.type('json').send({ error: { status: 'Not found' } });
		return;
	}

	// default to plain-text
	res.type('txt').send('Not found');
};