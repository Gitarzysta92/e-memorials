const https = require("https");
const querystring = require('querystring');
const Transaction = require('./transaction');


const header = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Cache-Control': 'no-cache'
}

const requests = {
	testConnection: {
		endpoint: '/testConnection',
		method: 'POST',
		header
	}, 
	trnRegister: {
		endpoint: '/trnRegister',
	//	endpoint: '/trnDirect',
		method: 'POST',
		header
	}, 
	trnStatus: {
		endpoint: '/',
		method: 'POST',
		header
	}, 
	trnVerify: {
		endpoint: '/trnVerify',
		method: 'POST',
		header
	}, 
	trnRequest: {
		endpoint: '/trnRequest',
		method: 'GET'
	}
}


module.exports = class PaymentHandler {
	constructor({url, crc, options, secret}) {
		this.transactions = [];
		this._actions = {};
		this._payment = {};
		this._url = url;
		this._crc = crc;
		this._secret = secret;
		this._propsPrefix = 'p24_';
		this._requiredProps = [ 'merchant_id', 'currency', 'country']

		this._initSetup(options);
	}

	createTransaction(id, options) {
		const params = Object.assign(this._setPropsPrefix(options), this._payment);
		const transaction = new Transaction(params, this._actions, this._crc, this._secret, id);

		this.transactions.push(transaction);
		return transaction;
	}

	getTransaction(id) {	
		return this.transactions.find(trn => trn.sessionID === id);
	}

	get trnRequestURL() {
		return `https://${this._url}${requests.trnRequest.endpoint}`;
	}


	_initSetup(options) {
		// Check is all required properties was defined
		const missedProps = this._requiredProps.filter(prop => !options.hasOwnProperty(prop));
		if (missedProps.length > 0) {
			throw new Error('Following properties are not defined: ' + missedProps.join(','));
		}

		// define handler payment properties
		this._payment = this._setPropsPrefix(options)
		// define api callers
		Object.keys(requests).forEach(req => requests[req].method === 'POST' && Object.defineProperty(this._actions, [req], {
			value: apiCaller({
				host: this._url,
				method: requests[req].method,
				headerPart: requests[req].header,
				path: requests[req].endpoint
			})
		}))
	}
	_setPropsPrefix(obj) {
    return Object.keys(obj).reduce((acc, key) => Object.assign({[this._propsPrefix + key]: obj[key]}, acc), {});
  }
}

function apiCaller(options) {
	const { host, path, method, headerPart } = options;

	return function(data, callback, header, cpath) {
		const requestData = querystring.stringify(data);
		const req = https.request({
			hostname: host,
			path: cpath || path,
			method: method,
			headers: {
				...headerPart,
				...header,
				'Content-Length': requestData.length,
			}
		}, function(res) {
			res.on('data', function(chunk) {
				const result = chunk.toString('utf8');
				Object.defineProperty(res, 'body', {
					value: querystring.parse(result),
					enumerable: true,
					readable: true
				})
				callback(res);
			})
			res.on('error', function(err) {
				callback(false, err);
			}); 
		})
		req.on('error', (e) => {
			console.error(`problem with request: ${e.message}`);
		});
		req.write(requestData);
		req.end();
	}
}
