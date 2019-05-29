module.exports = function(server, controller) {
	// Website endpoints
	server.get('/', controller.home );
	server.get('/qanda', controller.qanda);
	server.get('/contact', controller.contact);
	
	// App main endpoints
	server.get('/memorium', isAuthenticated, controller.userPanel);
	server.get('/memorium/edit-profile', isAuthenticated, controller.editProfile);
	server.get('/memorium/:id', controller.userProfile);
	
	// App authentication endpoints
	server.get('/login', controller.login);
	server.get('/registration', controller.registration);
	server.get('/registration/second-step', controller.registrationSecondStep);

	server.post('/authenticate', controller.authenticate);

	server.post('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	server.post('/register', controller.submitRegistrationFirstStep);
	server.post('/register/next-step', controller.submitRegistrationSecondStep);
	server.post('/register/check-promo-code', controller.checkPromoCode);
	server.get('/register/:id', controller.registrationFinalization);


	// temporary functionality
	server.post('validatePayment', controller.validatePayment);
	



	function isAuthenticated(req, res, next) {
		if (req.user) {
			next()
		} else {
			res.redirect('/login');
		}
	}

}



