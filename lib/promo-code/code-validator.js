
module.exports = function(codesArray = []) {
	const promoCodes = codesArray;
	return {
		validate: function(code) {
			return promoCodes.find(current => current === code);
		}
	}
}