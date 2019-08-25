const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const passport = require('passport');
const LocalStrategy = require('passport-local');


module.exports = function({ database }) {


	// Authenticate client 
	const authenticate = function(req, res, next, cb) {
		passport.authenticate('local', function(err, user, info){	

			if (err) { return cb({error: err}) }
			if (!user) { return cb({error: !user}) }
			
			req.logIn(user, function(err) {
				if (err) { return cb({error: err}) }
				cb({result: 'authenticated'})	
			});
		})(req, res, next);
	}


	// Check client is authenticated
	const isAuthenticated = function(req, cb) {
		if (req.user) {
			cb({result: 'authenticated'})
		} else {
			cb({error: 'notAuthenticated'})
		}
	}

	const isAuth = function(req) {
		if (req.user) {
			return true;
		} else {
			return false;
		}
	}


	// Setup passport user validation strategy
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordFiled: 'password',
			passReqToCallback: true
		},
		async function(req, username, password, done) {
			const passHash = await database.getUserPassword(username);

			if (!passHash) {
				return done(null, false, req.flash('error-message', 'Zły adres e-mail lub login'));
			};
			const isMatch = await bcrypt.compare(password, passHash)

			if (!isMatch) {
				return done(null, false, req.flash('error-message', 'Zły adres e-mail lub login'));
			} 		
			return done(null, { username, password });
			}
	));

	return {
		authenticate,
		isAuthenticated,
		isAuth
	}
}


const users = { list: [] }

users.add = function({username, password}) {
	const userID = uuid();
	users.list.push({
		id: userID,
		username,
		password
	});
	return userID;
}

users.getById = function(id) {
	return { username, password } = users.list.find(current => current.id === id);	
}


passport.serializeUser(function(user, done) {
	console.log('serialize', user.username);
	const userID = users.add(user);
	done(null, userID);
  });
  
passport.deserializeUser(function(userID, done) {
	const user = users.getById(userID);
	if (user) {
		console.log('deserialize',username);
		done(null, user);	
	}
});