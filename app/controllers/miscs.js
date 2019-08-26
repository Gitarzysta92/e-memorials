
module.exports = function({ api, services }) {

	const { assets } = services;
	
	const serveStaticJsBundle = function(req, res) {
		res.sendFile(assets.getJsBundleURL());
	}

	return {
		serveStaticJsBundle,
	}

}
