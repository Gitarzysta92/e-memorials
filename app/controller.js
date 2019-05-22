const homeModel = require('./models/home');
const signinModel = require('./models/sign-in');
const regModel = require('./models/registration')

module.exports.home = function(req, res) {
	res.render('home', homeModel);
}

module.exports.login = function(req, res) {
	res.render('login', signinModel);
}

module.exports.registration = function(req, res) {
	res.render('registration', regModel);
}

module.exports.userPanel = function(req, res) {
	res.render('login');
}





