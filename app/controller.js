const homeModel = require('./models/home');
const signinModel = require('./models/sign-in');
const regModel = require('./models/registration');
const navigation = require('./models/navigation')


// website get
module.exports.home = function(req, res) {
	const dataModel = createModel(req, homeModel);
	console.log(res);
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
	const dataModel = createModel(req, regModel);
	res.render('registration', dataModel);
}
module.exports.userPanel = function(req, res) {
	res.render('login');
}


// Post actions

module.exports.register = function(req, res) {
	console.log(req.sessionID);
	//73ec7005-6bf4-440e-8f43-103aaaac19c4
}








//
// Output context creator for handlebars templates
//

const createModel = function(req, model) {
	return _iterateOverDirectives({
		request: req, 
		model: JSON.parse(JSON.stringify(model))
	},[
		getNavigationFor('unsigned-in-user'),
		setNavigationCurrentElement('active')
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
		
		const preparedNavItems = navigation.navItems.map(current => {
			const cssClass = current.meta.class;
			if (current.url === path) {
				current.meta.class = cssClass.concat(' ', activeClass);
			}
			return current;
		})

		navigation.navItems = preparedNavItems;
		return Object.assign(model, navigation);
	}
}

	