const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');

const reqProps = [ 'content', 'meta' ];


module.exports = function({ eDatabase }) {

	console.log(eDatabase.pages)
	// Create new page
	const create = async function(data) {
		const result = await eDatabase.pages.createPage(data);
		return result;
	}

	// Get page by given id
	const get = async function(id) {
		const result = await eDatabase.pages.getPageById(id);
		return result;
	}

	// Get all pages
	const getAll = async function() {
			const result = await eDatabase.pages.getPages();
			return result;
	}

	// Update page by given id
	const update = async function(id, data) {
		const result = await eDatabase.pages.updatePageById(id, data);
		return result;
	}

	// Remove page by given id
	const remove = async function(id) {
		const result = await eDatabase.pages.deletePageById(id);
		return result;
	}

	
	return { create, get, getAll, update, remove }
}



