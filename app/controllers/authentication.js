module.exports = function({ api, services }) {
	const { user } = services;

	// Authenticate user
	const authenticate = function(req, res, next) {
		user.auth.authenticate(req, res, next, function({ error }) {
			console.log(error);
			if (error) return res.send({'error': 'Nieprawidłowy login lub hasło'});
			res.send({'redirect': '/memorium'});
		})
	}

	// Check if user is authenticated
	const isAuthenticated = function(req, res, next) {
		user.auth.isAuthenticated(req, function({ error }) {
			if (error) return res.redirect('/login');
			next();
		});
	}

	return {
		authenticate,
		isAuthenticated
	}
}
