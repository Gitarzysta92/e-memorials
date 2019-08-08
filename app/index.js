

module.exports = function(appParams) {
	// init main app module with services
	const main = require('./main')(appParams);

	// prepare controllers with given app api
	const controllers = require('./controllers')({api: main.sharedApi, services: main.services});
	
	// attach controllers to proper routes
	require('./routes/routes')(controllers, main.server);
	
	return main;
};


