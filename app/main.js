const controller = './controller.js';
const apiProvider = require('./api-provider');
const routesAttach = require('./routes.js');


const { prepareServer, instance } = require('../lib/server/server');
const dbConnect = require('../lib/database-service/db-connect');
const createMailer = require('../lib/mail-sender/mailer');
const setupRegistration = require('../lib/registration/reg-session');
const registerPromoCodes = require('../lib/promo-code/code-validator');
const composer = require('../lib/model-compositor/composer');
const modelStore = require('../lib/model-store/store');




module.exports = (function() {
	const _reg = {
		expressInstance: instance
	}
	const _services = {};
	return function(configuration) {
		const { 
			domain, 
			server, 
			dirs, 
			database, 
			mailer,
			userPlans 
		} = configuration;

		_reg.domain = domain;
		_reg.sender = mailer.sender;
		_reg.dirs = dirs;

		_services.database = dbConnect(database.config); 
		_services.mailer = createMailer(mailer.config);
		_services.registration = setupRegistration(userPlans);
		_services.promoCode = registerPromoCodes(userPlans.promoCodes);
		_services.composer = composer;
		_services.modelStore = modelStore;
		apiProvider([_reg, _services]);

		const _run = prepareServer(server.config, server.port, dirs, server.callback);
		require('./passport/passport.js');
		routesAttach(require(controller), _reg.expressInstance);
 
		return {
			run: _run
		}
	}
})();


