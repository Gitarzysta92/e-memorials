const defaultPanelModel = require('../models/panelModel');
const database = require('../db/queries');
const { composer, dirs } = require('../api-provider');
const uuid = require('uuid/v4');

const createModel = composer.getPreset['not-signed-in'];
const createModelSingedIn = composer.getPreset['signed-in'];


// GET actions
module.exports.userPanel = async function(req, res) {
	const userID = await database.getUserID(req.user);
	const userPanelModel = await database.getPanelByUserID(userID);
	console.log(userPanelModel);
	if (!userPanelModel) {
		return res.redirect('/memorium/edit-profile');
	}
	const dataModel = createModelSingedIn(req, defaultPanelModel,[
		userPanelModel
	]);
	console.log(dataModel);
	res.render('userPanel', dataModel);
}


module.exports.editProfile = async function(req, res) {
	const userID = await database.getUserID(req.user);
	const userPanelModel = await database.getPanelByUserID(userID);
	const dataModel = createModelSingedIn(req, userPanelModel);
	res.render('editProfile', dataModel);
}


module.exports.userProfile = async function(req, res) {
	console.log('request', req.params.id);
	const userPanelModel = await database.getProfileByURL(req.params.id);

	if (userPanelModel) {
		const dataModel = createModel(req, userPanelModel);
		console.log('datamodel', userPanelModel);
		res.render('userPanel', dataModel );
	} else {
		res.render('404', {message: 'Cannot find the page'});
	}
}


// POST actions

module.exports.profilePreview = function(req, res) {

}


module.exports.profileActualization = async function(req, res) {
	const userID = await database.getUserID(req.user);
	if (!userID) { 
		return res.send({'error': 'error'});
	}
	console.log(req);

	database.updateUserProfile(req.body, userID)
	
	if (Object.keys(req.files).length == 0) {
		return res.send({'error': 'error'})
	}


	const avatar = saveFile(req.files.avatar, '/avatars/', function(filePath) {
		database.uploadAvatar(filePath, userID);
	});

	const galleryImages =  req.files.photos || [];
	galleryImages.map(image => {
		return saveFile(image, /gallery/, function(filePath) {
			return database.uploadGalleryImage(filePath, userID);
		})
	});

	const documents =  req.files.documents || [];
	documents.map(image => {
		return saveFile(image, /documents/, function(filePath) {
			return database.uploadDocument(filePath, userID);
		})
	});

	Promise.All([...galleryImages, ...documents, avatar])
		.then(result => result.filter())
	
}


function saveFile(file, path, callback) {
	const fileExt = getExt(file.name);
	const fileName = `${uuid()}.${fileExt}`;
	const filePath = path + fileName;

	file.mv(dirs.publicImages + filePath, function(err) {
		if (err) {
			return;
		}
		return callback(filePath);
	})
}




function getExt(fileName) {
	if (typeof fileName !== 'string') return;
	const name = fileName.split('.');
	
	
	return name[name.length -1];
}