const { 
	getNavigationFor, 
	setNavigationCurrentElement,
	injectPartials
} = require('./directives'); 







//
// Output context creator for handlebars templates
//

const createModel = function(req, model, partials = []) {
	return _iterateOverDirectives({
		request: req, 
		model: JSON.parse(JSON.stringify(model))
	},[
		injectPartials(partials),
		getNavigationFor('unsigned-in-user'),
		setNavigationCurrentElement('active')
	]);
}

const logged = function(req, model, partials = []) {
	return _iterateOverDirectives({
		request: req, 
		model: JSON.parse(JSON.stringify(model))
	},[
		injectPartials(partials),
		getNavigationFor('signed-in-user'),
		setNavigationCurrentElement('active')
	]);
}



const _iterateOverDirectives = function(setup, directives) {
	const { request, model } = setup;
	return directives.reduce((acc, curr) => {
		return Object.assign({}, curr(request, acc));
	}, model);
}



module.exports.getPreset = {
	'not-signed-in' : createModel,
	'signed-in': logged
}