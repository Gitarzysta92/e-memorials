const passport = require('passport');

const defaultPanelModel = require('./models/panelModel');
const homeModel = require('./models/home');
const signinModel = require('./models/sign-in');
const regModel = require('./models/registration');
const qandaModel = require('./models/qanda');
const contactModel = require('./models/contact');

const composer = require('../lib/model-compositor/composer');
const registration = require('../lib/registration/reg-session');
const promotions = require('../lib/promo-code/code-validator');
const database = require('../lib/database-service/db-queries');

const createModel = composer.getPreset['not-signed-in'];
const createModelSingedIn = composer.getPreset['signed-in'];


// GET actions
module.exports.home = function(req, res) {
	const dataModel = createModel(req, homeModel);
	res.render('home', dataModel);
}

module.exports.qanda = function(req, res) {
	const dataModel = req.user 
		? createModelSingedIn(req, qandaModel) 
		: createModel(req, qandaModel);

	res.render('qanda', dataModel);
}


module.exports.contact = function(req, res) {
	const dataModel = createModel(req, contactModel);
	res.render('contact', dataModel);
}


module.exports.userPanel = async function(req, res) {
	const userID = await database.getUserID(req.user);
	const userPanelModel = await database.getPanelByUserID(userID);
	if (!userPanelModel) {
		await database.createNewProfile(defaultPanelModel, userID);
		res.redirect('/memorium/edit-profile');
		return
	}
	const dataModel = createModelSingedIn(req, userPanelModel);
	console.log(dataModel);
	res.render('userPanel', dataModel)
}

module.exports.editProfile = async function(req, res) {
	const userID = await database.getUserID(req.user);
	const userPanelModel = await database.getPanelByUserID(userID);
	const dataModel = createModelSingedIn(req, userPanelModel);
	res.render('userPanel', dataModel)
}


module.exports.userProfile = function(req, res) {
	console.log('request', req.params.id);
	const pageID = req.params.id;
//	const userPanelModel = database.getPageDataBy(pageID);
	
	if (userPanelModel) {
		const dataModel = createModelSingedIn(req, userPanelModel);
		console.log('datamodel', dataModel);
		res.render('userPanel', dataModel );
	} else {
		res.render('404', {message: 'Cannot find the page'})
	}
}

module.exports.login = function(req, res) {
	console.log(req.flash('signinAlert'));
	const signinAlert = req.flash('signinAlert') || false;
	const dataModel = createModel(req, signinModel, [
		{ 
			form: {
				alert: signinAlert
			}
		}
	]);
	if (req.user) {
		res.redirect('/memorium');
	} else {
		res.render('login', dataModel);
	}
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



// need to be fixed
// POST actions
module.exports.authenticate = function(req, res, next) {
	passport.authenticate('local', function(err, user, info){
		if (err) { return next(err) }
		if (!user) { return res.redirect('/login'); }
		req.logIn(user, function(err) {
			if (err) { return next(err) }
			return res.redirect('/memorium');	
		});
	})(req, res, next);
}


module.exports.submitRegistrationFirstStep = function(req, res) {
	const isProcessAlreadyExists = registration.getProcess(req.cookies.regToken) || false;
	if (isProcessAlreadyExists) {
		registration.updateStep(req.cookies.regToken, { firstStep: req.body });
	} else {
		const timeout = 1000 * 60 * 10;
		const processID = registration.initProcess({ firstStep: req.body }, timeout);
		res.cookie('regToken', processID, { maxAge: timeout });
	}
	res.redirect('registration/second-step');
}


module.exports.submitRegistrationSecondStep = function(req, res) {
	if (req.cookies.regToken) {
		const process = registration.updateStep(req.cookies.regToken, { secondStep: req.body })
		res.send({
			url: 'http://localhost:3000/register/' + process.ID,
			regToken: req.cookies.regToken
		});
	} else {
		res.status(403).end()
	}	
}


module.exports.registrationFinalization = function(req, res) {
	const regProcess = registration.getProcess(req.params.id);
	if (!process) {
		res.render('404', {message: 'Cannot find the page'})
		return;
	}
	const registrationData = regProcess.serializeData();
	database.createNewUser(registrationData).then(data => {
		console.log(data);
	}).catch(err => console.log(err));
	res.send('as');
}


module.exports.checkPromoCode = function(req, res) {
	if (!req.cookies.regToken) {
		res.status(403).end()
	}
	const { promoCode: code } = req.body;
	const promoCode = promotions.validate(code);
	const promoPrices = promoCode ? registration.useCode(req.cookies.regToken, promoCode) : false;

	promoPrices ? res.send(promoPrices) 
		: res.status(404).send({message: 'Podany e-mail promocyjny jest nieprawidłowy.'});
}

module.exports.validatePayment = function(req, res) {
	const { accept, regToken } = req.body;
}




