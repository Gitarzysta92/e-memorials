const fs = require('fs');

module.exports = function({ dirs }) {

	

	// Create new payment transaction using payment handler
	const saveFile = function(data) {	
		const { image, name } = data
		const base64data = image.replace(/^data:.*,/, '');

		const encodedName = encodeURI(name);

		const promise = new Promise(function(resolve, reject) {
			fs.writeFile(`${dirs.publicImages}/${encodedName}`, base64data, 'base64', (err) => {
				if (err) {
					return reject(err)
				} else {
					resolve(`/images/${encodedName}`)
				}
			});
		})
		return promise;
	}




	// TO DO: add promo codes CRUD
	return {
		// methods
		saveFile,
	}
}



