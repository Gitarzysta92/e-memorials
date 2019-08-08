const uuid = require('uuid/v4');
const MD5 = require('crypto-js/md5');

module.exports = class Transaction {
	constructor(payment, actions, crc, secret, id) {
		this.sessionID = id || uuid();
		this.actions = actions;
		this.params = payment;
    this.crc = crc;
    this.secretKey = secret;
    this._propsPrefix = 'p24_';

    this.testConnection()
      .then(res => {
        if (res.statusCode !== 200) {
          throw new Error('Connection cannot be established');
        } 
      });
	}

	testConnection() {
		const { p24_merchant_id, p24_pos_id } = this.params;
		const params = {
			p24_merchant_id,
			p24_pos_id,
			p24_sign: MD5(`${p24_merchant_id}|${this.crc}`, this.secretKey).toString()
		}
		return new Promise((resolve, reject) => {
			this.actions.testConnection(params, function(result, err) {
				if (!result) {
					reject(err);
					return;
				};
				resolve(result);
			})
		})
	}

	register() {
    const { p24_merchant_id, p24_currency, p24_amount } = this.params;

    const params = Object.assign({
      p24_session_id: this.sessionID,
      p24_sign: MD5(`${this.sessionID}|${p24_merchant_id}|${p24_amount}|${p24_currency}|${this.crc}`).toString(),
    }, this.params);

 
    return new Promise((resolve, reject) => {
      const self = this;
      this.actions.trnRegister(params, function(res, err) {
        if (!res) {
					reject(err);
					return;
        };
        if (res.body.error > 0) {
          reject(res.body);
          return;
        }
        self.token = res.body.token;
				resolve(res.body.token);
      });
    });
  }
  
  verify(amount, orderID) {
    const { p24_merchant_id, p24_pos_id, p24_currency } = this.params;

    const params = {
      p24_merchant_id,
      p24_pos_id,
      p24_session_id: this.sessionID,
      p24_currency,
      p24_amount: amount,
      p24_order_id: orderID,
      p24_sign: MD5(`${this.sessionID}|${orderID}|${amount}|${p24_currency}|${this.crc}`).toString()
    }

    return new Promise((resolve, reject) => {
      this.actions.trnVerify(params, function(res, err) {
        if (!res) {
					reject(err);
					return;
        };
        if (res.body.error > 0) {
          reject(res.body);
          return;
        }
				resolve(true);
      });
    });
  }
  
}
