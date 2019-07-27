const services = {
	...require('./services/authentication'),
	...require('./services/registration'),
	...require('./services/user-profile'),
	...require('./services/pages'),
	...require('./services/password-reset'),
	...require('./services/miscs')
};


(function(){
	const keys = Object.keys(services) 
	keys.forEach(current => {
		module.exports[current] = services[current];
	});
})();
