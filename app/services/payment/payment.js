const { PaymentHandler, domain } = require('../api-provider');

const urlStatus = `${domain}/register/status`;
const urlReturn = `${domain}`


const prividerUrl = 'secure.przelewy24.pl';
const testUrl = 'sandbox.przelewy24.pl'


const payment = new PaymentHandler({
	url: testUrl,
	crc: '997b8c11d25d47f7',
	secret: 'memorium',
	options: {
		merchant_id: '84311',
		pos_id: '84311',
		description: 'asd',
		currency: 'PLN',
		country: 'PL', 
		api_version: '3.2',
		url_return: urlReturn, 
		url_status: urlStatus
	}
});


module.exports = payment;

