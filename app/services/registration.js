const defaultPanelModel = require('../models/panelModel');
const regModel = require('../models/registration');

const sendMail = require('../mailer/mailer');
const database = require('../db/queries');

const { promoCode: promotions, registration, composer, domain } = require('../api-provider');
const createModel = composer.getPreset['not-signed-in'];


// GET actions
module.exports.registration = function(req, res) {
	const dataModel = createModel(req, regModel);
	res.render('registration', dataModel);
}


module.exports.registrationSecondStep = function(req, res) {
	const dataModel = createModel(req, regModel );
	res.render('registration-second-step', dataModel);
}


// POST actions
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
	const process = registration.getProcess(req.cookies.regToken);
	if (!process) {
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
	res.send({ 'redirect': `${domain}/register/${process.ID}` });
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

	// Add new user to database and send confirmation mails
	const registrationData = regProcess.getUserData();
	database.createNewUser(registrationData, regProcess.ID)
		.then(() => {
			const { email, password } = registrationData;
			return database.getUserID({
				username: email,
				password: password
			})
		})
		.then(result => {
			return database.createNewProfile(defaultPanelModel, result, regProcess.ID)
		})
		.then(() => {
			const { email, name } = registrationData;
			if (email) {
				return sendMail.signUpConfirmation(email, name);
			}	
		})
		.then(() => {
			const id = regProcess.ID;
			if (id) {
				return sendMail.notifyAdministration({id, ...registrationData});
			}		
		})
		.then(res.redirect('/memorium'))
		.catch(err => {
			console.error(err);
			res.render('404', {'message': 'Coś poszło nie tak'})
		});
}


