const passport = require('passport');
const uuid = require('uuid/v4');

const defaultPanelModel = require('./models/panelModel');
const homeModel = require('./models/home');
const signinModel = require('./models/sign-in');
const regModel = require('./models/registration');
const qandaModel = require('./models/qanda');
const contactModel = require('./models/contact');

const sendMail = require('./mailer');
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
		await database.createNewProfile(defaultPanelModel, userID, uuid());
		return res.redirect('/memorium/edit-profile');
	}
	const dataModel = createModelSingedIn(req, defaultPanelModel,[
		userPanelModel
	]);
	console.log(dataModel);
	res.render('userPanel', dataModel);
}



module.exports.editProfile = async function(req, res) {
	const userID = await database.getUserID(req.user);
	const userPanelModel = await database.getPanelByUserID(userID);
	const dataModel = createModelSingedIn(req, userPanelModel);
	res.render('editProfile', dataModel)
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
		{ alert: signinAlert }
	]);
	console.log(req);
	if (req.user) {
		res.redirect('/memorium');
	} else {
		res.render('login', dataModel);
	}
}


module.exports.registration = function(req, res) {
	const dataModel = createModel(req, regModel);
	res.render('registration', dataModel);
}


module.exports.registrationSecondStep = function(req, res) {
	const dataModel = createModel(req, regModel );
	res.render('registration-second-step', dataModel);
}



// need to be fixed
// POST actions
module.exports.authenticate = function(req, res, next) {
	passport.authenticate('local', function(err, user, info){
		if (err) { return next(err) }
		if (!user) { return res.send({'error': 'Nieprawidłowy login lub hasło'}); }
		req.logIn(user, function(err) {
			if (err) { return next(err) }
			return res.send({'redirect': '/memorium'});	
		});
	})(req, res, next);
}


module.exports.submitRegistrationFirstStep = async function(req, res) {
	const userExist = await database.isUserAlreadyExists(req.body.email);
	if (userExist) return res.send({'error': 'Użytkownik z podanym mailem już istnieje'});

	const isProcessAlreadyExists = registration.getProcess(req.cookies.regToken) || false;
	if (isProcessAlreadyExists) {
		registration.updateStep(req.cookies.regToken, { firstStep: req.body });
	} else {
		const timeout = 1000 * 60 * 10;
		const processID = registration.initProcess({ firstStep: req.body }, timeout);
		res.cookie('regToken', processID, { maxAge: timeout });
	}
	res.send({'redirect': 'registration/second-step'});
}


module.exports.checkPromoCode = function(req, res) {
	if (!req.cookies.regToken) {
		return res.send({'error': 'Sesja rejestracji wygasła'})
	}
	const { promoCode: code } = req.body;
	const promoCode = promotions.validate(code);
	const promoPrices = promoCode ? registration.useCode(req.cookies.regToken, promoCode) : false;

	promoPrices ? res.send(promoPrices) 
		: res.send({'error': 'Podany e-mail promocyjny jest nieprawidłowy.'});
}


module.exports.submitRegistrationSecondStep = function(req, res) {
	const process = registration.getProcess(req.cookies.regToken);
	if (!process) {
		return res.send({'error': 'Sesja rejestracji wygasła'});
	}
	process.update({ secondStep: req.body })
	res.send({ 'redirect': 'http://memorium.pl/register/' + process.ID });
	//res.send({ 'redirect': 'http://localhost:3000/register/' + process.ID });
}


module.exports.registrationFinalization = function(req, res) {
	const regProcess = registration.getProcess(req.params.id);
	if (!regProcess) {
		return res.render('404', {'message': 'Podana strona nie istnieje'})
	}
	// Send mail to Email code owner
	const promoEmail = regProcess.getPromoCode();
	promoEmail && sendMail.notifyPromoCodeOwner(promoEmail)
		.catch(console.error);

	// Add new user to database and send confirmation mail
	const registrationData = regProcess.getUserData();
	database.createNewUser(registrationData)
		.then(() => {
			const { email, name } = registrationData;
			if (email) {
				return sendMail.signUpConfirmation(email, name);
			}	
		})
		.then(res.redirect('/memorium'))
		.catch(err => {
			console.error(err);
			res.render('404', {'message': 'Coś poszło nie tak'})
		});
}


module.exports.validatePayment = function(req, res) {
	const { accept, regToken } = req.body;
}












module.exports.sendFormMessage = function(req, res) {
	const body = req.body;
	sendMail.contactForm(body)
		.then(result => res.send({'success': '200'}))
		.catch(err => res.send({'error': err.responseCode}));
}



module.exports.serveStaticJsBundle = function(req, res) {
	res.sendFile(__dirname + '/public.js');
}




