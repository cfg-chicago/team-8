var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

router.get('/', function(req, res, next) {
	//console.log('Get in!');
	if (!req.user) {
		res.render('contact', {
			title: 'Contact'
		});
	} else {
		res.render('contact', {
			username: req.user.username,
			point: req.user.point,
			title: 'Contact'
		});
	}
});

//send email
router.post('/send', function(req, res, next) {
	//console.log('Send Email!!!');
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'team_8tech@gmail.com',
			pass: 'qwertyuiop[]'
		}
	});


	var mailOptions = {
		from: '"team_8 " <team_8tech@gmail.com>', //sender address
		to: 'sun515@purdue.edu, yu599@purdue.edu, kcha@purdue.edu, wang2542@purdue.edu, fu157@purdue.edu', //list of receivers
		subject: 'Hello from team_8', //Subject line
		text: 'You have a submission from Name: ' + req.body.name + 'Email: ' + req.body.email+ 'Message: ' + req.body.message, //plain text body
		html: '<p>You have a submission from </p> <ul><li>Name: ' + req.body.name + '</li><li>Email: ' + req.body.email+ '</li><li>Message: ' + req.body.message + '</li></ul>'//html body
	};
	
	transporter.sendMail(mailOptions, function(error, info) {
		if(error) {
			return console.log(error);
		}
		console.log('Message Sent: ' + info.response);
		res.redirect('/contact');
	});
});
module.exports = router;