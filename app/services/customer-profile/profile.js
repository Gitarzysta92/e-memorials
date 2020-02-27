const uuid = require('uuid/v4');


const sampleProfileData = {
	name: 'Podaj Imię i nazwisko',
  birth: '2019-08-13T22:00:00.000Z',
  death: '2019-08-13T22:00:00.000Z',
  sentence: 'Tutaj wpisz swoją wybraną sentencję',
  text: 'Opis'
}


module.exports = function({ database, modelStore }) {
	const profilePreviews = modelStore;


	
	const getProfileID = async function(user) {
		const userID = await database.getUserID(user);
		const { panel_ID } = await database.getPanelIDByUserID(userID); 
		return panel_ID || false;
	}

	const getProfiles = async function(user) {
		const userID = await database.getUserID(user); 
		return await database.getPanelsByUserID(userID);
	}

	const getUserID = async function(user) {
		const userID = await database.getUserID(user);
		return userID || false;
	}

	// Create new user profile
	const createNewProfile = async function(userID) {
		console.log(userID);
		const uniqueID = uuid();
		const result = await database.createNewProfile(sampleProfileData, userID, uniqueID);
		return result ? uniqueID : result;
	}


	// Get customer profile by id
	const getProfileData = async function(id, code) {
		let result;
		if (id.length === 36) {
			result = await database.getProfileByUniqueID(id)
		} else {
			result = await database.getPanelByID(id)
		} 

		if (!result) return;
		const { user_ID: userID, panel_ID: panelID, unique_ID: uniqueID, private_key, 	...data } = result;

		if (private_key != null) {
			const restrictionCode = private_key.toString();
			if (restrictionCode.length === 4 && restrictionCode !== code && code !== null) return {accessRestricted: true};
		}
				
		const avatar = await database.getAttachments(panelID, 'avatar');
		const gallery = await database.getAttachments(panelID, 'image');
		const documents = await database.getAttachments(panelID, 'document');

		return { userID, uniqueID, data, avatar: avatar[avatar.length -1], gallery, documents }
	}


	// Update customer profile
	const updateProfile = async function(id, data) {
		profilePreviews.removeContainerBy(id);
		return await database.updateProfile(data, id)
			.catch(console.error);
	}


	// Check is given profile auth code is valid
	const isAuthCodeValid = async function(id, code) {
		const { private_key } = await database.getProfileByUniqueID(id);
		const restrictionCode = private_key.toString();
		console.log(private_key, restrictionCode);
		return (restrictionCode === code)
	}


	// Store temporary profile data for future preview
	const createProfileDataPreview = async function(formData, user) {
		const userID = await database.getUserID(user)
		const panelID = await getProfileID(user);
	
		const actualAttachments = {
			avatar: await database.getAttachments(panelID, 'avatar'),
			gallery: await database.getAttachments(panelID, 'image'),
			documents: await database.getAttachments(panelID, 'document')
		}

		const attachments = { avatar: [], gallery: [], documents: [] }

		const model = { ...formData, ...attachments }	
		const actualModel = { ...await database.getPanelByUserID(userID), ...actualAttachments }

		const previewID = profilePreviews.createContainer(userID, model, function(data) {
			const entries = Object.keys(data);
			const result = entries.reduce((acc, curr) => {
				let prop = data[curr];

				if (curr === 'avatar' || curr === 'documents' || curr === 'gallery') {
					prop = data[curr].concat(actualModel[curr])
				}

				if (curr === 'avatar') {
					prop = prop[prop.length -1]
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
		getUserID,
		getProfiles,
		getProfileID,
		getProfileData,
		updateProfile,
		isAuthCodeValid,
		createProfileDataPreview,
		getProfileDataPreview,
		createNewProfile
	}
}