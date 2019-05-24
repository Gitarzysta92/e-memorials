const homeModel = require('./models/home');
const signinModel = require('./models/sign-in');
const regModel = require('./models/registration');


const composer = require('../lib/model-compositor/composer');
const registration = require('../lib/registration/reg-session');



const createModel = composer.getPreset['not-signedin'];


// GET actions
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
		{ form: submittedFormFirstStep }
	]);
	res.render('registration', dataModel);
}


module.exports.registrationSecondStep = function(req, res) {
	const storedProcess = registration.getProcess(req.cookies.regToken) || false;
	const submittedFormSecondStep  = storedProcess ? storedProcess.SecondStep : false;
	const dataModel = createModel(req, regModel, [
		{ form: submittedFormSecondStep }
	]);
	res.render('registration-second-step', dataModel);
}


module.exports.userPanel = function(req, res) {
	res.render('login');
}


// POST actions
module.exports.submitRegistrationFirstStep = function(req, res) {
	if (!req.cookies.regToken) {
		const processID = registration.initProcess({ firstStep: req.body });
		res.cookie('regToken', processID, { maxAge: 1000 * 60 * 1 });
	} else {
		registration.updateStep(req.cookies.regToken, { firstStep: req.body });
	}
	res.redirect('registration/second-step');
}

module.exports.submitRegistrationSecondStep = function(req, res) {
	if (!req.cookies.regToken) {
		const processID = registration.initProcess({ firstStep: req.body });
		res.cookie('regToken', processID, { maxAge: 1000 * 60 * 1 });
	} else {
		registration.updateStep(req.cookies.regToken, { firstStep: req.body });
	}
	res.redirect('registration/second-step');
}

module.exports.checkPromoCode = function(req, res) {
	console.log(req.body);
	res.send({
		basic: 10,
		premium: 20
	})
}