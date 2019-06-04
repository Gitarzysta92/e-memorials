const { dirs } = require('../api-provider');

// GET actions
module.exports.serveStaticJsBundle = function(req, res) {
	res.sendFile(dirs.publicJS + '/public.js');
}



//POST actions





