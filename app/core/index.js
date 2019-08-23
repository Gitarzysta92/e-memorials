const promotions = require('./partnership-promo');
const registration = require('./registration-session')();


module.exports = {
	startRegistrationProcess,
	updateRegistrationSecondStep,
	addPaymentToken,
	finishRegistratrionProcess,
	getRegProcess,
	usePromoCode,
	addPromoPartner
}

//
// customer registration process
//

// start registration process
function startRegistrationProcess(regToken = '', formData, timeout, pricing) {

  const regProcess = registration.getProcess(regToken);
	if (regProcess) {
		return registration.updateStep(regToken, { firstStep: formData });
	}  
  return registration.initProcess({ firstStep: formData, pricing }, timeout);
}


// update registration process
function updateRegistrationSecondStep(regToken = '', formData) {
  const regProcess = registration.getProcess(regToken);

  //throw error
  if (!regProcess) return;

  regProcess.update({ secondStep: formData });
  const regData = regProcess.getUserData();
	const plan = regProcess.getUserPlan();

  return { id: regToken, data: regData, plan }
}

// add payment token to existing registration session
function addPaymentToken(processID, paymentID) {
	const regProcess = registration.getProcess(processID);
	regProcess.setPaymentToken(paymentID);
}


// finish registration process 
function finishRegistratrionProcess(regToken = '') {
  const regProcess = registration.getProcess(regToken);

  //throw error
  if (!regProcess) return;
	const data = regProcess.getUserData();
	const promoCode = regProcess.getPromoCode();

	promotions.markAsUsed(regProcess.id, promoCode);

  return { id: reqProcess.id, data }; 
}


// get registration process by id
function getRegProcess(regToken = '') {
	return registration.getProcess(regToken);
}




//
// Promotion codes
//


// Use promo code and return
// new subscription prices 
function usePromoCode(code, regToken) {
	const promoCode = promotions.getCode(code);

	if (!promoCode) return;
	return registration.useCode(regToken, promoCode);
}


function addPromoPartner(partnerData) {
  promotions.add(partnerData);
}
