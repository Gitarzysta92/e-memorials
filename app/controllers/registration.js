const regSessionData = require('./testData/session');

module.exports = function({ api, services }) {
	const { user, payment } = services;
	const { registrationOptions, database } = api;


	//
	// Registration test
	//

	// setTimeout(async function() {
	// 	const regToken = user.registration.firstStep('regToken', regSessionData.firstStep);
	// 	await payment.usePromoCode(regSessionData.promoCode, regToken);
	// 	user.registration.secondStep(regToken, regSessionData.secondStep);
	// 	user.registration.finalize(regToken);
	// }, 4000)


	
	const submitRegistrationFirstStep = async function(req, res) {
		const userExist = await database.isUserAlreadyExists(req.body.email);
		if (userExist) return res.send({'error': 'Użytkownik z podanym mailem już istnieje'});

		const timeout = registrationOptions.sessionTimeout;
		const processID = user.registration.firstStep(req.cookies.regToken, req.body);
		!(req.cookies.regToken === processID) && res.cookie('regToken', processID, { maxAge: timeout });

		res.send({'redirect': '/registration/second-step'})
	}


	const checkPromoCode = async function(req, res) {
		const sessionNotExists = !user.registration.isSessionExists(req.cookies.regToken);
		if (sessionNotExists) return res.send({'error': 'Sesja rejestracji wygasła'});

		const code = req.body.promoCode;
		const token = req.cookies.regToken;
		const promoPrices = await payment.usePromoCode(code, token);

		promoPrices ? res.send(promoPrices) 
			: res.send({'error': 'Podany e-mail promocyjny jest nieprawidłowy.'});

	}

	const submitRegistrationSecondStep = async function(req, res) {
		const { id, data, plan } = user.registration.secondStep(req.cookies.regToken, req.body);

		const paymentID = await payment.initPaymentTransaction(id, data, plan);
		user.registration.setPaymentToken(id, paymentID);

		paymentID && res.send({ 'redirect': `${payment.trnRequestURL}/${paymentID}` });
	}


	const registrationFinalization = async function(req, res) {
		const { 
			p24_session_id: paymentID, 
			p24_order_id: orderID, 
			p24_amount: amount 
		} = req.body;

		
		const result = await payment.finalizePaymentTransaction(paymentID, orderID, amount);
		if (!result) return res.send({'error': 'asd'});

		registration.finalize(paymentID);
		res.status(200);
		res.send('ok');
	}

	return {
		submitRegistrationFirstStep,
		checkPromoCode,
		submitRegistrationSecondStep,
		registrationFinalization
	}
}
