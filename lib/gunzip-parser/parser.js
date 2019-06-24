const zlib = require('zlib');

module.exports = function(req, res, next) {
	const gunzip = zlib.createGzip();
		let json = '';

		gunzip.on('data', function(data) {
			json += data.toString();
		})

		gunzip.on('end', function() {
			console.log(json);
		})

		console.log(res);
		res.pipe(gunzip);
		console.log('connection test ', result);
		next();
}