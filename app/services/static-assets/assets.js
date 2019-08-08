
module.exports = function({dirs}) {

	const getJsBundleURL = function() {
		return dirs.publicJS + '/public.js'
	}

	return {
		getJsBundleURL
	}
}





