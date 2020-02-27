module.exports = function({ api, services }) {

	const { 
		customersProfiles,
		attachments 
	} = services;


	
	const userProfileCodeAuth = function(req, res) {
		const {code, id} = req.body;
		if (!customersProfiles.isAuthCodeValid(id, code)) {
			return res.send({'error': 'Klucz niepoprawny'})
		}
		res.send({'redirect': `/memorium/${id}&${code}`});
	}


	const profilePreview = async function(req, res) {
		const previewID = await customersProfiles.createProfileDataPreview(req.body, req.user);

		
	}

	const profileCreation = async function(req, res) {
		const userID = await customersProfiles.getUserID(req.user);
		const id = await customersProfiles.createNewProfile(userID);
		id ? res.send({'redirect': `/memorium/${id}`}) : res.send({'error': 'error'});
	}

	const profileActualization = async function(req, res) {
		const { id, ...data } = req.body;
		const profiles = await customersProfiles.getProfiles(req.user);

		const isOwner = profiles.find(profile => profile.unique_ID === id);
		if (!isOwner) res.send({'error': 'error'})

		const result = await customersProfiles.updateProfile(id, data);
		const files = req.files;

		if (files) {
			const photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
			files.photos && attachments.saveAttachments(id, photos, 'image', '/images/gallery/');

			const documents = Array.isArray(req.files.documents) ? req.files.documents : [req.files.documents];
			files.documents && attachments.saveAttachments(id, documents, 'document', '/documents');

			const avatar = Array.isArray(req.files.avatar) ? req.files.avatar : [req.files.avatar];
			files.avatar && attachments.saveAttachments(id, avatar, 'avatar', '/images/avatars/');
		}
		
		if (!result) return res.send({'error': 'error'})
		res.send({'success': 'Profil został zaktualizowany'})
	}	

	return {
		userProfileCodeAuth,
		profilePreview,
		profileCreation,
		profileActualization
	}

}