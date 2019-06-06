const defaultPanelModel = require('../models/panelModel');
const database = require('../db/queries');
const { composer, dirs } = require('../api-provider');
const uuid = require('uuid/v4');

const { domain } = require('../api-provider')

const createModel = composer.getPreset['not-signed-in'];
const createModelSingedIn = composer.getPreset['signed-in'];


class Preview {
	constructor(userID, formData) {
		this.ID = uuid();
		this.userID = userID;
		this._model = this._createModel(formData);
	}

	getModel() {
		return this._model;
	}

	update(formData) {
		this._model = this._createModel(formData);
	}

	async _createModel(data) {
		const { 
			plain, 
			avatar: previewAvatar, 
			documents: previewDocuments, 
			gallery: previewGallery 
		} = data;
		const userPanelModel = await database.getPanelByUserID(this.userID);
		const avatar = await database.getAttachments(this.userID, 'avatar');
		const gallery = await database.getAttachments(this.userID, 'image');
		const documents = await database.getAttachments(this.userID, 'document');
		const currentModel = {
			...userPanelModel,
			avatar,
			documents,
			gallery
		}
		return Object.assign(currentModel, {...plain});
	}
}

const profilePreviews = {}

profilePreviews._sessions = [];

profilePreviews.createPreview = function(userID, formData) {
	const existingPreview = profilePreviews._sessions.find(session => session.userID === userID);
	if (existingPreview) {
		existingPreview.update(formData);
		return existingPreview.ID;
	}
	const preview = new Preview(userID, formData);
	profilePreviews._sessions.push(preview);
	return preview.ID;
}

profilePreviews.getPreviewModel = function(previewID) {
	const preview = profilePreviews._sessions.find(session => session.ID === previewID);
	return preview ? preview.getModel() : false;
}

profilePreviews.removePreviewBy = function(userID) {
	const sessions = profilePreviews._sessions;
	profilePreviews._sessions = sessions.filter(session => !(session.userID === userID));
}







// GET actions
module.exports.userPanel = async function(req, res) {
	const userID = await database.getUserID(req.user);
	const userPanelModel = await database.getPanelByUserID(userID);
	const avatar = await database.getAttachments(userID, 'avatar');
	const gallery = await database.getAttachments(userID, 'image');
	const documents = await database.getAttachments(userID, 'document');
	if (!userPanelModel) {
		return res.redirect('/memorium/edit-profile');
	}
	const dataModel = createModelSingedIn(req, defaultPanelModel,[
		userPanelModel,
		{	
			avatar: avatar[0],
			gallery: gallery,
			documents: documents
		}
	]);
	console.log(dataModel);
	res.render('userPanel', dataModel);
}


module.exports.editProfile = async function(req, res) {
	const userID = await database.getUserID(req.user);
	const userPanelModel = await database.getPanelByUserID(userID);
	const avatar = await database.getAttachments(userID, 'avatar');
	const gallery = await database.getAttachments(userID, 'image');
	const documents = await database.getAttachments(userID, 'document');
	const dataModel = createModelSingedIn(req, userPanelModel,[
		{	
			avatar: avatar,
			gallery: gallery,
			documents: documents
		}
	]);
	console.log(dataModel);
	res.render('editProfile', dataModel);
}


module.exports.userProfile = async function(req, res) {
	const { user_ID: userID, ...userPanelModel } = await database.getProfileByURL(req.params.id);
	const avatar = await database.getAttachments(userID, 'avatar');
	const gallery = await database.getAttachments(userID, 'image');
	const documents = await database.getAttachments(userID, 'document');
	if (userPanelModel ) {
		const dataModel = createModel(req, userPanelModel,[
			{	
				avatar: avatar[0],
				gallery: gallery,
				documents: documents
			}
		]);
		res.render('userPanel', dataModel );
	} else {
		res.render('404', {message: 'Cannot find the page'});
	}
}

module.exports.profilePreviewPage = async function(req, res) {
	const previewModel = await profilePreviews.getPreviewModel(req.params.id);
	if (!previewModel) {
		res.render('404', {message: 'Cannot find the page'});	
	}
	const dataModel = createModelSingedIn(req, previewModel);
	console.log(previewModel);
	res.render('userPanel', dataModel);
}


// POST actions

module.exports.profilePreview = async function(req, res) {
	const userID = await database.getUserID(req.user);
	if (!userID) { 
		return res.send({'error': 'error'});
	}
	const previewID = profilePreviews.createPreview(userID, {
		plain: req.body,
		avatar: req.files.avatar,
		gallery: req.files.photos,
		documents: req.files.documents
	})

	res.send({'redirect': `${domain}/memorium/profile-preview/${previewID}`});
}


module.exports.profileActualization = async function(req, res) {
	const userID = await database.getUserID(req.user);
	if (!userID) { 
		return res.send({'error': 'error'});
	}

	profilePreviews.removePreviewBy(userID);
	
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
