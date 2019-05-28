const passport = require('passport');
const LocalStrategy = require('passport-local');




const userModel = {
	username: 'test',
	password: 'test'
}





passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordFiled: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done) {
		console.log('strategy', username, password);
		if (username === userModel.username && password === userModel.password) {
			return done(null, userModel);	
		}
		return done(null, false, req.flash('error-message', 'Zły adres e-mail lub login'));
	}
));

passport.serializeUser(function(user, done) {
	console.log('serialize', user.username);
	done(null, user.username);
  });
  
  passport.deserializeUser(function(username, done) {
	if (username === userModel.username) {
		console.log('deserialize',username);
		done(null, userModel);	
	}
  });



/*
passport.use(new LocalStrategy({
	usernameField: 'user[email]',
	passwordField: 'user[password]'
}, (email, password, done) => {
	console.log(email);
	User.findOne({ email })
		.then((user) => {
			if (!user || !user.validatePassword(password)) {
				return done(null, false, {
					errors: {
						'email or password': 'is invaild'
					}
				});
			}
			return done(null, user);
		}).catch(done);
		return done(null, 'asd');
}));

*/