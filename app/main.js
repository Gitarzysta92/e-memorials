const { server, instance } = require('./server/server.js');
const serverConfig =  require('./server/serverConfig.js');
const routes = require('./routes/routes.js');
const controller =  require('./controller.js');

require('./passport/passport.js');
//require('./sqlConnect');


module.exports = (function() {
	const _reg = {
		expressInstance: instance
	}
	const _services = {
		preStartup: {},
		startUp: {},
		runtime: {}
	}
	const api = {
		run: _runApp
	}

	function _runApp() {
		_services.startUp.server();
	}

	return function(configuration) {
		const {
			server,
			dir,
			database
		} = configuration;

		_services.startUp.server = initServer(server.port, serverListenNotify(server.notify), dir);
		_services.runtime.routes = createRoutes(_reg.expressInstance);

		return api;
	}
})();




function initServer(port, callback, dirs) {
	const config = function(instance) {
		return serverConfig(instance, dirs)
	}

	const serverListenOn = server(config);

	return function() {
		serverListenOn(port, callback);
	}
}

function serverListenNotify(text) {
	return function() {
	}
}

function createRoutes(expressInstance) {
	return routes(expressInstance, controller);
}
