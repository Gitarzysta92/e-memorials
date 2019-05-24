const controller =  require('./controller.js');
const passport = require('passport');

module.exports = function(server) {
	// Website endpoints
	server.get('/', controller.home );
	server.get('/qanda', controller.qanda);
	//server.get('/quanda/:slug', controller.quanda);
	//server.get('/contact', controller.contact);
	
	// App main endpoints
	server.get('/memorium', isAuthenticated, controller.userPanel);
	//server.get('/memorium/list', isAuthenticated, controller.)
	//server.get('/memorium/:id', isAuthenticated, controller.userProfile);
	
	// App authentication endpoints
	server.get('/login', controller.login);
	server.get('/registration', controller.registration);

	server.post('/authenticate', passport.authenticate('local', {
		successRedirect: '/memorium',
		failureRedirect: '/login'
	}), function() {});

	server.post('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	server.post('/register', controller.register);

	function isAuthenticated(req, res, next) {
		if (req.user) {
			next()
		} else {
			res.redirect('/login');
		}
	}

}



