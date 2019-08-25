

module.exports = function({paymentHandler, core, registrationOptions}) {

	
	// setup promo codes
	const { userPlans } = registrationOptions;
	userPlans.promoCodes.forEach(plan => core.addPromoPartner(plan));
	

	// Create new payment transaction using payment handler
	const initPaymentTransaction = function(id, regData, plan) {
		// TO DO: props validation
		const params = {
			amount: plan.price * 100,
			email: regData.email,
			client: `${regData.name} ${regData.surname}`,
			adress: regData.street,
			zip: regData.postalCode,
			city: regData.city,
			transfer_label: `Memorium.pl: ${plan.name}`
		}

		const transaction = paymentHandler.createTransaction(id, params);
		console.log(transaction);
		return transaction.register();	
	}


	// Finalize transaction with given ids
	const finalizePaymentTransaction = async function(paymentID, orderID, amount) {
		if (!(paymentID && orderID && amount)) return;
	
		const transaction = paymentHandler.getTransaction(paymentID);
		const isVerified = await transaction.verify(orderID, amount);
		console.warn(isVerified);

	}


	// Use given promo code
	const usePromoCode = function(code, regToken) {
		return core.usePromoCode(code, regToken);
	}



	// TO DO: add promo codes CRUD
	
	return {
		// methods
		initPaymentTransaction,
		finalizePaymentTransaction,
		usePromoCode,

		// constants
		trnRequestURL: paymentHandler.trnRequestURL
	}
}



