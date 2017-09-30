var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var Promise = require('promise');
var moment = require('moment');
var User = require('../model/user');
//var Face = require('../model/face');
var crypto = require('crypto');
var async = require('async');
var nodemailer = require('nodemailer');
var CronJob = require('cron').CronJob;
var Mentor = require('../model/mentor');
// Define directory for storing file from multipart request.
// In this case is directory 'uploads' inside same directory with our server

var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');
// The accessKeyId has been deleted
AWS.config.update({ accessKeyId: 'X', secretAccessKey: 'X' });



// Passport used 
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				return done(null, false, {message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					return done(null, false, {message: 'Invalid password'});
				}
			});
		});
	}));


passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});



// get signup page
router.get('/signup', function(req, res, next) {
	res.render('signup');
});

// get login page
router.get('/login', function(req, res, next) {
	
	res.render('login');
});

// get profile page
router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/');
});




// Flag to check if the user has already logged in today

var flagTwoPt = true;

router.post('/login', function(req, res, next) {
	// Check if the username and password match
	passport.authenticate('local', function(err, user, info) {
		if (err) {return next(err);}
		if (!user) {
			req.flash('error_msg', 'Your username and password does not match');
			return res.redirect('/users/login');
		}
		req.logIn(user, function(err) {
			if (err) {return next(err);}
			var loginPt = new Promise(function(resolve, reject) {
				req.flash('success_msg', 'You are logged in');
				
				function timeToMidnight() {
					console.log('2');
					var now = new Date();
					var end = moment().endOf("day");
					return end - now + 1000;
				}

				function midNightReset() {
				// Give 2 free points every day the user logs in
				var reset = new Promise(function(res, rej) {
					if (flagTwoPt === true) {
						req.flash('success_msg', ' You got two points!');
						var newPoint = req.user.point + 2;
						var query = {'username': req.user.username};
						// Update points in db
						User.findOneAndUpdate(query, {
							'point': newPoint
						}, {upsert: true},
						function(err, user){
							if(err) throw err;
							flagTwoPt = false;
						});
					}
					resolve();
				});
				// Reset the flag at mid might
				reset.then(function() {
					flagTwoPt = true;
					setTimeout(midNightReset, timeToMidnight());
				});
				
			}

			midNightReset();
			
			resolve();
		});
			loginPt.then(function() {
				if(req.user.type == "Mentor")
				res.redirect('/Mentor');
				if(req.user.type == 'Student')
				res.redirect('/Student');
			});
		});
})(req, res, next);
});



// signup user
router.post('/signup', function(req, res, next) {
	var signupUsername = req.body.username;
	var signupName = req.body.name;
	var signupEmail = req.body.email;
	var signupPassword = req.body.password;
	var signupConfirmPassword = req.body.passwordConfirm;
	var signupType= req.body.type;
	var signupAvatar = req.body.avatar;
	
	if (req.body.avatar.length === 0) {
		req.checkBody('username', 'Username is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password', 'Password cannot be less than 6').len(6, 30);
		req.checkBody('passwordConfirm', 'Passwords do not match').equals(req.body.password);
		var errors = req.validationErrors();

		if(errors){
			return res.render('signup',{
				errors:errors
			});
		} else {
			var defaultAvatar = "https://thesocietypages.org/socimages/files/2009/05/vimeo.jpg";
			var newUser = new User({
				username: signupUsername,
				email: signupEmail,
				password: signupPassword,			
				avatar: defaultAvatar,
				type:tyep,
				faceId: faceId

			});
		    
			User.find({$or: [{username: signupUsername}, {email: signupEmail}]}, function(err, docs) {
				if (docs.length) {
					req.flash('error_msg', 'The username or email has already existed');
					return res.redirect('/users/signup');
				}
				else {
					User.createUser(newUser, function(err, user){
					if(err) throw err;
					//console.log(user);
					return res.redirect('/users/login');
					});
					req.flash('success_msg', 'You are registered and can now login. You also got 5 points!');
				}
			});
			
		}
	} else {
		fs.readFile(req.body.avatar, function (err, data) {
			if (err) {throw err; }

			var base64data = new Buffer(data, 'binary');
			var s3 = new AWS.S3();
			
			s3.upload({
				Bucket: 'cs307symposium/avatars',
				Key: req.body.avatar,
				Body: base64data,
				ACL: 'public-read'
			}, function (err, res2) {
			// Validation
			req.checkBody('username', 'Name is required').notEmpty();
			req.checkBody('email', 'Email is required').notEmpty();
			req.checkBody('email', 'Email is not valid').isEmail();
			req.checkBody('password', 'Password is required').notEmpty();
			req.checkBody('password', 'Password cannot be less than 6').len(6, 30);
			req.checkBody('passwordConfirm', 'Passwords do not match').equals(req.body.password);
			var errors = req.validationErrors();

			if(errors){
				return res.render('signup',{
					errors:errors
				});
			} else {
				var url = res2.Location;
				//var faceId = face.find(url);
				var newUser = new User({
					username: signupUsername,
					email: signupEmail,
					password: signupPassword,			
					avatar: defaultAvatar,
					faceId: faceId,
					type: signupType
				});

				User.find({$or: [{username: signupUsername}, {email: signupEmail}]}, function(err, docs) {
					if (docs.length) {
						req.flash('error_msg', 'The username or email has already existed');
						return res.redirect('/users/signup');
					}
					else {
						User.createUser(newUser, function(err, user){
						if(err) throw err;
						//console.log(user);
						return res.redirect('/users/login');
						});
						req.flash('success_msg', 'You are registered and can now login. You also got 5 points!');
					}
				});
			}
		});

});
}
});




var newHash = function(query, password){
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(password, salt, function(err, hash) {
			User.findOneAndUpdate(query, {
				'password': hash
			}, {upsert: true}, function(err, user){
				if(err) throw err;
			});
		});
	});
};

module.exports = router;


