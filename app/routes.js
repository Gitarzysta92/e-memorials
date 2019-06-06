module.exports = function(controller, server) {
	const { isAuthenticated } = controller;
		
	// Website endpoints
	// GET
	server.get('/', controller.home );
	server.get('/qanda', controller.qanda);
	server.get('/contact', controller.contact);
	// POST
	server.post('/form-send-message', controller.sendFormMessage);
	

	// User profile
	// GET
	server.get('/memorium', isAuthenticated, controller.userPanel);
	server.get('/memorium/edit-profile', isAuthenticated, controller.editProfile);
	server.get('/memorium/profile-preview/:id', isAuthenticated, controller.profilePreviewPage);
	server.get('/memorium/:id', controller.userProfile);
	// POST
	server.post('/memorium/edit-profile', isAuthenticated, controller.profileActualization);
	server.post('/memorium/profile-preview', isAuthenticated, controller.profilePreview);


	// App authentication endpoints
	// GET
	server.get('/login', controller.login);
	// POST
	server.post('/authenticate', controller.authenticate);
	server.post('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});


	// Forgotten password retrive endpoints
	// GET
	server.get('/forgot-password', controller.forgotPasswordPage);
	server.get('/reset-password/:id', controller.resetPasswordPage);
	// POST
	server.post('/forgot-password', controller.forgotPassword);
	server.post('/reset-password', controller.resetPassword);


	// Registration 
	// GET
	server.get('/registration', controller.registration);
	server.get('/registration/second-step', controller.registrationSecondStep);
	server.get('/register/:id', controller.registrationFinalization);
	// POST
	server.post('/register', controller.submitRegistrationFirstStep);
	server.post('/register/next-step', controller.submitRegistrationSecondStep);
	server.post('/register/check-promo-code', controller.checkPromoCode);

	

	server.get('/js-bundle', controller.serveStaticJsBundle);
}



