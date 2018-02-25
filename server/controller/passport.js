
var models = require('../models');

var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
		passport.serializeUser(function(user,done){
		done(null, user);
	});

	passport.deserializeUser(function(obj,done){
		done(null, obj);
	});

	passport.use('local-signin', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done){
		process.nextTick(function(){
			models.User.findOne({where: {username: username}}).then(function(user){
				if(!user)
					return done(null, false, {message: 'no user'});
		        if (!bcrypt.compareSync(password, user.get('password_hash'))) {
		          return done(null, false, {message: 'incorrect password'});
		        }
				return done(null, user);
			});
		});
	}));
}