const uuid = require('uuid/v4');

const offer = {
	basic: {
		price: 60
	},
	premium: {
		price: 120
	}
}


const promoCode = [
	'm.lukasiewicz92@gmail.com'
]


class _Process {
		constructor(withfirstStep) {
			this.ID = uuid();
			this._initialize(withfirstStep);
			return this.ID;
		}

		_initialize(firstStep) {
			this._prices = {
				basic: offer.basic.price,
				premium: offer.premium.price
			}
			this._steps = {
				firstStep: false,
				secondStep: false,
				thirdStep: false
			}
			this.update(firstStep);
		}

		update(step) {
			this._steps = Object.assign(this._steps, step)
		}

}

const _processes = [];

const initProcess = function(stepObject) {
	const initiatedProcess = new _Process(stepObject);
	_processes.push(initiatedProcess);
	return initiatedProcess.ID;
}

const getProcess = function(ID) {
	return _processes.find(current => current.ID === ID) || false;
}

const updateStep = function(ID, stepObject) {
	const foundProcess = getProcess(ID);
	foundProcess.update(stepObject);
	return
}

module.exports = {
	initProcess,
	getProcess,
	updateStep
}