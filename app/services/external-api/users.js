const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');

const reqProps = [ 'name', 'surname', 'email', 'password', 'type', 'regDate', 'phone', 'city', 'postCode', 'address' ];


module.exports = function({ eDatabase }) {
	// Create new user
	const create = async function(data) {
		const today = new Date();
		const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		const userData = Object.assign(data, { regDate: date })
		const result = await eDatabase.users.createUser(userData);

		return result;
	}

	// Get user by given id
	const get = async function(id) {
		const result = await eDatabase.users.getUserDataById(id);
		return result;
	}

	// Get all users
	const getAll = async function() {

			const result = await eDatabase.users.getUsersData();
			return result;
	}

	// Update user by given id
	const update = async function(id, data) {
		const result = await eDatabase.users.updateUserDataById(id, data);
		return result;
	}

	// Remove user by given id
	const remove = async function(id) {
		const result = await eDatabase.users.deleteUserById(id);
		return result;
	}

	
	return { create, get, getAll, update, remove }
}



