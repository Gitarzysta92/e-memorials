const promoCodes = [
	'm.lukasiewicz92@gmail.com'
]

module.exports.addCodes = function(codesArray) {
	promoCodes = promoCodes.concat(codesArray);
}


module.exports.validate = function(code) {
	return promoCodes.find(current => current === code);
}