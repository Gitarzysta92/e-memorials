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

	
	
	const fileExt = getExt(req.files.avatar.name);
	const fileName = `${uuid()}.${fileExt}`
	const filePath = `/avatars/${fileName}`

	req.files.avatar.mv(dirs.publicImages + filePath, function(err) {
		if (err) {
			console.log(err);
			return;
		}
		database.uploadAvatar(filePath, userID);
	});
}





function getExt(fileName) {
	if (typeof fileName !== 'string') return;
	const name = fileName.split('.');
	
	
	return name[name.length -1];
}