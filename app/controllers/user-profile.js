module.exports = function({ api, services }) {

	const { 
		customersProfiles,
		attachments 
	} = services;


	
	const userProfileCodeAuth = function(req, res) {
		const {code, id} = req.body;
		if (customersProfiles.isAuthCodeValid(id, code)) {
			return res.send({'error': 'Klucz niepoprawny'})
		}
		res.send({'redirect': `/memorium/${id}&${code}`});
	}


	const profilePreview = async function(req, res) {
		const previewID = customersProfiles.createProfileDataPreview(req.body);

		res.send({'redirect': `/memorium/profile-preview/${previewID}`});
	}


	const profileActualization = async function(req, res) {
		const id = await customersProfiles.getProfileID(req.user);
		customersProfiles.updateProfile(id, req.body);

		for (let filesCat in req.files) {
			attachments.saveAttachments(id, req.files[filesCat], filesCat, '/images/gallery/');
		}
	}	

	return {
		userProfileCodeAuth,
		profilePreview,
		profileActualization
	}

}


/*


// POST action
// actualize user profile by given form data
module.exports.profileActualization = async function(req, res) {
	const userID = await database.getUserID(req.user);
	if (!userID) { 
		return res.send({'error': 'error'});
	}

	profilePreviews.removeContainerBy(userID);
	
	if (Object.keys(req.files).length == 0) {
		return res.send({'error': 'error'})
	}

	const avatar = saveFile(req.files.avatar, '/images/avatars/')
		.then(file => {
			//const avatar = await database.getAttachments(userID, 'avatar');
			database.addAttachment(file, 'avatar', userID)
		})
		.catch(console.error);

	var photos = req.files.photos;
	photos = Array.isArray(photos) ? photos : [photos];
	const galleryImages = photos.map(image => {
		return saveFile(image, '/images/gallery/')
			.then(file => database.addAttachment(file, 'image', userID))
			.catch(console.error);
	});

	var docs = req.files.documents;
	docs = Array.isArray(docs) ? docs : [docs];
	const documents = docs.map(image => {
		return saveFile(image, '/documents/')
			.then(file => database.addAttachment(file, 'document', userID))
			.catch(console.error);
	});

	console.log(req.body)
	database.updateUserProfile(req.body, userID)
		.then(res.send({'success': 'Profil został zaktualizowany'}))
		.catch(console.error);
}


function saveFile(file, path) {
	const fileExt = getExt(file.name);
	const fileName = `${uuid()}.${fileExt}`;
	const filePath = path + fileName;
	const moveFile = new Promise((resolve, reject) => {
		if (file.name.length == 0) {
			reject(new Error('No file uploaded'));
			return;
		};
		file.mv(dirs.public + filePath, function(err) {
			if (err) {
				reject(err);
			}
			resolve({
				name: file.name,
				path: filePath
			});
		})
	});
	return moveFile;
}




function getExt(fileName) {
	if (typeof fileName !== 'string') return;
	const name = fileName.split('.');
	return name[name.length -1];
}


*/