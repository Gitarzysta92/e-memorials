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
		passwordFiled: 'password'
	},
	async function(username, password, done) {
		const userPass = await database.getUserPassword(username);

		bcrypt.compare(password, userPass, function(err, res) {
			if (err) {
				done(null, false);
			} else if (res) {
				done(null, { username, password });
			}
		})
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
