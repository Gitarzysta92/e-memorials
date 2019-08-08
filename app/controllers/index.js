const controllers = [
	require('./authentication'),
	require('./registration'),
	require('./user-profile'),
	require('./pages'),
	require('./password-reset'),
	require('./miscs'),
	require('./external-api')
]


module.exports = function(api){
	const controllersApi = {}

	controllers.forEach(controller => {
		const controllerApi = controller(api);

		for (let method in controllerApi) {
			Object.defineProperty(controllersApi, method, {
				value: controllerApi[method],
				enumerable: true
			})
		}
	});
	
	return controllersApi;
}



