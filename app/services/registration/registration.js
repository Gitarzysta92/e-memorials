const bcrypt = require('bcrypt');


const sendMail = require('../mailer');
const payment = require('../payment');

const { promoCode: promotions, registration, composer } = require('../api-provider');




module.exports = function({core, database, errorHandler}) {
	formData, timeout, regToken = '';

	const firstStep = function() {
		core.registration.firstStep()
	}


	const secondStep = function() {
		core.registration.secondStep()

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


	const finishRegistration = function(regToken, ) {
		core.registration.finalize(token, function() {

		});
	}





	core.registration.onSubmit([
		
	])
	 
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

