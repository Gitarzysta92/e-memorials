module.exports = function(apiArray) {
	apiArray.forEach(current => _exportEntries(current));
}

const _exportEntries = function(apiObject) {
	const keys = Object.keys(apiObject);
	keys.forEach(current => module.exports[current] = apiObject[current]);
}