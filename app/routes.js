module.exports = function(controller, server) {
	const { isAuthenticated } = controller;
		
	// Website endpoints
	server.get('/', controller.home );
	server.get('/qanda', controller.qanda);
	server.get('/contact', controller.contact);
	
	// App main endpoints
	server.get('/memorium', isAuthenticated, controller.userPanel);
	server.get('/memorium/edit-profile', isAuthenticated, controller.editProfile);
	server.get('/memorium/:id', controller.userProfile);


	// App authentication endpoints
	// GET
	server.get('/login', controller.login);
	server.get('/registration', controller.registration);
	server.get('/registration/second-step', controller.registrationSecondStep);
	// POST
	server.post('/authenticate', controller.authenticate);

	// Forgotten password retrive endpoints
	// GET
	server.get('/forgot-password', controller.forgotPasswordPage);
	server.get('/reset-password/:id', controller.resetPasswordPage);
	// POST
	server.post('/forgot-password', controller.forgotPassword);
	server.post('/reset-password', controller.resetPassword);







	server.get('/js-bundle', controller.serveStaticJsBundle);

	server.post('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	server.post('/register', controller.submitRegistrationFirstStep);
	server.post('/register/next-step', controller.submitRegistrationSecondStep);
	server.post('/register/check-promo-code', controller.checkPromoCode);
	server.get('/register/:id', controller.registrationFinalization);

	server.post('/form-send-message', controller.sendFormMessage);

}



