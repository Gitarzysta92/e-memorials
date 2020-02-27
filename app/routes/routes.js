module.exports = function(controller, server) {
	const { isAuthenticated } = controller;
		
	// Website endpoints
	// GET
	server.get('*', controller.staticPage);
	//server.get('/qanda', controller.qanda);
	//server.get('/terms-and-policy', controller.policy);
	//server.get('/contact', controller.contact);

	// POST
	server.post('/form-send-message', controller.sendContactFormMessage);


	// User profile
	// GET
	server.get('/memorium/profile-preview/:id', isAuthenticated, controller.profilePreviewPage);
	server.get('/memorium/dashboard', isAuthenticated, controller.userDashboard);
	server.get('/memorium/edit-profile/:id', isAuthenticated, controller.editProfile);
	server.get('/memorium/:id/auth', controller.userProfileCodeAuthPage);
	server.get('/memorium/:id', controller.userProfile);
	//server.get('/memorium', isAuthenticated, controller.userPanel);	

	
	// POST
	server.post('/memorium/profile-access', controller.userProfileCodeAuth);
	server.post('/memorium/edit-profile', isAuthenticated, controller.profileActualization);
	server.post('/memorium/create-profile', isAuthenticated, controller.profileCreation);
	server.post('/memorium/profile-preview', isAuthenticated, controller.profilePreview);


	// App authentication endpoints
	// POST
	server.post('/authenticate', controller.authenticate);
	server.post('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});


	// Retrieve forgotten password endpoints
	// GET
	//server.get('/forgot-password', controller.forgotPasswordPage);
	//server.get('/reset-password/:id', controller.resetPasswordPage);
	// POST
	server.post('/forgot-password', controller.forgotPassword);
	server.post('/reset-password', controller.resetPassword);


	// Registration endpoints
	// POST
	server.post('/register', controller.submitRegistrationFirstStep);
	server.post('/register/next-step', controller.submitRegistrationSecondStep);
	server.post('/register/check-promo-code', controller.checkPromoCode);
	server.post('/register/status', controller.registrationFinalization);

	
	// Misc
	server.get('/js-bundle', controller.serveStaticJsBundle);


	//
	// External api
	// 

	// user endpoints
	server.post('/api/users', controller.createUser);
	server.get('/api/users/:id', controller.getUserById);
	server.get('/api/users', controller.getAllUsers);
	server.put('/api/users', controller.updateUserById);
	server.delete('/api/users/:id', controller.deleteUserById);


	// partners endpoints
	server.post('/api/partners', controller.createPartner);
	server.get('/api/partners/:id', controller.getPartnerById);
	server.get('/api/partners', controller.getAllPartners);
	server.put('/api/partners', controller.updatePartnerById);
	server.delete('/api/partners/:id', controller.deletePartnerById);
	

	// pages endpoints
	server.post('/api/pages', controller.createPage);
	server.get('/api/pages/:id', controller.getPageById);
	server.get('/api/pages', controller.getAllPages);
	server.put('/api/pages', controller.updatePageById);
	server.delete('/api/pages/:id', controller.deletePageById);

	// files endpoints
	server.post('/api/files', controller.uploadFile)
}
