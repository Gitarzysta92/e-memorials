
module.exports = function({ api, services }) {

	const { assets } = services;
	
	const serveStaticJsBundle = function(req, res) {
		res.sendFile(assets.getJsBundleURL());
	}

	const sendFormMessage = function() {

	}

	return {
		serveStaticJsBundle,
		sendFormMessage
	}

}

/*

const { dirs } = require('../api-provider');

// GET actions
module.exports.serveStaticJsBundle = function(req, res) {
	res.sendFile(dirs.publicJS + '/public.js');
}


// POST actions
module.exports.sendFormMessage = function(req, res) {
	const body = req.body;
	sendMail.contactForm(body)
		.then(result => res.send({'success': '200'}))
		.catch(err => res.send({'error': err.responseCode}));
}





*/


