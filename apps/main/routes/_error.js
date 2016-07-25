exports.err_500 = function(err, req, res, next) {
	var env = process.env.NODE_ENV != 'production';
	var status = err.status || 500;
	var message = err.message || 'Internal Server Error';

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

	res.status(status).format({
		'html': function() {
			res.render('error', { status: status, message: message, stack: env && err.stack });
		},
		'json': function() {
			res.json({ error: { status: status, message: message, stack: env && err.stack } });
		},
		'text': function() {
			res.type('txt').send(status + ' ' + message);
		}
	});
};

exports.err_404 = function(req, res, next) {
	var status = 404;
	var message = 'Not Found';

	res.status(status).format({
		'html': function() {
			res.render('error', { status: status, message: message });
		},
		'json': function() {
			res.json({ error: { status: status, message: message} });
		},
		'text': function() {
			res.type('txt').send(status + ' ' + message);
		}
	});
};