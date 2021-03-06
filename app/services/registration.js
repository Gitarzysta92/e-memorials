const bcrypt = require('bcrypt');

const defaultPanelModel = require('../models/panel-model');
const regModel = require('../models/registration');

const sendMail = require('../mailer/mailer');
const database = require('../db/queries');
const payment = require('../payment/payment');

const { promoCode: promotions, registration, composer } = require('../api-provider');
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
	const regProcess = registration.getProcess(req.cookies.regToken);
	if (!regProcess) {
		return res.send({'error': 'Sesja rejestracji wygasła'});
	}
	regProcess.update({ secondStep: req.body });
	
	const regData = regProcess.getUserData();
	const plan = regProcess.getUserPlan();


	const params = {
		amount: plan.price * 100,
		email: regData.email,
		client: `${regData.name} ${regData.surname}`,
		adress: regData.street,
		zip: regData.postalCode,
		city: regData.city,
		transfer_label: `Memorium.pl: ${plan.name}`
	}
	const transaction = payment.createTransaction(regProcess.ID, params);

	transaction.register()
		.then(result => { 
			regProcess.setPaymentToken(result);
			res.send({ 'redirect': `${payment.trnRequestURL}/${result}` });
		})
		.catch(err => console.warn(err));	
}




module.exports.registrationFinalization = async function(req, res) {
	const { 
		p24_session_id: paymentID, 
		p24_order_id: orderID, 
		p24_amount: amount 
	} = req.body;

	if (!(paymentID && orderID && amount)) {
		res.status(400).send('Bad Request');
		return;
	};

	const transaction = payment.getTransaction(paymentID);
	const isVerified = await transaction.verify(orderID, amount);
	console.warn(isVerified);
	isVerified && registerUser(paymentID);

	res.status(200);
	res.send('ok');
}


function registerUser(id) {
	const regProcess = registration.getProcess(id);
	console.log(regProcess);
	if (!regProcess) {
		console.warn(regProcess);
		return
	};

	const { password, ...rest } = regProcess.getUserData();

	// hash password
	const saltRounds = 10;
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = { password: bcrypt.hashSync(password, salt) }
	const regData = Object.assign(rest, hash)

	// Add new user to database and send confirmation mails 
	database.createNewUser(regData, regProcess.ID)
		.then(() => {
			const { email, password } = regData;
			return database.getUserID({
				username: email,
				password: password
			})
		})
		.then(result => {
			return database.createNewProfile(defaultPanelModel, result, regProcess.ID)
		})
		.then(() => {
			const { email, name } = regData;
			if (email) {
				return sendMail.signUpConfirmation(email, name);
			}	
		})
		.then(() => {
			const id = regProcess.ID;
			if (id) {
				return sendMail.notifyAdministration({id, ...regData});
			}		
		})
		.catch(err => {
			console.error(err);
		});

	// Send mail to Email code owner
	const promoEmail = regProcess.getPromoCode();
	promoEmail && sendMail.notifyPromoCodeOwner(promoEmail)
		.catch(console.error);
}
