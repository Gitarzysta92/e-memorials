const uuid = require('uuid/v4');

const offer = {};

class _Process {
		constructor(withfirstStep) {
			this.ID = uuid();
			this._initialize(withfirstStep);
			return this.ID;
		}

		update(step) {
			this._steps = Object.assign(this._steps, step)
		}

		setPaymentToken(token) {
			this.paymentToken = token;
		}

		getPromoCode() {
			return this._promoCode;
		}

		addPromo(code) {
			this._promoCode = code;
			this.addPromo = function() {
				const { basic, premium } = this._prices
				return { basic, premium }
			}
			return this._changePrices();
		}

		getUserData() {
			return this._steps.firstStep;
		}

		getUserPlan() {
			const plan = this._steps.secondStep.subscription;
			if (plan) return {
				name: plan,
				price: this._prices[plan]
			};
		}

		_initialize(firstStep) {
			this._prices = {
				basic: offer.basic.price,
				premium: offer.premium.price
			}
			this._discounts = {
				basic: offer.basic.discount,
				premium: offer.basic.discount
			}
			this._steps = {
				firstStep: false,
				secondStep: false
			}
			this.update(firstStep);
		}

		_changePrices() {
			const basic = this._prices.basic - this._discounts.basic;
			const premium = this._prices.premium - this._discounts.premium;

			this._prices.basic = basic;
			this._prices.premium = premium;
			
			return {
				basic,
				premium
			}
		}
}


const regSetup = function(prices) {
	Object.defineProperties(offer, {
		basic: {
			value: prices.basic
		},
		premium: {
			value: prices.premium
		}
	});

	let _processes = [];

	const initProcess = function(stepObject, expirationTime) {
		const initiatedProcess = new _Process(stepObject);
		_processShoutdown(_processes, expirationTime, initiatedProcess.ID)
		_processes.push(initiatedProcess);
		return initiatedProcess.ID;
	}

	const getProcess = function(ID) {
		console.log(_processes)
		return _processes.find(current => {
			return (current.ID === ID || current.paymentToken === ID);
		}) || false;
	}

	const updateStep = function(ID, stepObject) {
		const foundProcess = getProcess(ID);
		foundProcess.update(stepObject);
		return foundProcess;
	}

	const useCode = function(ID, code) {
		const foundProcess = getProcess(ID);
		return foundProcess.addPromo(code);
	}

	const _processShoutdown = function(processes, expTime, processID) {
		const time = expTime;
		setTimeout(function(){
			processes = processes.filter(current => !(current.ID === processID));
		}, time);
	}

	return {
		initProcess,
		getProcess,
		updateStep,
		useCode
	}
}

module.exports = regSetup;



