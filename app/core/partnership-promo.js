
	const promoCodes = [];

module.exports = {
		getCode: function(code) {
			return promoCodes.find(current => current === code);
		},
		add: function(code) {
			promoCodes.push(code);
		}
	}