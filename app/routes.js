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
	server.get('/login', controller.login);
	server.get('/registration', controller.registration);
	server.get('/registration/second-step', controller.registrationSecondStep);
	server.get('/reset-password', controller.resetPasswordPage);
	server.post('/reset-password', controller.resetPassword);


	server.get('/js-bundle', controller.serveStaticJsBundle);

	server.post('/authenticate', controller.authenticate);

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



