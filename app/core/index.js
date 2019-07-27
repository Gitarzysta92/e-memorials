const promotions = require('./partnership-promo');
const registration = require('./registration-session');


//
// customer registration process
//

// start registration process
function startRegistrationProcess(formData, timeout, regToken = '') {
  const regProcess = registration.getProcess(regToken);
	if (regProcess) {
		return registration.updateStep(regToken, { firstStep: formData });
	}  
  return registration.initProcess({ firstStep: formData }, timeout);
}


// update registration process
function updateRegistrationSecondStep(formData, regToken = '') {
  const regProcess = registration.getProcess(regToken);

  //throw error
  if (!regProcess) return;

  regProcess.update({ secondStep: formData });
  const regData = regProcess.getUserData();
	const plan = regProcess.getUserPlan();

  return { ...regData, ...plan }
}

const regSubscribers = []; 

// finish registration process 
function finishRegistratrionProcess(regToken = '', callback) {
  const regProcess = registration.getProcess(id);

  //throw error
  if (!regProcess) return;
  const user = regProcess.getUserData();

  const regData = callback(reqProcess.id, user); 
  regSubscribers.forEach(sub => sub(regData));
}


// registration process hook
function onRegistrationFinish(callback) {
  regSubscribers.push(callback);
}



//
// Premium codes
//

function usePromoCode(code, regToken) {
	const promoCode = promotions.validate(code);
	registration.useCode(regToken, promoCode);
}

const newPartnerSubscribers = [];

function addPromoPartner(partnerData) {
  const partner = promotions.add(partnerData);
  newPartnerSubscribers.forEach(sub => sub(partner));
}

function onNewPartner(callback) {
  newPartnerSubscribers.push(callback);
}


function getAllPromoCodes() {

}

function removePromoCode() {

}






// customer profile
// get all profiles
// get profile
// update profile
// remove profile











function registerUser(id) {
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

module.exports.submitRegistrationSecondStep = function(req, res) {
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
