const defaultPanelModel = require('../models/panelModel');
const database = require('../db/queries');
const { composer, dirs } = require('../api-provider');
const uuid = require('uuid/v4');

const { domain, modelStore: profilePreviews } = require('../api-provider')

const createModel = composer.getPreset['not-signed-in'];
const createModelSingedIn = composer.getPreset['signed-in'];



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
	console.log(userPanelModel);
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

module.exports.profilePreviewPage = function(req, res) {
	const previewModel = profilePreviews.generateModel(req.params.id);
	if (!previewModel) {
		res.render('404', {message: 'Cannot find the page'});	
	}
	const { avatar, ...model } = previewModel;
	const dataModel = createModelSingedIn(req, model, [
		{ avatar: avatar[0]	}
	]);
	res.render('userPanel', dataModel);
}


// POST actions
module.exports.profilePreview = async function(req, res) {
	const userID = await database.getUserID(req.user);
	if (!userID) { 
		return res.send({'error': 'error'});
	}
	
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
	const model = { ...req.body, ...attachments }	



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

	res.send({'redirect': `${domain}/memorium/profile-preview/${previewID}`});
}





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
