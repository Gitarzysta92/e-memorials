const passport = require('passport');
const signinModel = require('../models/sign-in');
const { composer } = require('../api-provider');
const createModel = composer.getPreset['not-signed-in'];


// GET actions
module.exports.login = function(req, res) {
	const dataModel = createModel(req, signinModel);
	if (req.user) {
		res.redirect('/memorium');
	} else {
		res.render('login', dataModel);
	}
}


// POST actions
module.exports.authenticate = function(req, res, next) {
	passport.authenticate('local', function(err, user, info){
		if (err) { return next(err) }
		if (!user) { return res.send({'error': 'Nieprawidłowy login lub hasło'}); }
		req.logIn(user, function(err) {
			if (err) { return next(err) }
			return res.send({'redirect': '/memorium'});	
		});
	})(req, res, next);
}



// MIDDLEWARE action
module.exports.isAuthenticated = function(req, res, next) {
	if (req.user) {
		next()
	} else {
		res.redirect('/login');
	}
}