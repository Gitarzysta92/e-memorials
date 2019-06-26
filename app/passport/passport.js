const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const database = require('../db/queries');

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

passport.serializeUser(function(user, done) {
	const userID = users.add(user);
	done(null, userID);
  });
  
passport.deserializeUser(function(userID, done) {
	const user = users.getById(userID);
	if (user) {
		done(null, user);	
	}
});
