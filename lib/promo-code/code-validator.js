const promoCodes = [
	'kontakt@memorium.pl'
]

module.exports.addCodes = function(codesArray) {
	promoCodes = promoCodes.concat(codesArray);
}


module.exports.validate = function(code) {
	return promoCodes.find(current => current === code);
}