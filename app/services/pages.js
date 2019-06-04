const homeModel = require('../models/home');
const qandaModel = require('../models/qanda');
const contactModel = require('../models/contact');

const sendMail = require('../mailer/mailer');

const { composer } = require('../api-provider');
const createModel = composer.getPreset['not-signed-in'];
const createModelSingedIn = composer.getPreset['signed-in'];


// GET actions
module.exports.home = function(req, res) {
	const dataModel = createModel(req, homeModel);
	res.render('home', dataModel);
}

module.exports.qanda = function(req, res) {
	const dataModel = req.user 
		? createModelSingedIn(req, qandaModel) 
		: createModel(req, qandaModel);
	res.render('qanda', dataModel);
}


module.exports.contact = function(req, res) {
	const dataModel = createModel(req, contactModel);
	res.render('contact', dataModel);
}


// POST actions
module.exports.sendFormMessage = function(req, res) {
	const body = req.body;
	sendMail.contactForm(body)
		.then(result => res.send({'success': '200'}))
		.catch(err => res.send({'error': err.responseCode}));
}




