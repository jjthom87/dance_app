var express = require('express');
var path = require('path');
var bcrypt = require('bcryptjs');

var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var models = require('./../models');

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

router.get('/', function(req,res){
	res.sendFile(path.join(__dirname, '../../client/public/index.html'));
});

router.post('/api/register' , (req, res) => {
	models.User.create({
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		username: req.body.username,
		password: req.body.password,
		location: req.body.location,
		studio: req.body.studio,
		dancers: req.body.dancers
	}).then((post) => {
		res.json(post)
	});
});

router.get('/api/login', function(req,res){
	if(req.user){
		res.json({message: 'signed-in', user_id: req.user.id});
	}
});

router.post('/api/login', function(req,res,next){
	passport.authenticate('local-signin', function(err, user, info){
		   if (err) {
		     return next(err);
		   }
		   if (!user) {
		    return res.json({ success : false, message : 'authentication failed', info: info });
		   }
		   req.login(user, function(err){
			if(err){
				return next(err);
			}
		      return res.status(200).json({ success : true, message : 'authentication succeeded', object : user });        
		});
	  })(req, res, next);
});

router.get('/api/logged-in', (req,res) => {
	if(req.user){
		res.json({message: 'logged-in', user: req.user});
	} else {
		res.json({message: 'no req.user'})
	}
})

router.get('/api/schedule' , (req, res) => {
	models.Masterlist.findAll({ order: [
			['id', 'ASC']
		]}).then((response) => {
			res.json(response)
	});
});

router.get('/api/dancers', (req,res) => {
	models.Dancers.findAll({ order: [
			['id', 'ASC']
		]}).then((response) => {
			res.json(response)
	});
})

router.get('*', (req,res) => {
	res.sendFile(path.join(__dirname, '../../client/public/index.html'));
});

module.exports = router;