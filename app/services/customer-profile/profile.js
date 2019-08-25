
module.exports = function({ database, modelStore }) {
	const profilePreviews = modelStore;


	const getProfileID = async function(user) {
		return await database.getUserID(user);
	}


	// Get customer profile by id
	const getProfileData = async function(id, code) {
		if (id.length === 36) {
			result = await database.getProfileByUniqueID(id)
		} else {
			result = await database.getPanelByUserID(id)
		}

		const { 
			user_ID: userID, 
			private_key, 	
			...data 
		} = result;

		const restrictionCode = private_key.toString();
		if (restrictionCode.length === 4 && restrictionCode !== code && code !== null) return;
		
		const avatar = await database.getAttachments(userID, 'avatar');
		const gallery = await database.getAttachments(userID, 'image');
		const documents = await database.getAttachments(userID, 'document');

		return { userID, data, avatar, gallery, documents }
	}

	// Update customer profile
	const updateProfile = async function(id, data) {
		profilePreviews.removeContainerBy(id);
		return await database.updateUserProfile(data, id)
			.catch(console.error);
	}


	// Check is given profile auth code is valid
	const isAuthCodeValid = async function(id, code) {
		const { private_key } = await database.getProfileByUniqueID(id);
		const restrictionCode = private_key.toString();

		return (restrictionCode === code)
	}


	// Store temporary profile data for future preview
	const createProfileDataPreview = async function(formData) {
	
		const prepareAttachment = function(prop) {
			if (!Array.isArray(prop) && prop.name.length === 0) {
				return [];
			} else if (prop.name) {
				return [{
					name: prop.name,
					url: prop.tempFilePath
				}]
			}
			return prop.map(current => ({ name: current.name, url: current.tempFilePath}))
		}
	
		const attachments = {
			avatar: prepareAttachment(req.files.avatar),
			gallery: prepareAttachment(req.files.photos),
			documents: prepareAttachment(req.files.documents)
		}
		const model = { ...formData, ...attachments }	
	

		const actualAttachments = {
			avatar: await database.getAttachments(userID, 'avatar'),
			gallery: await database.getAttachments(userID, 'image'),
			documents: await database.getAttachments(userID, 'document')
		}
		const actualModel = { ...await database.getPanelByUserID(userID), ...actualAttachments }


		const previewID = profilePreviews.createContainer(userID, model, function(data) {
			const entries = Object.keys(data);
			const result = entries.reduce((acc, curr) => {	
				let prop = data[curr];
				if (curr === 'avatar' || curr === 'documents' || curr === 'gallery') {
					prop = data[curr].concat(actualModel[curr])
				} 
				const modelPart = { [curr]: prop }
				return Object.assign(acc, modelPart);
			}, {});
			return result;
		});

		return previewID;
	}


	// Get customer profile data preview
	const getProfileDataPreview = function(id) {
		return profilePreviews.generateModel(id);
	}



	return {
		getProfileID,
		getProfileData,
		updateProfile,
		isAuthCodeValid,
		createProfileDataPreview,
		getProfileDataPreview
	}
}