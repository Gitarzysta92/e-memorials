module.exports = function({ api, services }) {

	const { user, mailer } = services;

	const forgotPassword = async function(req, res) {
		const { email } = req.body;
		const resetID = await user.lostPassword.createRequest(email)
		if (!resetID) {
			return res.send({'error': 'Brak użytkownika o podanym adresie e-mail'});
		}
		const link = `${api.domain}/reset-password/${resetID}`;
		mailer.sendMessage('password-reset', { email, link });

		res.send({'success': 'Link z resetem hasła został wysłany'});
	}

	const resetPassword = async function(req, res) {
		const { token, password } = req.body;
		const result = await user.lostPassword.resolveRequest(token, password);
		if (!result) {
			return res.send({'error': 'Sesja restartu hasła wygasła'});
		}
		res.send({'success': 'Hasło zostało zmienione'});
	}

	return {
		forgotPassword,
		resetPassword
	}
}




/*





const bcrypt = require('bcrypt');

const resetPageModel = require('../models/reset-pass');
const forgotPageModel = require('../models/forgot-pass');

const uuid = require('uuid/v4');
const database = require('../db/queries');
const sendMail = require('../mailer/mailer');
const { composer, domain } = require('../api-provider');

const createModel = composer.getPreset['not-signed-in'];
const passwordReset = {};
passwordReset._list = [];

passwordReset.newRequest = function(username) {
	const id = uuid();
	passwordReset._list = [{
		resetID: id,
		username: username
	}, ...passwordReset._list]
	return id
}

passwordReset.getRequest = function(token) {
	return passwordReset._list.find(session => session.resetID === token);
}

passwordReset.removeRequest = function(token) {
	passwordReset._list = passwordReset._list.filter(session => {
		return !(session.resetID === token);
	});
}





// POST actions
module.exports.forgotPassword = async function(req, res) {
	const { email } = req.body;
	const userExist = await database.isUserAlreadyExists(email);
	if (!userExist) {
		return res.send({'error': 'Brak użytkownika o podanym adresie e-mail'});
	}

	const resetID = passwordReset.newRequest(email);
	const resetLink = `${domain}/reset-password/${resetID}`;
	 
	sendMail.sendResetPasswordLink(email, resetLink)
		.then(() => res.send({'success': 'Link z resetem hasła został wysłany'}))
		.catch(console.error);
}


module.exports.resetPassword = function(req, res) {
	const { token, password } = req.body;
	const { username } = passwordReset.getRequest(token) || {};
	if (!username) {
		return res.send({'error': 'Sesja restartu hasła wygasła'});
	}

	// hash password
	const saltRounds = 10;
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt) 

	database.changeUserPassword(username, hash)
		.then(result => {
			if (!result) {
				return res.send({'error': 'Nie udało się zmienić hasła'})	
			} 
			passwordReset.removeRequest(token)
			res.send({'success': 'Hasło zostało zmienione'})
		})
		.catch(err => {
			console.error(err);
			res.render('404', {'message': 'Coś poszło nie tak'})
		});
}

*/