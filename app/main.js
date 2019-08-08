// local
const core = require('./core/index');
const dbConnect = require('./database/connect');

// internal services
const userService = require('./services/user');
const paymentService = require('./services/payment');
const mailerService = require('./services/mailer');
const authService = require('./services/authentication');
const attachmentsService = require('./services/attachments');
const customerProfileService = require('./services/customer-profile');
const pagesService = require('./services/pages-composer');
const staticAssetsService = require('./services/static-assets');

// external api services
const externalApiService = require('./services/external-api');

// library
const { prepareServer, instance } = require('./lib/server/server');
const PaymentHandler = require('./lib/przelewy24/payment-handler');
const modelStore = require('./lib/model-store/store');
const modelComposer = require('./lib/model-compositor/composer');




module.exports = function(setup) {
	const { 
		domain, server, dirs, database, mailer, userPlans, przelewy24, smtpMailer
	} = setup;

	const sharedApi = {};
	const services = {};

	// shared constants
	sharedApi.domain = domain;
	sharedApi.mailer = {
		sender: mailer.sender,
		config: smtpMailer
	}
	sharedApi.dirs = dirs;
	sharedApi.registrationOptions = {
		sessionTimeout: 1000 * 60 * 60,
		userPlans
	}

	// database api setup
	const { internalApi, externalApi } = dbConnect(database.config);


	// shared abstractions
	sharedApi.core = core;
	sharedApi.database = internalApi;
	sharedApi.eDatabase = externalApi;
	sharedApi.paymentHandler = new PaymentHandler(przelewy24(domain));
	sharedApi.modelStore = modelStore;
	sharedApi.modelComposer = modelComposer;


	// init services
	services.user = userService(sharedApi);
	services.payment = paymentService(sharedApi);
	services.mailer = mailerService(sharedApi);
	services.user.auth = authService(sharedApi);
	services.attachments = attachmentsService(sharedApi);
	services.customersProfiles = customerProfileService(sharedApi);
	services.pages = pagesService(sharedApi);
	services.assets = staticAssetsService(sharedApi);
	services.externalApi = externalApiService(sharedApi);


	return {
		run: prepareServer(server.config, server.port, dirs, server.callback),
		server: instance,
		sharedApi,
		services
	}

};


