const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');

const reqProps = [ 'name', 'email', 'address', 'city', 'postCode' ]


module.exports = function({ eDatabase }) {
	console.log(eDatabase);
	// Create new page
	const create = async function(data) {
		const result = await eDatabase.partners.createPartner(data);
		console.log(data);
		return result;
	}

	// Get page by given id
	const get = async function(id) {
		const result = await eDatabase.partners.getPartnerDataById(id);
		return result;
	}

	// Get all pages
	const getAll = async function() {
			const result = await eDatabase.partners.getPartnersData();
			return result;
	}

	// Update page by given id
	const update = async function(id, data) {
		const result = await eDatabase.partners.updatePartnerById(id, data);
		return result;
	}

	// Remove page by given id
	const remove = async function(id) {
		const result = await eDatabase.partners.deletePartnerById(id);
		return result;
	}

	
	return { create, get, getAll, update, remove }
}



