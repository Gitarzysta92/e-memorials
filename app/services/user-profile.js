const defaultPanelModel = require('../models/panelModel');

const database = require('../db/queries');
const { composer } = require('../api-provider');

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
