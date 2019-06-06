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

// GET actions
module.exports.forgotPasswordPage = function(req, res) {
	const dataModel = createModel(req, forgotPageModel);
	res.render('forgot-password', dataModel);
}


module.exports.resetPasswordPage = function(req, res) {
	const { resetID } = passwordReset.getRequest(req.params.id) || {};
	if (!resetID) {
		res.render('404', {message: 'Cannot find the page'});
	}
	const dataModel = createModel(req, resetPageModel);
	res.cookie('reset-token', resetID, { maxAge: 100000 });
	res.render('reset-password', dataModel);
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
	database.changeUserPassword(username, password)
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

