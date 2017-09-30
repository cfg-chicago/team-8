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
			
			
			resolve();
		});
			loginPt.then(function() {
				console.log(req.user);
				if(req.user.type == "mentor")
				res.redirect('/mentor');
				if(req.user.type == 'Student')
				res.redirect('/student');
			});
		});
})(req, res, next);
});



// signup user
router.post('/signup', function(req, res, next) {
        console.log(req);	
	var signupUsername = req.body.username;
	//var signupName = req.body.name;
	var signupEmail = req.body.email;
	var signupPassword = req.body.password;
	var signupConfirmPassword = req.body.passwordConfirm;
	var signupType= req.body.type;
	var signupAvatar = req.body.avatar;
    var faceId = 0;
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
				type:signupType,
				faceId: faceId

			});
		    
        console.log("users");	
			User.find({$or: [{username: signupUsername}, {email: signupEmail}]}, function(err, docs) {
				if (docs.length) {
					req.flash('error_msg', 'The username or email has already existed');
					return res.redirect('/users/signup');
				}
				else {
        console.log("users");	
					User.createUser(newUser, function(err, user){
					if(err) throw err;
					console.log(user);
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
						console.log(user);
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


router.post('/profile', function(req, res, next){

	// Get the updated information
	var newEmail = req.body.email;
	var newPassword = req.body.password;
	var newConfirmPassword = req.body.passwordConfirm;
	var newCollege = req.body.college;
	var newMajor = req.body.major;
	var newAvatar = req.body.avatar;

	var query = {'username': req.user.username};

	if (newAvatar.length === 0) {
			// update password
			if (newPassword === newConfirmPassword) {
				

				if (newPassword.length === 0) {
					User.findOneAndUpdate(query, {
						'email': newEmail || '',
						'college': newCollege || '',
						'major': newMajor || ''
					}, {upsert: true},
					function(err, user){
						if(err) throw err;
						// Validation
						req.checkBody('email', 'Email is not valid').isEmail();
						if (newPassword.length !== 0) {
							req.checkBody('password', 'Password cannot be less than 6').len(6, 30);
						}
						var errors = req.validationErrors();
						if(errors){
							req.flash('error_msg', 'Your email is not valid or your password cannot be less than 6');
							res.redirect('/users/profile');
						} else {
							user.save(function(err){
								if (err) {
									return next(err);
								}
								req.flash('success_msg', 'Profile information has been updated.');
								res.redirect('/users/profile');
							});
						}
					});
				}
				else {
					// Validation
					req.checkBody('email', 'Email is not valid').isEmail();
					if (newPassword !== 0) {
						req.checkBody('password', 'Password cannot be less than 6').len(6, 30);
					}
					var errors = req.validationErrors();
					console.log(errors);
					if(errors){
						req.flash('error_msg', 'Your email is not valid or your password cannot be less than 6');
						res.redirect('/users/profile');
					} else {
						var newHashedPw = newHash(query, newPassword);
						User.findOneAndUpdate(query, {
							'email': newEmail || '',
							'college': newCollege || '',
							'major': newMajor || '',
							'password': newHashedPw
						}, {upsert: true},
						function(err, user){
							if(err) throw err;
							
							user.save(function(err){
								if (err) {
									return next(err);
								}
								req.flash('success_msg', 'Profile information has been updated.');
								res.redirect('/users/profile');
							});
							
						});
					}
				}
				
			}
			else {
				req.flash('error_msg', 'Password does not match');
			}
	} else {
		if (newPassword === newConfirmPassword) {
			fs.readFile(newAvatar, function(err, data) {
				if (err) {throw err;}
				var base64data = new Buffer(data, 'binary');
				var s3 = new AWS.S3();
				s3.upload({
					Bucket: 'cs307symposium/avatars',
					Key: newAvatar,
					Body: base64data,
					ACL: 'public-read'
				}, function (err, res2) {
					req.checkBody('email', 'Email is not valid').isEmail();
					if (newPassword.length !== 0) {
						req.checkBody('password', 'Password cannot be less than 6').len(6, 30);
					}
					var errors = req.validationErrors();
					console.log(errors);
					if(errors){
						req.flash('error_msg', 'Your email is not valid or your password cannot be less than 6');
						res.redirect('/users/profile');
					} else {
						var url = res2.Location;
						if (newPassword.length === 0) {
							console.log('test111');
							User.findOneAndUpdate(query, {
								'email': newEmail || '',
								'college': newCollege || '',
								'major': newMajor || '',
								'avatar': url || ''
							}, {upsert: true}, function(err, user) {
								if(err) throw err;
								console.log('The avatar has been successfully modified!');
								user.save(function(err){
									if (err) {
										return next(err);
									}
									req.flash('success_msg', 'Profile information has been updated.');
									res.redirect('/users/profile');
								});
							});
						}
						else {
							var newHashedPw = newHash(query, newPassword);
							console.log('test222');
							User.findOneAndUpdate(query, {
								'email': newEmail || '',
								'college': newCollege || '',
								'major': newMajor || '',
								'avatar': url || '',
								'password': newHashedPw || ''
							}, {upsert: true}, function(err, user) {
								if(err) throw err;
								console.log('The avatar has been successfully modified!');
								user.save(function(err){
									if (err) {
										return next(err);
									}
									req.flash('success_msg', 'Profile information has been updated.');
									res.redirect('/users/profile');
								});
							});
						}
					}
				});
			});
		} else {
			req.flash('error_msg', 'Password does not match');
			res.redirect('/users/profile');
		}
	}

	
});


// Get forgot page
router.get('/forgot', function(req, res, next) {
	res.render('forgot');
});


router.get('/reset/:token', function(req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, function(err, user) {
		if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('/users/forgot');
		}
		console.log(user.username);
		res.render('reset', {token: encodeURIComponent(JSON.stringify(req.params.token))});
	});
});



router.post('/forgot', function(req, res, next) {
	async.waterfall([
		function(done) {
	// Randomly generate a token
	crypto.randomBytes(20, function(err, buf) {
		var token = buf.toString('hex');
		done(err, token);
	});
},
function(token, done) {
	User.findOne({ email: req.body.email }, function(err, user) {
		if (!user) {
			req.flash('error', 'No account with that email address exists.');
			return res.redirect('/users/forgot');
		}

		user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
		done(err, token, user);
        });
    });
},
function(token, user, done) {
	var smtpTransport = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'cs307symposium@gmail.com',
			pass: '04262017'
		}
	});
	var mailOptions = {
		to: user.email,
		from: 'cs307symposium@gmail.com',
		subject: 'Node.js Password Reset',
		text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
		'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
		'http://' + req.headers.host + '/users/reset/' + token + '\r\n' +
		'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	};
	smtpTransport.sendMail(mailOptions, function(err) {
		req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
		done(err, 'done');
	});
}
], function(err) {
	if (err) return next(err);
	res.redirect('/users/login');
});
});


router.post('/reset/:token', function(req, res) {
	console.log('something');
	console.log(req.params.token);

	//console.log(req.user.username);
	async.waterfall([
		function(done) {
			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, function(err, user) {
				if (!user) {
					req.flash('error', 'Password reset token is invalid or has expired.');
					console.log('testingnnnnnnnn');
					return res.redirect('back');
				}
				console.log(user.username);
				var newPassword = req.body.password;
				var query = {'username': user.username};
				newHash(query, newPassword);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
			req.logIn(user, function(err) {
			done(err, user);
			});
        });
    });
		},
		function(user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'cs307symposium@gmail.com',
					pass: '04262017'
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'cs307symposium@gmail.com',
				subject: 'Your password has been changed',
				text: 'Hello,\n\n' +
				'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash('success', 'Success! Your password has been changed.');
				done(err);
			});
		}
		], function(err) {
			res.redirect('/');
		});

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


