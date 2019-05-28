const controller =  require('./controller.js');
const passport = require('passport');

module.exports = function(server) {
	// Website endpoints
	server.get('/', controller.home );
	server.get('/qanda', controller.qanda);
	server.get('/contact', controller.contact);
	
	// App main endpoints
	server.get('/memorium', isAuthenticated, controller.userPanel);
	//server.get('/memorium', controller.userPanel);
	//server.get('/memorium/list', isAuthenticated, controller.)
	//server.get('/memorium/:id', isAuthenticated, controller.userProfile);
	
	// App authentication endpoints
	server.get('/login', controller.login);
	server.get('/registration', controller.registration);
	server.get('/registration/second-step', controller.registrationSecondStep);

	server.post('/authenticate', passport.authenticate('local', {
		successRedirect: '/memorium',
		failureRedirect: '/login',
		failureFlash: true
	}));

	server.post('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	server.post('/register', controller.submitRegistrationFirstStep);
	server.post('/register/next-step', controller.submitRegistrationSecondStep);
	server.post('/register/check-promo-code', controller.checkPromoCode);


	// temporary functionality
	server.post('validatePayment', controller.validatePayment);
	



	function isAuthenticated(req, res, next) {
		console.log(req.user);
		if (req.user) {
			next()
		} else {
			res.redirect('/login');
		}
	}

}



