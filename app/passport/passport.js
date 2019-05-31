const uuid = require('uuid/v4');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const database = require('../../lib/database-service/db-queries');


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
		const userPass = await database.getUserPassword(username);
		console.log('strategy', username, password, userPass);
		if (password === userPass) {
			return done(null, { username, password });	
		}
		return done(null, false, req.flash('error-message', 'Zły adres e-mail lub login'));
	}
));

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
