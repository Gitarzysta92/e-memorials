const uuid = require('uuid/v4');

const offer = {
	basic: {
		price: 60
	},
	premium: {
		price: 120
	}
}

class _Process {
		constructor(withfirstStep) {
			this.ID = uuid();
			this._initialize(withfirstStep);
			return this.ID;
		}

		update(step) {
			this._steps = Object.assign(this._steps, step)
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

		_initialize(firstStep) {
			this._prices = {
				basic: offer.basic.price,
				premium: offer.premium.price
			}
			this._steps = {
				firstStep: false,
				secondStep: false
			}
			this.update(firstStep);
		}

		_changePrices() {
			const basic = this._prices.basic - 10;
			const premium = this._prices.premium -10;

			this._prices.basic = basic;
			this._prices.premium = premium;
			
			return {
				basic,
				premium
			}
		}
}



let _processes = [];

const initProcess = function(stepObject, expirationTime) {
	const initiatedProcess = new _Process(stepObject);
	_processShoutdown(_processes, expirationTime, initiatedProcess.ID)
	_processes.push(initiatedProcess);
	return initiatedProcess.ID;
}

const getProcess = function(ID) {
	return _processes.find(current => current.ID === ID) || false;
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
 

module.exports = {
	initProcess,
	getProcess,
	updateStep,
	useCode
}