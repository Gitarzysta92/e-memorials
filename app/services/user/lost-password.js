const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');


const passwordReset = {};
passwordReset._list = [];

passwordReset.newRequest = function(username) {
	const id = uuid();
	passwordReset._list = [{
		resetID: id,
		username: username
	}, ...passwordReset._list]
	return id;
}

passwordReset.getRequest = function(token) {
	return passwordReset._list.find(session => session.resetID === token);
}

passwordReset.removeRequest = function(token) {
	passwordReset._list = passwordReset._list.filter(session => {
		return !(session.resetID === token);
	});
}



module.exports = function({ database }) {

	// Create new request for password reset
	// returns new request id
	const createRequest = async function(email) {
		const userExist = await database.isUserAlreadyExists(email);

		if (!userExist) return;
		const requestID = passwordReset.newRequest(email); 
		return requestID;
	}


	// Resolve reset password request for given id
	const resolveRequest = async function(requestID, newPassword) {
		const { username } = passwordReset.getRequest(requestID) || {};
		if (!username) return;
	
		// hash password
		const saltRounds = 10;
		const salt = bcrypt.genSaltSync(saltRounds);
		const hash = bcrypt.hashSync(newPassword, salt) 
	
		const result = await database.changeUserPassword(username, hash)	
		passwordReset.removeRequest(token);

		return result ? true : false;
	}

	
	return {
		createRequest,
		resolveRequest
	}
}



