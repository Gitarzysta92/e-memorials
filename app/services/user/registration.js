const bcrypt = require('bcrypt');

module.exports = function({core, database, registrationOptions}) {


	
	//
	// User registration
	//
	const { userPlans,  sessionTimeout } = registrationOptions;

	// Initialize registration process with given token
	const registrationFirstStep = function(regToken = '', formData) {
		const { basic, premium } = userPlans;
		const expTime = sessionTimeout;
		// TO DO: props validation
		return core.startRegistrationProcess(regToken, formData, expTime, { basic, premium });
	}


	// Update given registration process by given token
	const registrationSecondStep = function(regToken, formData) {
		// TO DO: props validation
		return core.updateRegistrationSecondStep(regToken, formData);
	}


	// Add user to database from finished registration process
	const registrationFinalize = async function(regToken) {
		// TO DO: props validation
		const user = core.finishRegistratrionProcess(regToken);

		// hash password
		const saltRounds = 10;
		const salt = bcrypt.genSaltSync(saltRounds);
		const hashedPassword = bcrypt.hashSync(user.data.password, salt);
		user.data.password = hashedPassword;

		const result = await database.createNewUser(user.data, user.id);
		console.log(result);
		if (!result.ok) return;  

		return user;
	}


	// check is registration session exists
	// for given client session token
	const isRegSessionExists = function(regToken) {
		const process = core.getRegProcess(regToken);
		console.log('service',process);
		return process ? true : false;
	}


	// add payment id to existing reg session
	const setPaymentToken = function(processID, paymentID) {
		// TO DO: props validation
		core.addPaymentToken(processID, paymentID);
	}
	

	//
	// User lost password
	// 

	
	// TO DO: User CRUD

	return {
		firstStep: registrationFirstStep,
		secondStep: registrationSecondStep,
		finalize: registrationFinalize,
		setPaymentToken,
		isSessionExists: isRegSessionExists
	}
}

