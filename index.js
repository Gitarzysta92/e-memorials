const app = require('./app/index.js');

const serverConfig = require('./configs/server-config');
const mailerConfig = require('./configs/mailer-config');
const dbConfig = require('./configs/db-config');
const przelewy24 = require('./configs/przelewy24-config');
const smtpMailer = require('./configs/smtp-config');



const ABSPATH = __dirname;
const defaultPort = 3000;

const memorial = app({
	domain: process.env.DOMAIN || 'http://localhost:' + defaultPort,
	server: {
		port: process.env.PORT || 3000,
		callback: () => console.log('Server listen'),
		config: serverConfig
	},
	mailer: {
		sender: 'kontakt@memorium.pl',
		config: mailerConfig
	},
	database: {
		config: dbConfig	
	},
	dirs: {
		client: `${ABSPATH}/client`,
		library: `${ABSPATH}/lib`,
		utilities: `${ABSPATH}/utils`,
		public: `${ABSPATH}/public`,
		publicJS: `${ABSPATH}/public/js`,
		publicImages: `${ABSPATH}/public/images`
	},
	userPlans: {
		basic: {
			price: 60,
			discount: 10
		},
		premium: {
			price: 120,
			discount: 10
		},
		promoCodes: [
			'kontakt@memorium.pl'
		]
	},
	przelewy24,
	smtpMailer
});

memorial.run();


