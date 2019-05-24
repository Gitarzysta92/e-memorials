const homeModel = require('./models/home');
const signinModel = require('./models/sign-in');
const regModel = require('./models/registration');
const navigation = require('./models/navigation');

const registration = require('../lib/registration/index');


// website get
module.exports.home = function(req, res) {
	const dataModel = createModel(req, homeModel);
	res.render('home', dataModel);
}


module.exports.qanda = function(req, res) {
	const dataModel = createModel(req, homeModel);
	res.render('home', dataModel);
}


module.exports.login = function(req, res) {
	const dataModel = createModel(req, signinModel);
	res.render('login', dataModel);
}


module.exports.registration = function(req, res) {
	const storedProcess = registration.getProcess(req.cookies.regToken) || false;
	const submittedFormFirstStep  = storedProcess ? storedProcess.firstStep : false;
	const dataModel = createModel(req, regModel, [	
		injectToModel(submittedFormFirstStep)
	]);
	res.render('registration', dataModel);
}


module.exports.registrationSecondStep = function(req, res) {
	const storedProcess = registration.getProcess(req.cookies.regToken) || false;
	const submittedFormSecondStep  = storedProcess ? storedProcess.SecondStep : false;
	const dataModel = createModel(req, regModel, [
		injectToModel(submittedFormSecondStep)
	]);
	res.render('registration-second-step', dataModel);
}


module.exports.userPanel = function(req, res) {
	res.render('login');
}


// Post actions

module.exports.submitRegistrationFirstStep = function(req, res) {
	const token = 'token';

	if (!req.cookies.regToken) {
		res.cookie('regToken', token, { maxAge: 1000 * 60 * 1 });
		registration.initProcess({
			id: token,
			body: req.body
		});
	}
	res.redirect('registration/second-step');
}

//
// Output context creator for handlebars templates
//

const createModel = function(req, model, directives = []) {
	return _iterateOverDirectives({
		request: req, 
		model: JSON.parse(JSON.stringify(model))
	},[
		getNavigationFor('unsigned-in-user'),
		setNavigationCurrentElement('active'),
		...directives
	]);
}

const _iterateOverDirectives = function(setup, directives) {
	const { request, model } = setup;
	return directives.reduce((acc, curr) => {
		return Object.assign({}, curr(request, acc));
	}, model);
}


// Depending on user type, provide proper navigation model

const userType = {
	signedIn: 'signed-in-user',
	unsignedIn: 'unsigned-in-user'
}

const getNavigationFor = function(userType) {
	const nav = JSON.parse(JSON.stringify(navigation));
	const navModel = (userType === userType.signedIn) ? 
		nav.logged : nav.notLogged;
	return function(request, model) {
		return Object.assign(model, {navigation: navModel});
	}	
}


// Depending on current path, set "Active" class on matched navigation element

const setNavigationCurrentElement = function(byCssClass) {
	return function(request, model) {
		const activeClass = byCssClass;

		const { navigation } = model;
		const { path } = request;
		const navExists = navigation && 
			navigation.hasOwnProperty('navItems') &&
			Array.isArray(navigation.navItems) &&
			navigation.navItems.length > 0;

		if (!(navExists || path)) return;	
		const pathPart = '/' + path.split('/')[1];
		console.log(pathPart);
		const preparedNavItems = navigation.navItems.map(model => {
			const cssClass = model.meta.class;

			if (model.url ===  pathPart) {
				model.meta.class = cssClass.concat(' ', activeClass);
			}
			return model;
		})

		navigation.navItems = preparedNavItems;
		return Object.assign(model, navigation);
	}
}

	