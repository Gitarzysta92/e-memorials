const controller = './controller.js';
const apiProvider = require('./api-provider');
const routesAttach = require('./routes.js');


// core
const core = require('./core');

// services

const 

// library
const { prepareServer, instance } = require('../lib/server/server');
const dbConnect = require('../lib/database-service/db-connect');
const createMailer = require('../lib/mail-sender/mailer');
const setupRegistration = require('../lib/registration/reg-session');
const registerPromoCodes = require('../lib/promo-code/code-validator');
const composer = require('../lib/model-compositor/composer');
const modelStore = require('../lib/model-store/store');
const PaymentHandler = require('../lib/przelewy24/payment-handler');

// utils
//const { apiCaller } = require('../utils/isomorphic-fetch.js');






module.exports = (function() {
	const _reg = {
		expressInstance: instance
	}
	const _lib = {};
	const _utils = {};

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

		_lib.database = dbConnect(database.config); 
		_lib.mailer = createMailer(mailer.config);
		_lib.registration = setupRegistration(userPlans);
		_lib.promoCode = registerPromoCodes(userPlans.promoCodes);
		_lib.composer = composer;
		_lib.modelStore = modelStore;
		_lib.PaymentHandler = PaymentHandler;
		//_utils.apiCaller= apiCaller;
		apiProvider([_reg, _lib, _utils]);

		const _run = prepareServer(server.config, server.port, dirs, server.callback);
		require('./passport/passport.js');
		routesAttach(require(controller), _reg.expressInstance);
 
		return {
			run: _run
		}
	}
})();


