const models = {
	'home': require('./models/home'),
	'qanda': require('./models/qanda'),
	'policy': require('./models/policy'),
	'contact': require('./models/contact'),
	'forgot-password': require('./models/forgot-pass'),
	'navigation': require('./models/navigation'),
	'user-profile': require('./models/panel-model'),
	'profile-code-auth': require('./models/profile-code-auth'),
	'registration': require('./models/registration'),
	'reset-password': require('./models/reset-pass'),
	'login': require('./models/sign-in'),
	'edit-profile' : {}

}


module.exports = function({modelComposer, db, ...rest}) {

	const createModel = modelComposer.getPreset['not-signed-in'];
	const createModelSingedIn = modelComposer.getPreset['signed-in'];

	// Create new payment transaction using payment handler
	const getPageData = function(req, {name, isAuthorized, toInject = []}) {
		if (!models.hasOwnProperty(name)) return;
		if (isAuthorized) {
			
			return createModelSingedIn(req, models[name], toInject);
		} else {
			return createModel(req, models[name], toInject);
		}
	}


	return {
		getPageData
	}
}
